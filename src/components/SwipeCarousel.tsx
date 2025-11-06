"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, PanInfo } from "framer-motion";

interface SwipeCarouselProps {
  images: string[];
}

interface IconProps {
  className?: string;
}

const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const SwipeCarousel: React.FC<SwipeCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(images.length / 2));
  const [isPaused, setIsPaused] = useState(false);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayDelay = 3000;

  // Translate percentage for slide spacing, tuned per breakpoint
  const [translationPercent, setTranslationPercent] = useState<number>(50);

  useEffect(() => {
    const computeTranslation = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setTranslationPercent(90); // tighter spacing movement with larger card width
      } else if (w < 768) {
        setTranslationPercent(65);
      } else {
        setTranslationPercent(50);
      }
    };

    computeTranslation();
    window.addEventListener("resize", computeTranslation);
    return () => window.removeEventListener("resize", computeTranslation);
  }, []);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    if (!isPaused) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [isPaused, activeIndex]);

  const changeSlide = (newIndex: number) => {
    const newSafeIndex = (newIndex + images.length) % images.length;
    setActiveIndex(newSafeIndex);
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    if (!isPaused) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
  };

  const onDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const dragThreshold = 75;
    const dragOffset = info.offset.x;
    if (dragOffset > dragThreshold) {
      changeSlide(activeIndex - 1);
    } else if (dragOffset < -dragThreshold) {
      changeSlide(activeIndex + 1);
    }
  };

  return (
    <section className="w-full flex-col items-center justify-center font-sans overflow-hidden">
      <div
        className="w-full h-full p-2 sm:p-3 md:p-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative flex w-full flex-col p-0">
          <div className="relative w-full h-[80vw] min-h-[260px] max-h-[520px] md:h-[420px] flex items-center justify-center overflow-hidden pt-6 md:pt-12">
            <motion.div
              className="w-full h-full flex items-center justify-center"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
            >
              {images.map((imageUrl, index) => (
                <Card
                  key={index}
                  imageUrl={imageUrl}
                  index={index}
                  activeIndex={activeIndex}
                  totalCards={images.length}
                  translationPercent={translationPercent}
                />
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 md:mt-6">
            <button
              onClick={() => changeSlide(activeIndex - 1)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <ChevronLeftIcon className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                    activeIndex === index
                      ? "w-3 sm:w-4 bg-cyan-400"
                      : "w-1 sm:w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => changeSlide(activeIndex + 1)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <ChevronRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Card: React.FC<{
  imageUrl: string;
  index: number;
  activeIndex: number;
  totalCards: number;
  translationPercent: number;
}> = ({ imageUrl, index, activeIndex, totalCards, translationPercent }) => {
  let offset = index - activeIndex;
  if (offset > totalCards / 2) {
    offset -= totalCards;
  } else if (offset < -totalCards / 2) {
    offset += totalCards;
  }

  const isVisible = Math.abs(offset) <= 1;

  const animate = {
    x: `${offset * translationPercent}%`,
    scale: offset === 0 ? 1 : 0.9,
    zIndex: totalCards - Math.abs(offset),
    opacity: isVisible ? 1 : 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 30 },
  };

  return (
    <motion.div
      className="absolute w-[94%] sm:w-3/4 md:w-1/3 h-[96%] md:h-[95%]"
      style={{ transformStyle: "preserve-3d" }}
      animate={animate}
      initial={false}
    >
      <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-gray-200/10">
        <img
          src={imageUrl}
          alt="carousel"
          className="w-full h-full object-contain pointer-events-none bg-black"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              "https://placehold.co/400x600/1e1e1e/ffffff?text=Image+Missing";
          }}
        />
      </div>
    </motion.div>
  );
};

export default SwipeCarousel;


