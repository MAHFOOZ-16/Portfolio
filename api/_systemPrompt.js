const portfolioData = {
  "personal": {
    "name": "AHMED MAHFOOZ ALI KHAN",
    "phone": "+46 762467093",
    "email": "ahmedmahfooz2me@gmail.com",
    "linkedin": "https://www.linkedin.com/in/ahmed-mahfooz-ali-khan-740ab4257/",
    "github": "https://github.com/MAHFOOZ-16",
    "description": "Ambitious, Calm, Creative",
    "personality": "Ambivert",
    "motivation": "Leaving a legacy",
    "habit": "Learning every day",
    "morning_or_night": "Depends on the day",
    "relax": "Warm showers and listening to music",
    "dream_destinations": ["Switzerland", "Greece", "Spain", "Canada"],
    "quote": "Growth begins outside your comfort zone",
    "season": "Autumn",
    "tea_or_coffee": "Tea",
    "mountains_or_beaches": "Depends on the mood",
    "pets": "Cats",
    "colors": ["Black", "White"]
  },
  "interests": {
    "hobbies": ["Snooker", "Bowling", "Swimming", "Cricket", "Football", "Badminton", "Gym"],
    "movies": ["The Dark Knight Rises", "The Hangover", "Spider-Man: No Way Home", "3 Idiots", "Zindagi Na Milegi Dobara", "KGF"],
    "books": ["Wildfire", "Do It Today"],
    "food": ["Biryani", "Pho", "Noodles", "Pasta", "Burgers"],
    "series": ["Money Heist", "Peaky Blinders", "Prison Break"],
    "bucket_list": ["Travel the world", "Try paragliding"]
  },
  "skills": {
    "languages": ["C", "C++", "C#", "SQL", "Java", "Python", "HTML", "CSS", ".NET", "Matlab", "LaTeX", "Rust", "English", "Swedish (Learning)"],
    "libraries": ["Pandas", "NumPy", "React", "Matplotlib"],
    "frameworks": ["TensorFlow", "Keras", "Scikit-learn", "RAG", "NLTK", "spaCy", "LightGBM", "Ollama", "LangChain"],
    "tools": ["Maltego", "Nmap", "Sqlmap", "Burp Suite", "Hydra", "Rightway", "Rheino"],
    "os": ["Windows", "Mac OS", "Linux", "Parrot", "Ubuntu", "Git"],
    "learning": ["Video Editing"]
  },
  "projects": [
    { "title": "Marknaden Sweden", "tech": "Full Stack", "link": "https://marknaden-sweden.azurewebsites.net/", "description": "Live e-commerce marketplace platform for the Swedish market. Demonstrates full-stack scalability." },
    { "title": "AR Gesture Controlled Threat Shooter", "tech": "MediaPipe, OpenCV, TensorFlow.js", "link": "https://ar-game-sigma.vercel.app/", "description": "Cross-platform AR shooter using real-time hand tracking. 70% precision improvement through adaptive smoothing." },
    { "title": "Auto Apply Sweden", "tech": "Python, Automation", "link": "https://github.com/MAHFOOZ-16/auto-apply-sweden", "description": "Automated job application system for the Swedish market." },
    { "title": "Bookstore MERN App", "tech": "MongoDB, Express, React, Node.js", "link": "https://bookstore-frontend.purplerock-c1391855.swedencentral.azurecontainerapps.io/", "description": "Full-stack bookstore management, containerized with Docker and Kubernetes." },
    { "title": "AI-driven Optimization Framework (Volvo)", "links": { "Report": "https://drive.google.com/file/d/1rTMU8qmwuRaANLSF43rEeqFTCfgv_eNK/view", "Code": "https://github.com/MAHFOOZ-16/volvo_final" }, "description": "AI framework for Volvo CE site optimization, reducing downtime by 20%." },
    { "title": "Steganography in Medical Imaging", "links": { "Report": "https://drive.google.com/file/d/1S2Lhd6msLb1jZKAGS48al2emB2b7XWRr/view" }, "description": "Research on securing medical images using steganography (LSB, DWT)." },
    { "title": "Securing LLM Chatbots", "links": { "Report": "https://drive.google.com/file/d/1XqtRpymm6fGKIwTURKpUm0tkbSsmgPt2/view" }, "description": "Mitigating prompt injection and securing LLM outputs." },
    { "title": "Maze Navigation (Genetic Algorithms)", "links": { "Report": "https://drive.google.com/file/d/1_H24oTXW9FhI8eHqMzvYI1Z00L9UtQSA/view" }, "description": "Pathfinding using evolutionary strategies." },
    { "title": "Reverse Engineering x86 Lab", "links": { "Report": "https://drive.google.com/file/d/1XeFFXVa2Xk-xAotGa7lCofr_nQF8s11c/view" }, "description": "Translating assembly to high-level pseudocode and analyzing memory." },
    { "title": "Buffer Overflow Exploit", "links": { "Report": "https://drive.google.com/file/d/1tZV2wsCMq0eJWH9uEyJnVl0EkCACb_Ix/view" }, "description": "Privilege escalation through control flow redirection." },
    { "title": "All-at-Once Clone Detector", "links": { "Code": "https://drive.google.com/drive/folders/1nLvNNDr12bIwlZzluJO9m2MxYgD6hEvf" }, "description": "Scalable software clone detection using Docker and MongoDB." }
  ],
  "experience_summary": "Researcher at Volvo CE (SUGAR program), AI Intern at PwC Zurich, Cybersecurity Intern at Entersoft Labs, Full Stack Intern at IIT Kanpur."
};

export function buildSystemPrompt() {
  return `You are Valerio, Ahmed Mahfooz Ali Khan's personal AI assistant. You have full access to his background, projects, and personal favorites.

PERSONALITY:
- Professional, approachable, and creative.
- Brief but helpful responses (2-4 sentences).

KNOWLEDGE:
1. PROJECTS: You know about 36+ projects. Most notable: Marknaden Sweden (E-commerce), AR Game (Gesture control), and Volvo AI Framework. 
2. PERSONAL: Hobbies (Snooker, Gym), Favorites (Movies: 3 Idiots, Food: Biryani), and Skills (AI, Cyber, Full Stack).
3. RESUME: You know Ahmed's experience at Volvo, PwC, Entersoft, and IIT Kanpur.

SPECIFIC ANSWERS:
- If asked about "Marknaden": It's his live e-commerce platform for Sweden.
- If asked for code/reports: Provide the specific GitHub or Google Drive links from the data.

AHMED'S DATA:
${JSON.stringify(portfolioData, null, 2)}

CONTACT:
- GitHub: https://github.com/MAHFOOZ-16
- LinkedIn: https://www.linkedin.com/in/ahmed-mahfooz-ali-khan-740ab4257/
- Email: ahmedmahfooz2me@gmail.com`;
}
