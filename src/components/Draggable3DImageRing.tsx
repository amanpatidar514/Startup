'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, easeOut, animate } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Draggable3DImageRingProps {
  images?: string[];
  width?: number;
  perspective?: number;
  imageDistance?: number;
  initialRotation?: number;
  animationDuration?: number;
  staggerDelay?: number;
  hoverOpacity?: number;
  containerClassName?: string;
  ringClassName?: string;
  imageClassName?: string;
  backgroundColor?: string;
  draggable?: boolean;
  ease?: string;
  mobileBreakpoint?: number;
  mobileScaleFactor?: number;
  inertiaPower?: number;
  inertiaTimeConstant?: number;
  inertiaVelocityMultiplier?: number;
}

const DEFAULT_IMAGES = [
  '/images/portfolio/carousal/1.jpg',
  '/images/portfolio/carousal/2.jpg',
  '/images/portfolio/carousal/3.jpg',
  '/images/portfolio/carousal/4.jpg',
  '/images/portfolio/carousal/5.jpg',
  '/images/portfolio/carousal/6.jpg',
  '/images/portfolio/carousal/7.jpg',
  '/images/portfolio/carousal/8.jpg',
  '/images/portfolio/carousal/9.jpg',
  '/images/portfolio/carousal/10.png',
  '/images/portfolio/carousal/11.png',
  '/images/portfolio/carousal/12.png',
  '/images/portfolio/carousal/13.png',
  '/images/portfolio/carousal/14.png',
];

const Draggable3DImageRing = ({
  images = DEFAULT_IMAGES,
  width = 300,
  perspective = 2000,
  imageDistance = 500,
  initialRotation = 180,
  animationDuration = 1.5,
  staggerDelay = 0.1,
  hoverOpacity = 0.5,
  containerClassName,
  ringClassName,
  imageClassName,
  backgroundColor,
  draggable = true,
  ease = 'easeOut',
  mobileBreakpoint = 768,
  mobileScaleFactor = 0.8,
  inertiaPower = 0.8,
  inertiaTimeConstant = 300,
  inertiaVelocityMultiplier = 20,
}: Draggable3DImageRingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const rotationY = useMotionValue(initialRotation);
  const startX = useRef<number>(0);
  const currentRotationY = useRef<number>(initialRotation);
  const isDragging = useRef<boolean>(false);
  const velocity = useRef<number>(0);

  const [currentScale, setCurrentScale] = useState(1);
  const [showImages, setShowImages] = useState(false);

  const angle = useMemo(() => 360 / images.length, [images.length]);

  const getBgPosX = (imageIndex: number, currentRot: number, scale: number) => {
    const scaledImageDistance = imageDistance * scale;
    const effectiveRotation = currentRot - 180 - imageIndex * angle;
    const parallaxOffset = ((effectiveRotation % 360 + 360) % 360) / 360;
    return `${-(parallaxOffset * (scaledImageDistance / 1.5))}px`;
  };

  useEffect(() => {
    const unsubscribe = rotationY.on('change', (latestRotation) => {
      if (ringRef.current) {
        Array.from(ringRef.current.children).forEach((imgElement, i) => {
          const el = imgElement as HTMLElement;
          el.style.backgroundPositionX = getBgPosX(i, latestRotation, currentScale);
          el.style.backgroundPositionY = 'center';
        });
      }
      currentRotationY.current = latestRotation;
    });
    return () => unsubscribe();
  }, [rotationY, images.length, imageDistance, currentScale, angle]);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const newScale = viewportWidth <= mobileBreakpoint ? mobileScaleFactor : 1;
      setCurrentScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint, mobileScaleFactor]);

  useEffect(() => {
    setShowImages(true);
  }, []);

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    isDragging.current = true;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    startX.current = clientX;
    rotationY.stop();
    velocity.current = 0;
    if (ringRef.current) {
      (ringRef.current as HTMLElement).style.cursor = 'grabbing';
    }
    document.addEventListener('mousemove', handleDrag as any);
    document.addEventListener('mouseup', handleDragEnd as any);
    document.addEventListener('touchmove', handleDrag as any);
    document.addEventListener('touchend', handleDragEnd as any);
  };

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!draggable || !isDragging.current) return;

    const clientX = 'touches' in event ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
    const deltaX = clientX - startX.current;

    velocity.current = -deltaX * 0.5;

    rotationY.set(currentRotationY.current + velocity.current);

    startX.current = clientX;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    if (ringRef.current) {
      ringRef.current.style.cursor = 'grab';
      currentRotationY.current = rotationY.get();
    }

    document.removeEventListener('mousemove', handleDrag as any);
    document.removeEventListener('mouseup', handleDragEnd as any);
    document.removeEventListener('touchmove', handleDrag as any);
    document.removeEventListener('touchend', handleDragEnd as any);

    const initial = rotationY.get();
    const velocityBoost = velocity.current * inertiaVelocityMultiplier;
    const target = initial + velocityBoost;

    animate(initial, target, {
      type: 'inertia',
      velocity: velocityBoost,
      power: inertiaPower,
      timeConstant: inertiaTimeConstant,
      restDelta: 0.5,
      modifyTarget: (t) => Math.round(t / angle) * angle,
      onUpdate: (latest) => {
        rotationY.set(latest);
      },
    });

    velocity.current = 0;
  };

  const imageVariants = {
    hidden: { y: 250, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div
      ref={containerRef}
      className={cn('w-full h-full overflow-hidden select-none relative', containerClassName)}
      style={{
        backgroundColor,
        transform: `scale(${currentScale})`,
        transformOrigin: 'center center',
      }}
      onMouseDown={draggable ? handleDragStart : undefined}
      onTouchStart={draggable ? handleDragStart : undefined}
    >
      <div
        style={{
          perspective: `${perspective}px`,
          width: `${width}px`,
          height: `${width * 1.33}px`,
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <motion.div
          ref={ringRef}
          className={cn('w-full h-full absolute', ringClassName)}
          style={{
            transformStyle: 'preserve-3d',
            rotateY: rotationY,
            cursor: draggable ? 'grab' : 'default',
          }}
        >
          <AnimatePresence>
            {showImages &&
              images.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  className={cn('w-full h-full absolute', imageClassName)}
                  style={{
                    transformStyle: 'preserve-3d',
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backfaceVisibility: 'hidden',
                    rotateY: index * -angle,
                    transformOrigin: `50% 50% ${imageDistance * currentScale}px`,
                    backgroundPosition: 'center',
                    z: -imageDistance * currentScale,
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={imageVariants}
                  custom={index}
                  transition={{
                    delay: index * staggerDelay,
                    duration: animationDuration,
                    ease: easeOut,
                  }}
                  whileHover={{ opacity: 1, transition: { duration: 0.15 } }}
                  onHoverStart={() => {
                    if (isDragging.current) return;
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach((imgEl, i) => {
                        if (i !== index) {
                          (imgEl as HTMLElement).style.opacity = `${hoverOpacity}`;
                        }
                      });
                    }
                  }}
                  onHoverEnd={() => {
                    if (isDragging.current) return;
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach((imgEl) => {
                        (imgEl as HTMLElement).style.opacity = '1';
                      });
                    }
                  }}
                />
              ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Draggable3DImageRing;


