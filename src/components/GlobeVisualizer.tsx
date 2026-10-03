import React, { useRef, useEffect, useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Compass, Sparkles, Satellite } from 'lucide-react';
import { WORLD_CONTINENT_POLYLINES } from '../data/worldContinents';

interface GlobeVisualizerProps {
  onSelectTamilNadu?: () => void;
  className?: string;
  autoRotate?: boolean;
  interactive?: boolean;
  highlightTamilNadu?: boolean;
  showSatellites?: boolean;
  title?: string;
}

// Satellites orbiting Earth matching NASA Eyes on the Earth reference image
const SATELLITES = [
  { name: 'Suomi NPP', radiusMult: 1.16, speed: 0.018, inclination: 0.65, phase: 0.2, color: '#38bdf8' },
  { name: 'SWOT', radiusMult: 1.22, speed: -0.015, inclination: 0.85, phase: 1.4, color: '#34d399' },
  { name: 'Jason-3', radiusMult: 1.28, speed: 0.012, inclination: 0.45, phase: 2.8, color: '#fbbf24' },
  { name: 'CYGNSS-5', radiusMult: 1.12, speed: -0.022, inclination: 0.25, phase: 4.1, color: '#f472b6' },
  { name: 'OCO-2', radiusMult: 1.34, speed: 0.016, inclination: 0.95, phase: 5.2, color: '#a78bfa' }
];

