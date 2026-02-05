import { useEffect, useRef, useState } from 'react';

const AnimusBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Performance optimization: Skip frames
    let frameCount = 0;
    const skipFrames = isMobile || prefersReducedMotion ? 2 : 1;

    // Simplified particles - fewer on mobile
    const particleCount = isMobile ? 30 : prefersReducedMotion ? 40 : 60;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const colors = [
      'rgba(147, 51, 234, ',   // Purple
      'rgba(6, 182, 212, ',    // Cyan
      'rgba(236, 72, 153, ',   // Pink
      'rgba(34, 197, 94, '     // Green
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.2
      });
    }

    // Simplified floating text - fewer on mobile
    const floatingText: Array<{
      text: string;
      x: number;
      y: number;
      opacity: number;
      speed: number;
      color: string;
    }> = [];

    const textItems = [
      'docker', 'kubectl', 'terraform', 'ansible', 'jenkins',
      'aws', 'git', 'prometheus', 'nginx', 'linux',
      'python', 'node', 'kubernetes', 'helm', 'vault',
      'grafana', 'ci/cd', 'devops', 'cloud', 'infra'
    ];

    const textCount = isMobile ? 8 : 15;
    for (let i = 0; i < textCount; i++) {
      floatingText.push({
        text: textItems[Math.floor(Math.random() * textItems.length)],
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.2 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Animation loop with frame skipping
    let animationId: number;
    let lastTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      lastTime = currentTime - (deltaTime % frameInterval);

      // Skip frames for performance
      frameCount++;
      if (frameCount % skipFrames !== 0) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear with trail effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      });

      // Draw connections (only every 3rd particle for performance)
      if (!isMobile) {
        ctx.lineWidth = 0.5;
        const maxDistance = 100;
        for (let i = 0; i < particles.length; i += 3) {
          for (let j = i + 1; j < particles.length; j += 3) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(147, 51, 234, ${0.15 * (1 - distance / maxDistance)})`;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw floating text
      ctx.font = isMobile ? '9px monospace' : '10px monospace';
      floatingText.forEach((item) => {
        ctx.fillStyle = `${item.color}${item.opacity})`;
        ctx.fillText(item.text, item.x, item.y);

        item.y -= item.speed;
        if (item.y < -20) {
          item.y = height + 20;
          item.x = Math.random() * width;
          item.text = textItems[Math.floor(Math.random() * textItems.length)];
        }
      });
    };

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Static render for reduced motion
      ctx.fillStyle = 'rgba(2, 6, 23, 1)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(animationId);
    };
  }, [isMobile]);

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 1) 0%, rgba(2, 6, 23, 1) 100%)'
      }}
    >
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Canvas for particles */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(2, 6, 23, 0.6) 100%)'
        }}
      />
      
      {/* Corner decorations - hidden on mobile */}
      <div className="hidden md:block">
        <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/20 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/20 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/20 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-12 h-16 border-r-2 border-b-2 border-primary/20 rounded-br-lg" />
      </div>
      
      {/* Status indicators - simplified on mobile */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 md:gap-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] md:text-xs text-primary/60 font-mono">SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span className="text-[10px] md:text-xs text-cyan-500/60 font-mono hidden sm:inline">DEVOPS MODE</span>
        </div>
      </div>
      
      {/* Tech readout - hidden on mobile */}
      <div className="hidden md:block absolute top-4 right-4 text-right space-y-1">
        <div className="text-xs text-primary/40 font-mono">RENDERING ENGINE</div>
        <div className="text-xs text-cyan-500/60 font-mono">v2.0.26 ACTIVE</div>
      </div>
      
      {/* Bottom bar - simplified on mobile */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
        <div className="flex gap-3 md:gap-6 text-[9px] md:text-[10px] font-mono">
          <div className="text-cyan-500/60">
            <span className="text-primary/40">CPU:</span> 45%
          </div>
          <div className="text-purple-500/60">
            <span className="text-primary/40">MEM:</span> 62%
          </div>
          <div className="hidden sm:block text-green-500/60">
            <span className="text-primary/40">NET:</span> 1.2GB/s
          </div>
        </div>
        <div className="text-[9px] md:text-[10px] font-mono text-right">
          <div className="text-primary/40 hidden md:block">ACTIVE TOOLS</div>
          <div className="flex gap-2 md:gap-3 mt-1 flex-wrap justify-end">
            <span className="text-cyan-500/80">DOCKER</span>
            <span className="text-purple-500/80">K8s</span>
            <span className="text-green-500/80">TF</span>
            <span className="text-pink-500/80 hidden sm:inline">ANSIBLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimusBackground;
