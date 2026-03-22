"use client";
import { useEffect, useState, useRef } from 'react';

export default function IntroScreen() {
  const [show, setShow] = useState(true);
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('introPlayed')) {
        setShow(false);
        return;
      }
      
      // Lock scroll while intro plays
      document.body.style.overflow = 'hidden';

      // --- CANVAS GEOMETRY ---
      const canvas = canvasRef.current;
      const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null;
      let animId;
      let W, H;
      let time = 0;

      function resize() {
        if (!canvas) return;
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      class AbstractShape {
        constructor() {
          this.x = Math.random() * W;
          this.y = Math.random() * H;
          this.size = Math.random() * 15 + 5;
          this.type = Math.floor(Math.random() * 4);
          this.rot = Math.random() * Math.PI * 2;
          this.rotSpeed = (Math.random() - 0.5) * 0.02;
          this.vx = (Math.random() - 0.5) * 0.3;
          this.vy = (Math.random() - 0.5) * 0.3;
          this.opacity = Math.random() * 0.3 + 0.05;
          this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(255, 255, 255, ';
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.rot += this.rotSpeed;
          if (this.x < -50) this.x = W + 50;
          if (this.x > W + 50) this.x = -50;
          if (this.y < -50) this.y = H + 50;
          if (this.y > H + 50) this.y = -50;
        }
        draw(ctx) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rot);
          ctx.strokeStyle = this.color + this.opacity + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          if (this.type === 0) { // Triangle
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size * 0.866, this.size * 0.5);
            ctx.lineTo(-this.size * 0.866, this.size * 0.5);
            ctx.closePath();
          } else if (this.type === 1) { // Square
            ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
          } else if (this.type === 2) { // Circle
            ctx.arc(0, 0, this.size/2, 0, Math.PI*2);
          } else { // Plus
            ctx.moveTo(-this.size/2, 0);
            ctx.lineTo(this.size/2, 0);
            ctx.moveTo(0, -this.size/2);
            ctx.lineTo(0, this.size/2);
          }
          ctx.stroke();
          ctx.restore();
        }
      }
      
      const abstractShapes = Array.from({ length: 40 }, () => new AbstractShape());

      function drawGeoSphere() {
        if (!ctx) return;
        // Background black
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, W, H);
        
        abstractShapes.forEach(shape => {
          shape.update();
          shape.draw(ctx);
        });

        ctx.save();
        ctx.translate(W/2, H/2);
        
        time += 0.003; // Rotation speed
        
        const radius = Math.min(W, H) * 0.35; // Size of the sphere
        const rings = 12;
        
        ctx.lineWidth = 1;
        
        // Horizontal Rings (Cyan)
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        for(let i=0; i<rings; i++) {
          const angle = (i / rings) * Math.PI;
          const y = Math.cos(angle) * radius;
          const r = Math.sin(angle) * radius;
          const tiltX = Math.sin(time) * 0.4;
          const tiltY = Math.cos(time * 0.8) * 0.2;
          
          ctx.beginPath();
          ctx.ellipse(0, y * tiltY, r, r * Math.abs(Math.sin(time*0.5 + Math.PI/4)), tiltX, 0, Math.PI*2);
          ctx.stroke();
        }
        
        // Vertical Rings (White)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        for(let i=0; i<rings; i++) {
          const angle = (i / rings) * Math.PI;
          ctx.beginPath();
          ctx.ellipse(0, 0, radius * Math.abs(Math.cos(time * 0.7 + angle)), radius, angle + Math.sin(time*0.3), 0, Math.PI*2);
          ctx.stroke();
        }

        ctx.restore();

        animId = requestAnimationFrame(drawGeoSphere);
      }

      animId = requestAnimationFrame(drawGeoSphere);

      // --- SEQUENCE TIMING ---
      // 4.5 seconds gives time to read the phrase (0-2.5s) and AROHAN (2.5s-4.5s)
      const sequenceTimeout = setTimeout(() => {
         setIsZoomingOut(true);
         setTimeout(() => {
            sessionStorage.setItem('introPlayed', 'true');
            setShow(false);
            document.body.style.overflow = '';
         }, 1200); // Matches the CSS transition duration
      }, 4500);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
        clearTimeout(sequenceTimeout);
        document.body.style.overflow = '';
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div 
      // The massive scale and opacity 0 create the zoom-through effect
      className={`fixed inset-0 z-[9999] bg-[#0a0a0a] text-white overflow-hidden cursor-default transition-all duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)] flex flex-col items-center justify-center origin-center ${isZoomingOut ? 'scale-[30] opacity-0 pointer-events-none' : 'scale-100 opacity-100 pointer-events-auto'}`}
      suppressHydrationWarning
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Rajdhani:wght@700&display=swap');

        .tech-phrase {
          position: absolute;
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(16px, 4vw, 36px);
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          animation: techPhraseAnim 2.5s forwards;
          will-change: transform, opacity, filter;
        }

        @keyframes techPhraseAnim {
          0% { opacity: 0; transform: translateY(20px); }
          20% { opacity: 1; transform: translateY(0); }
          75% { opacity: 1; transform: translateY(0); filter: blur(0); }
          100% { opacity: 0; transform: translateY(-40px); filter: blur(4px); }
        }

        .tech-title {
          position: absolute;
          font-family: 'Black Ops One', sans-serif;
          font-size: clamp(40px, 12vw, 150px);
          color: white; /* No glow, just solid white as requested */
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0;
          transform: translateY(40px) scale(0.95);
          animation: techTitleAnim 1.5s forwards 2.3s;
          will-change: transform, opacity;
        }

        @keyframes techTitleAnim {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />

      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none overflow-visible">
        <div className="tech-phrase text-[#00F0FF] mix-blend-screen px-4">Eastern India's Biggest Tech Fest</div>
        <div className="tech-title">A R O H A N</div>
      </div>
    </div>
  );
}