export const GlobeVisualizer: React.FC<GlobeVisualizerProps> = ({
  onSelectTamilNadu,
  className = '',
  autoRotate = true,
  interactive = true,
  highlightTamilNadu = true,
  showSatellites = true,
  title = 'Earth Climate Orbiter'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Rotation & scale stored in refs for 60fps canvas performance
  const rotXRef = useRef<number>(0.2); // Tilt
  const rotYRef = useRef<number>(-1.35); // Longitude center ~78°E
  const scaleRef = useRef<number>(1);
  const isRotatingRef = useRef<boolean>(autoRotate);
  const [isRotating, setIsRotating] = useState<boolean>(autoRotate);
  const [hovered, setHovered] = useState<boolean>(false);
  const [isZoomingToTN, setIsZoomingToTN] = useState<boolean>(false);

  // Drag & Animation interaction state
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isZoomingRef = useRef(false);
  const zoomStartRef = useRef<{ startX: number; startY: number; startScale: number; startTime: number } | null>(null);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  // Dynamic canvas sizing on container resize with rAF debouncing
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let rafId: number | null = null;

    const handleResize = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        if (!container || !canvas) return;
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const targetW = Math.max(320, Math.floor(rect.width * dpr));
        const targetH = Math.max(320, Math.floor(rect.height * dpr));
        
        // Only update if dimensions actually changed
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }
      });
    };

    handleResize();
    const ro = new ResizeObserver(() => {
      handleResize();
    });
    ro.observe(container);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      ro.disconnect();
    };
  }, []);

  // Trigger cinematic zoom into Tamil Nadu
  const triggerZoomIntoTamilNadu = () => {
    if (isZoomingRef.current) return;
    isZoomingRef.current = true;
    setIsZoomingToTN(true);
    setIsRotating(false);
    isRotatingRef.current = false;

    const targetRotX = 0.193; // 11.1°N
    const rawTargetRotY = -1.37; // 78.5°E

    // Calculate shortest angular path for rotY
    const currentRotY = rotYRef.current;
    const twoPi = Math.PI * 2;
    let deltaY = ((rawTargetRotY - currentRotY) % twoPi);
    if (deltaY > Math.PI) deltaY -= twoPi;
    if (deltaY < -Math.PI) deltaY += twoPi;

    zoomStartRef.current = {
      startX: rotXRef.current,
      startY: currentRotY,
      startScale: scaleRef.current,
      startTime: performance.now(),
    };

    // Callback after zoom animation completes (~850ms)
    setTimeout(() => {
      if (onSelectTamilNadu) {
        onSelectTamilNadu();
      }
    }, 850);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.015;

      // Handle zooming animation progress smoothly in canvas loop
      if (isZoomingRef.current && zoomStartRef.current) {
        const elapsed = performance.now() - zoomStartRef.current.startTime;
        const duration = 800; // ms
        const p = Math.min(1, elapsed / duration);
        // Smooth easeInOutCubic curve
        const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

        const targetRotX = 0.193;
        rotXRef.current = zoomStartRef.current.startX + (targetRotX - zoomStartRef.current.startX) * ease;
        rotYRef.current = zoomStartRef.current.startY + ((-1.37 - zoomStartRef.current.startY) * ease);
        scaleRef.current = zoomStartRef.current.startScale + (4.2 - zoomStartRef.current.startScale) * ease;
      } else if (isRotatingRef.current && !isDraggingRef.current) {
        rotYRef.current += 0.0035;
      }

      const width = canvas.width || 600;
      const height = canvas.height || 600;
      const cx = width / 2;
      const cy = height / 2;
      const currentScale = scaleRef.current;
      const R = Math.min(width, height) * 0.40 * currentScale;
      const dprFactor = width / 500;

      ctx.clearRect(0, 0, width, height);

      // 1. Starfield background
      ctx.fillStyle = '#06080d';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 40; i++) {
        const sx = (Math.sin(i * 99 + 1) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 33 + 1) * 0.5 + 0.5) * height;
        const sa = Math.sin(time * 0.8 + i) * 0.3 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${sa * 0.7})`;
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 3 === 0 ? 1.2 : 0.8), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Atmospheric Outer Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.35);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      glowGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.18)');
      glowGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.05)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 3. Globe Ocean Body (3D Spherical Shading)
      const oceanGrad = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
      oceanGrad.addColorStop(0, '#0f2942');
      oceanGrad.addColorStop(0.4, '#091c30');
      oceanGrad.addColorStop(0.85, '#040d1a');
      oceanGrad.addColorStop(1, '#02060c');

      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Coordinate 3D Spherical Projection Function
      const project3D = (lonDeg: number, latDeg: number) => {
        const lonRad = (lonDeg * Math.PI) / 180 + rotYRef.current;
        const latRad = (latDeg * Math.PI) / 180;

        // 3D vector on unit sphere
        const x3 = Math.cos(latRad) * Math.sin(lonRad);
        const y3 = -Math.sin(latRad);
        const z3 = Math.cos(latRad) * Math.cos(lonRad);

        // Apply pitch tilt (rotX)
        const rx = rotXRef.current;
        const y3t = y3 * Math.cos(rx) - z3 * Math.sin(rx);
        const z3t = y3 * Math.sin(rx) + z3 * Math.cos(rx);

        return {
          x: cx + x3 * R,
          y: cy + y3t * R,
          z: z3t,
          visible: z3t > 0
        };
      };

      // 4. Latitude / Longitude Graticule lines
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.lineWidth = 1;

      // Parallels (Latitude lines)
      [-60, -30, 0, 30, 60].forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project3D(lon, lat);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      });

      // Meridians (Longitude lines)
      [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180].forEach((lon) => {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 4) {
          const pt = project3D(lon, lat);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      });

      // 5. Continents / Landmass Outlines & Shading
      WORLD_CONTINENT_POLYLINES.forEach((poly) => {
        ctx.beginPath();
        let visibleCount = 0;

        poly.forEach(([lon, lat], idx) => {
          const pt = project3D(lon, lat);
          if (pt.visible) {
            visibleCount++;
            if (idx === 0 || !poly[idx - 1] || !project3D(poly[idx - 1][0], poly[idx - 1][1]).visible) {
              ctx.moveTo(pt.x, pt.y);
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        });

        if (visibleCount > 2) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.70)';
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      });

      // 6. Dynamic Atmospheric Cloud Swirls
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2.5;
      for (let c = 0; c < 4; c++) {
        const cloudLonOffset = (time * 15 + c * 80) % 360 - 180;
        const cloudLat = 15 * Math.sin(c * 2 + time * 0.3) + (c % 2 === 0 ? 20 : -15);
        
        ctx.beginPath();
        for (let seg = 0; seg <= 12; seg++) {
          const cl = cloudLonOffset + seg * 4;
          const cla = cloudLat + Math.sin(seg * 0.5 + time) * 3;
          const pt = project3D(cl, cla);
          if (pt.visible) {
            if (seg === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
      }

      // 7. Tamil Nadu Glowing Pin Beacon & Marker
      if (highlightTamilNadu) {
        const tnPt = project3D(78.5, 11.1); // Tamil Nadu center coordinate

        if (tnPt.visible) {
          // Radial pulse ripples
          const pulse1 = (time * 2.5) % 1;
          const pulse2 = (time * 2.5 + 0.5) % 1;

          [pulse1, pulse2].forEach((p) => {
            ctx.beginPath();
            ctx.arc(tnPt.x, tnPt.y, 4 + p * 22, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(52, 211, 153, ${1 - p})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });

          // Bright center dot
          ctx.beginPath();
          ctx.arc(tnPt.x, tnPt.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Outer glowing tag
          ctx.save();
          ctx.fillStyle = 'rgba(17, 19, 23, 0.85)';
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
          ctx.lineWidth = 1;
          const tagX = tnPt.x + 12;
          const tagY = tnPt.y - 20;
          ctx.beginPath();
          ctx.roundRect(tagX, tagY, 110, 24, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 10px Open Sans, sans-serif';
          ctx.fillText('TAMIL NADU, IN', tagX + 8, tagY + 12);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '9px Open Sans, sans-serif';
          ctx.fillText('11.1°N, 78.5°E', tagX + 8, tagY + 21);
          ctx.restore();
        }
      }

      // 8. 3D Spherical Edge Shadow & Rim Light
      const rimGrad = ctx.createRadialGradient(cx + R * 0.4, cy - R * 0.4, R * 0.6, cx, cy, R);
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      rimGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end globe clipping

      // 9. Satellites in Orbit around the Globe (NASA Eyes on the Earth Style)
      if (showSatellites) {
        SATELLITES.forEach((sat, sIdx) => {
          const satOrbRadius = R * sat.radiusMult;
          const theta = time * sat.speed * 4 + sat.phase;
          
          // Orbital plane tilt
          const sx3 = Math.cos(theta) * satOrbRadius;
          const sy3 = Math.sin(theta) * Math.cos(sat.inclination) * satOrbRadius;
          const sz3 = Math.sin(theta) * Math.sin(sat.inclination) * satOrbRadius;

          // Apply rotation tilt
          const rx = rotXRef.current;
          const sy3t = sy3 * Math.cos(rx) - sz3 * Math.sin(rx);
          const sz3t = sy3 * Math.sin(rx) + sz3 * Math.cos(rx);

          const satX = cx + sx3;
          const satY = cy + sy3t;
          const isFront = sz3t > -satOrbRadius * 0.3;

          // Orbit elliptical track path
          ctx.strokeStyle = `rgba(148, 163, 184, ${isFront ? 0.2 : 0.08})`;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.ellipse(cx, cy, satOrbRadius, satOrbRadius * Math.abs(Math.cos(sat.inclination)), sat.inclination * 0.3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Satellite Body & Label
          if (isFront) {
            ctx.beginPath();
            ctx.arc(satX, satY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = sat.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Satellite Name Label
            ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
            ctx.font = '8px Open Sans, sans-serif';
            ctx.fillText(sat.name, satX + 5, satY - 3);
          }
        });
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [highlightTamilNadu, showSatellites]);

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !interactive) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    rotYRef.current += dx * 0.008;
    rotXRef.current = Math.max(-0.8, Math.min(0.8, rotXRef.current + dy * 0.008));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive || e.touches.length === 0) return;
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !interactive || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - lastMousePosRef.current.x;
    const dy = e.touches[0].clientY - lastMousePosRef.current.y;

    rotYRef.current += dx * 0.008;
    rotXRef.current = Math.max(-0.8, Math.min(0.8, rotXRef.current + dy * 0.008));

    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const resetToTamilNadu = () => {
    rotXRef.current = 0.2;
    rotYRef.current = -1.35;
    scaleRef.current = 1;
  };

  return (
    <div
      className={`relative rounded-2xl bg-white border border-[#DDE5E1] overflow-hidden flex flex-col items-center justify-between p-4 shadow-sm ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        isDraggingRef.current = false;
      }}
    >
      {/* Top Overlay Badge */}
      <div className="w-full flex items-center justify-between border-b border-[#DDE5E1] pb-2.5 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
          <span className="text-xs font-bold text-[#17201C] uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5]">
            ERA5 Orbiter
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        className={`relative w-full flex-1 min-h-[400px] flex items-center justify-center select-none my-1 rounded-xl overflow-hidden ${
          isZoomingToTN ? 'cursor-wait' : 'cursor-pointer active:cursor-grabbing'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (onSelectTamilNadu) {
            triggerZoomIntoTamilNadu();
          }
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain rounded-xl"
        />

        {/* Zooming in flight HUD transition overlay */}
        {isZoomingToTN && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs pointer-events-none transition-all duration-300">
            <div className="w-16 h-16 rounded-full border-2 border-[#059669] border-t-transparent animate-spin mb-3"></div>
            <div className="px-4 py-1.5 rounded-full bg-white border border-[#059669] text-[#047857] text-xs font-bold tracking-wide shadow-xl flex items-center gap-2 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
              <span>Acquiring Tamil Nadu GIS Grid...</span>
            </div>
          </div>
        )}

        {/* Click / Touch callout overlay */}
        {onSelectTamilNadu && !isZoomingToTN && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerZoomIntoTamilNadu();
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-md shadow-[#059669]/20 flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 z-20"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Click Globe to Zoom into Tamil Nadu</span>
          </button>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="w-full flex items-center justify-between pt-2.5 border-t border-[#DDE5E1] text-xs text-[#64706A] z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border transition ${
              isRotating
                ? 'bg-[#ECFDF5] border-[#059669] text-[#047857]'
                : 'bg-white border-[#DDE5E1] text-[#64706A] hover:text-[#17201C]'
            }`}
            title="Toggle Earth Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={resetToTamilNadu}
            className="p-1.5 rounded-lg bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] hover:text-[#17201C] transition"
            title="Recenter on Tamil Nadu, India"
          >
            <Compass className="w-3.5 h-3.5 text-[#059669]" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#64706A]">
          <Satellite className="w-3.5 h-3.5 text-[#059669]" />
          <span>Suomi NPP · SWOT · Jason-3</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              scaleRef.current = Math.max(0.7, scaleRef.current - 0.1);
            }}
            className="p-1.5 rounded-lg bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] hover:text-[#17201C] transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              scaleRef.current = Math.min(1.4, scaleRef.current + 0.1);
            }}
            className="p-1.5 rounded-lg bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] hover:text-[#17201C] transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
