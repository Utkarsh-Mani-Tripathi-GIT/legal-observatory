'use client';
import { useMemo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import './OrbitImages.css';

function generateEllipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

interface OrbitItemProps {
  item: React.ReactNode;
  index: number;
  totalItems: number;
  path: string;
  itemSize: number;
  rotation: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  fill: boolean;
}

function OrbitItem({ item, index, totalItems, path, itemSize, rotation, progress, fill }: OrbitItemProps) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;
  const [offsetDistance, setOffsetDistance] = useState(`${itemOffset}%`);

  useEffect(() => {
    const unsub = progress.on('change', (p) => {
      const offset = (((p + itemOffset) % 100) + 100) % 100;
      setOffsetDistance(`${offset}%`);
    });
    return unsub;
  }, [progress, itemOffset]);

  return (
    <motion.div
      className="orbit-item"
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: '0deg',
        offsetAnchor: 'center center',
        offsetDistance,
      } as React.CSSProperties}
    >
      <div style={{ transform: `rotate(${-rotation}deg)` }}>{item}</div>
    </motion.div>
  );
}

interface OrbitImagesProps {
  images: string[];
  shape?: string;
  baseWidth?: number;
  radiusX?: number;
  radiusY?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  direction?: 'normal' | 'reverse';
  fill?: boolean;
  responsive?: boolean;
  centerContent?: React.ReactNode;
  className?: string;
}

export default function OrbitImages({
  images = [],
  shape = 'ellipse',
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = 'normal',
  fill = true,
  responsive = false,
  centerContent,
  className = '',
}: OrbitImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const cx = baseWidth / 2, cy = baseWidth / 2;

  const path = useMemo(() => generateEllipsePath(cx, cy, radiusX, radiusY), [cx, cy, radiusX, radiusY]);

  useLayoutEffect(() => {
    if (!responsive || !containerRef.current) return;
    const update = () => {
      if (containerRef.current) setScale(containerRef.current.clientWidth / baseWidth);
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [responsive, baseWidth]);

  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, direction === 'reverse' ? -100 : 100, {
      duration,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
    return () => controls.stop();
  }, [progress, duration, direction]);

  const items = images.map((src, i) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img key={src} src={src} alt={`cert ${i + 1}`} draggable={false} className="orbit-image" />
  ));

  return (
    <div
      ref={containerRef}
      className={`orbit-container ${className}`}
      style={{ width: responsive ? '100%' : baseWidth, height: responsive ? 'auto' : baseWidth, aspectRatio: responsive ? '1/1' : undefined }}
      aria-hidden="true"
    >
      <div
        className={responsive ? 'orbit-scaling-container orbit-scaling-container--responsive' : 'orbit-scaling-container'}
        style={{
          width: responsive ? baseWidth : '100%',
          height: responsive ? baseWidth : '100%',
          transform: responsive && scale !== null ? `translate(-50%, -50%) scale(${scale})` : undefined,
          visibility: responsive && scale === null ? 'hidden' : undefined,
        }}
      >
        <div className="orbit-rotation-wrapper" style={{ transform: `rotate(${rotation}deg)` }}>
          {items.map((item, i) => (
            <OrbitItem key={i} item={item} index={i} totalItems={items.length} path={path} itemSize={itemSize} rotation={rotation} progress={progress} fill={fill} />
          ))}
        </div>
      </div>
      {centerContent && <div className="orbit-center-content">{centerContent}</div>}
    </div>
  );
}
