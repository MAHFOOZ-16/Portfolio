import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useInView } from 'framer-motion';
import './TechStack.css';

/* ── Skill Data ── */
const CATEGORIES = [
  {
    name: 'Programming',
    color: '#00d4ff',
    skills: ['C', 'C++', 'Java', 'Python', 'SQL', 'Rust', '.NET'],
  },
  {
    name: 'AI & ML',
    color: '#bd00ff',
    skills: ['TensorFlow', 'Keras', 'Scikit-learn', 'LangChain', 'NLTK', 'spaCy', 'RAG', 'LightGBM'],
  },
  {
    name: 'Cyber Security',
    color: '#00ff88',
    skills: ['Wireshark', 'Nmap', 'Burp Suite', 'Nessus', 'Splunk', 'OWASP', 'MITRE ATT&CK'],
  },
  {
    name: 'Data Science',
    color: '#ff6b35',
    skills: ['Pandas', 'NumPy', 'Matplotlib', 'CNNs', 'RNNs', 'GNNs', 'Clustering'],
  },
  {
    name: 'DevOps & Tools',
    color: '#4dabf7',
    skills: ['React', 'Git', 'Linux', 'Docker', 'HTML/CSS', 'Matlab'],
  },
  {
    name: 'Soft Skills',
    color: '#ffd700',
    skills: ['Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Adaptability', 'Research', 'Critical Thinking'],
  },
];

/* ── Layout Computation ── */
const CAT_RADIUS = 18;
const INNER_R = 31;
const OUTER_R = 42;
const SPREAD = 48;
const clamp = (v, min = 3, max = 97) => Math.max(min, Math.min(max, v));

function computeLayout() {
  const positions = { center: { x: 50, y: 50 } };
  const catNodes = [];
  const skillNodes = [];
  const edges = [];
  const numCats = CATEGORIES.length;

  CATEGORIES.forEach((cat, i) => {
    const angle = (i * 360) / numCats - 90;
    const rad = (angle * Math.PI) / 180;
    const cx = clamp(50 + CAT_RADIUS * Math.cos(rad));
    const cy = clamp(50 + CAT_RADIUS * Math.sin(rad));
    const catId = `cat-${i}`;

    positions[catId] = { x: cx, y: cy };
    catNodes.push({ id: catId, name: cat.name, color: cat.color, catIndex: i });
    edges.push({ from: 'center', to: catId, color: cat.color, catIndex: i, type: 'primary' });

    const numSkills = cat.skills.length;
    cat.skills.forEach((skill, j) => {
      // Alternate between inner and outer ring to avoid overlap
      const isOuter = j % 2 === 1;
      const r = isOuter ? OUTER_R : INNER_R;
      const ringIdx = Math.floor(j / 2);
      const numInRing = isOuter ? Math.floor(numSkills / 2) : Math.ceil(numSkills / 2);
      const ringSpread = isOuter ? SPREAD * 1.1 : SPREAD;
      const offset = numInRing > 1 ? ((ringIdx / (numInRing - 1)) - 0.5) * ringSpread : 0;
      const skillAngle = angle + offset;
      const skillRad = (skillAngle * Math.PI) / 180;
      const sx = clamp(50 + r * Math.cos(skillRad));
      const sy = clamp(50 + r * Math.sin(skillRad));
      const skillId = `skill-${i}-${j}`;

      positions[skillId] = { x: sx, y: sy };
      skillNodes.push({ id: skillId, name: skill, color: cat.color, catIndex: i });
      edges.push({ from: catId, to: skillId, color: cat.color, catIndex: i, type: 'secondary' });
    });
  });

  return { positions, catNodes, skillNodes, edges };
}

/* ── Deterministic float params ── */
function makeFloats(count) {
  return Array.from({ length: count }, (_, i) => ({
    dur: 5.5 + ((i * 1.7) % 3.5),
    delay: (i * 0.9) % 5,
    x: ((i * 7 + 3) % 11) - 5,
    y: ((i * 5 + 7) % 9) - 4,
  }));
}

