import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import typegpu from 'unplugin-typegpu/vite'

// Dev middleware that mirrors the Vercel serverless /api/chat endpoint
function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        for await (const chunk of req) body += chunk;

        try {
          const { messages } = JSON.parse(body);
          if (!Array.isArray(messages) || messages.length === 0) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Messages array is required.' }));
            return;
          }

          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'GEMINI_API_KEY not set in .env.local' }));
            return;
          }

          // Lazy-import the system prompt builder
          const { buildSystemPrompt } = await server.ssrLoadModule('/api/_systemPrompt.js');
          const systemPrompt = buildSystemPrompt();

          const sanitized = messages
            .slice(-20)
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: typeof m.content === 'string' ? m.content.slice(0, 500) : '' }],
            }));

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: sanitized,
                generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
              }),
            }
          );

          if (!response.ok) {
            const errBody = await response.text();
            console.error('Gemini API error:', response.status, errBody);
            const msg = response.status === 429
              ? 'Valerio is taking a short break. Please try again in a minute!'
              : 'Failed to get a response from Gemini.';
            res.statusCode = 502;
            res.end(JSON.stringify({ error: msg }));
            return;
          }

          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ reply }));
        } catch (err) {
          console.error('Dev API error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Something went wrong.' }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env.local so GEMINI_API_KEY is available in dev server
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), typegpu(), apiDevPlugin()],
  };
});
