import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './LetsConnectCanvas.css';

export default function LetsConnectCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const arr = []; // particles
    const c = canvasRef.current;
    if (!c) return;
    
    const ctx = c.getContext("2d");
    const cw = (c.width = 3000);
    const ch = (c.height = 3000);
    
    // Hidden canvas for collision detection
    const c2 = document.createElement('canvas');
    c2.width = cw;
    c2.height = ch;
    const ctx2 = c2.getContext("2d", {willReadFrequently:true});
    
    let isDrawing = true;

    const startAnimation = () => {
      // Natively draw "LET'S CONNECT" onto the hidden canvas for collision detection
      ctx2.fillStyle = "white";
      ctx2.font = "bold 250px Inter, system-ui, sans-serif";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "middle";
      ctx2.fillText("LET'S CONNECT", cw / 2, ch / 2);

      for (let i = 0; i < 1300; i++) makeFlake(i, true);
      gsap.ticker.add(render);
    };

    let animationStarted = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationStarted) {
          animationStarted = true;
          startAnimation();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    if (c) observer.observe(c);

    function makeFlake(i, ff){
      arr.push({ i:i, x:0, x2:0, y:0, s:0 });
      arr[i].t = gsap.timeline({repeat:-1, repeatRefresh:true})
        .fromTo(arr[i], {
          x:()=>-400 + (cw+800) * Math.random(),
          y:-15,
          s:()=>'random(1.8, 7, .1)',
          x2:-500
        }, {
          ease:'none',
          y:ch,
          x:'+='+'random(-400, 400, 1)',
          x2:500
        })
        .seek( ff ? Math.random()*99 : 0) // fast-forward to fill initial state
        .timeScale( arr[i].s / 37 ); // time scale based on flake size
    }

    ctx.fillStyle="#fff";

    function render() {
      if (!isDrawing) return;
      ctx.clearRect(0, 0, cw, ch);
      arr.forEach((c) => {
        if (c.t){
          if (c.t.isActive()){
            const d = ctx2.getImageData(c.x+c.x2, c.y, 1, 1);
            if (d.data[3]>150 && Math.random()>0.5) {
              c.t.pause();
              if (arr.length<9000) makeFlake(arr.length-1, false);
            }
          }
        }
        ctx.beginPath();
        ctx.arc(c.x+c.x2, c.y, c.s*gsap.utils.interpolate(1, .2, c.y/ch), 0, Math.PI * 2);
        ctx.fill();
      });
    }

    return () => {
      isDrawing = false;
      if (observer) observer.disconnect();
      gsap.ticker.remove(render);
      arr.forEach(a => {
        if(a.t) a.t.kill();
      });
    };
  }, []);

  return (
    <div className="lets-connect-bg">  
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