/* ── Mobile Fallback ── */
function MobileSkills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="tech-stack" className="sg-section">
      <div className="sg-section__header">
        <span className="section-tag">Skills</span>
        <h2 className="section-title">
          Skill <span className="text-highlight">Constellation</span>
        </h2>
      </div>
      <div ref={ref} className={`sg-mobile ${inView ? 'sg-mobile--visible' : ''}`}>
        {CATEGORIES.map((cat, ci) => (
          <div key={cat.name} className="sg-mobile__group" style={{ '--delay': `${ci * 120}ms` }}>
            <h3 className="sg-mobile__title" style={{ color: cat.color }}>
              {cat.name}
            </h3>
            <div className="sg-mobile__badges">
              {cat.skills.map((skill, si) => (
                <span
                  key={skill}
                  className="sg-mobile__badge"
                  style={{
                    borderColor: cat.color,
                    color: cat.color,
                    '--badge-delay': `${ci * 120 + si * 50}ms`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Main Component ── */
export default function TechStack() {
  const [hoveredCat, setHoveredCat] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 768
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const [dragNodeId, setDragNodeId] = useState(null);
  const dragRef = useRef(null);
  const graphRef = useRef(null);
  const isInView = useInView(graphRef, { once: true, margin: '0px 0px -100px 0px' });

  // Compute initial layout once
  const initialLayout = useMemo(() => computeLayout(), []);
  const [positions, setPositions] = useState(() => initialLayout.positions);
  const { edges, catNodes, skillNodes } = initialLayout;

  const skillFloats = useMemo(() => makeFloats(skillNodes.length), [skillNodes.length]);


  // ── Drag Handlers ──
  const handleMouseDown = useCallback((e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = graphRef.current.getBoundingClientRect();
    dragRef.current = {
      nodeId,
      origX: positions[nodeId].x,
      origY: positions[nodeId].y,
      startX: e.clientX,
      startY: e.clientY,
      rectW: rect.width,
      rectH: rect.height,
    };
    setDragNodeId(nodeId);
  }, [positions]);

  useEffect(() => {
    if (!dragNodeId) return;

    const handleMouseMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = ((e.clientX - d.startX) / d.rectW) * 100;
      const dy = ((e.clientY - d.startY) / d.rectH) * 100;
      setPositions((prev) => ({
        ...prev,
        [d.nodeId]: {
          x: clamp(d.origX + dx),
          y: clamp(d.origY + dy),
        },
      }));
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      setDragNodeId(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragNodeId]);

  if (isMobile) return <MobileSkills />;

  const dim = hoveredCat !== null;
  const isDragging = dragNodeId !== null;

  return (
    <section id="tech-stack" className="sg-section">
      <div className="sg-section__header">
        <span className="section-tag">Skills</span>
        <h2 className="section-title">
          Skill <span className="text-highlight">Constellation</span>
        </h2>
      </div>

      <div ref={graphRef} className={`sg ${isInView ? 'sg--visible' : ''} ${isDragging ? 'sg--dragging' : ''}`}>
        {/* ── SVG Connection Lines ── */}
        <svg className="sg__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {edges.map((e, i) => {
            const rawX1 = positions[e.from].x;
            const rawY1 = positions[e.from].y;
            const rawX2 = positions[e.to].x;
            const rawY2 = positions[e.to].y;
            const dx = rawX2 - rawX1;
            const dy = rawY2 - rawY1;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Circle radii in SVG units (generous to clear borders/glow)
            // Center: 120px → 60px radius → 60/850*100 ≈ 7.06, use 8.5
            // Category: 96px → 48px radius → 48/850*100 ≈ 5.65, use 7
            // Skill pill: ~40px tall → 20px radius → 20/850*100 ≈ 2.35, use 3
            const CENTER_R = 8.5;
            const CAT_R = 7;
            const SKILL_R = 3;
            let x1 = rawX1, y1 = rawY1, x2 = rawX2, y2 = rawY2;

            if (dist > 0) {
              const ux = dx / dist;
              const uy = dy / dist;
              if (e.type === 'primary') {
                // center → category: offset both ends to circle edges
                x1 = rawX1 + ux * CENTER_R;
                y1 = rawY1 + uy * CENTER_R;
                x2 = rawX2 - ux * CAT_R;
                y2 = rawY2 - uy * CAT_R;
              } else {
                // category → skill: offset start from category edge, end at skill pill edge
                x1 = rawX1 + ux * CAT_R;
                y1 = rawY1 + uy * CAT_R;
                x2 = rawX2 - ux * SKILL_R;
                y2 = rawY2 - uy * SKILL_R;
              }
            }

            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={e.color}
                strokeWidth={e.type === 'primary' ? 0.18 : 0.1}
                strokeOpacity={
                  dim
                    ? e.catIndex === hoveredCat ? (e.type === 'primary' ? 0.5 : 0.3) : 0.02
                    : e.type === 'primary' ? 0.25 : 0.12
                }
                className="sg__edge"
                style={{ '--edge-delay': `${i * 25}ms` }}
                pathLength="1"
              />
            );
          })}
        </svg>

        {/* ── Center Identity Node ── */}
        <div
          className={`sg__center-pos ${dragNodeId === 'center' ? 'sg__node--dragging' : ''}`}
          style={{ left: `${positions.center.x}%`, top: `${positions.center.y}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'center')}
        >
          <div className="sg__center-orbit" />
          <div className="sg__center-orbit sg__center-orbit--2" />
          <div className="sg__center-core">
            <span className="sg__center-name">Ahmed Mahfooz Ali Khan</span>
          </div>
        </div>

        {/* ── Category Nodes ── */}
        {catNodes.map((node, i) => (
          <div
            key={node.id}
            className={`sg__node-pos ${dragNodeId === node.id ? 'sg__node--dragging' : ''}`}
            style={{
              left: `${positions[node.id].x}%`,
              top: `${positions[node.id].y}%`,
              opacity: dim ? (node.catIndex === hoveredCat ? 1 : 0.12) : 1,
              zIndex: dim && node.catIndex === hoveredCat ? 8 : 5,
            }}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
            onMouseEnter={() => { if (!isDragging) setHoveredCat(node.catIndex); }}
            onMouseLeave={() => { if (!isDragging) setHoveredCat(null); }}
          >
            {/* No float animation on category nodes — they must stay aligned with SVG edges */}
            <div className="sg__cat" style={{ '--enter-delay': `${300 + i * 120}ms`, '--cat-color': node.color }}>
              <div className="sg__cat-ring" />
              <span className="sg__cat-label">{node.name}</span>
            </div>
          </div>
        ))}

        {/* ── Skill Nodes ── */}
        {skillNodes.map((node, i) => (
          <div
            key={node.id}
            className={`sg__node-pos ${dragNodeId === node.id ? 'sg__node--dragging' : ''}`}
            style={{
              left: `${positions[node.id].x}%`,
              top: `${positions[node.id].y}%`,
              opacity: dim ? (node.catIndex === hoveredCat ? 1 : 0.08) : 1,
              zIndex: dim && node.catIndex === hoveredCat ? 7 : 4,
            }}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
            onMouseEnter={() => { if (!isDragging) setHoveredCat(node.catIndex); }}
            onMouseLeave={() => { if (!isDragging) setHoveredCat(null); }}
          >
            <div
              className={`sg__float ${dragNodeId === node.id ? 'sg__float--frozen' : ''}`}
              style={{
                '--float-dur': `${skillFloats[i].dur}s`,
                '--float-delay': `${skillFloats[i].delay}s`,
                '--float-x': `${skillFloats[i].x}px`,
                '--float-y': `${skillFloats[i].y}px`,
              }}
            >
              <div className="sg__skill" style={{ '--enter-delay': `${500 + i * 35}ms`, '--cat-color': node.color }}>
                <span className="sg__skill-text">{node.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
