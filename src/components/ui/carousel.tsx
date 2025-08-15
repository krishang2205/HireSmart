import React, { useState, useEffect } from 'react';

interface CarouselProps {
  slides: React.ReactNode[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoSlide = true,
  autoSlideInterval = 4000,
}) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const length = slides.length;

  useEffect(() => {
    if (!autoSlide) return;
    const timer = setInterval(() => {
      setDirection('right');
      setCurrent((prev) => (prev + 1) % length);
    }, autoSlideInterval);
    return () => clearInterval(timer);
  }, [autoSlide, autoSlideInterval, length]);

  const goToSlide = (idx: number) => {
    setDirection(idx > current ? 'right' : 'left');
    setCurrent(idx);
  };

  const prevSlide = () => {
    setDirection('left');
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection('right');
    setCurrent((prev) => (prev + 1) % length);
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
      <div
        className={`flex h-full transition-transform duration-500 ease-in-out`}
        style={{
          transform: `translateX(-${current * 100}%)`,
          transitionTimingFunction: direction === 'right' ? 'ease-in-out' : 'ease-in-out',
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="w-full h-full flex-shrink-0 flex items-center justify-center bg-white/80 rounded-xl mx-2 shadow"
            style={{ width: `${100 / slides.length}%` }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <span className="text-2xl">&#8592;</span>
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <span className="text-2xl">&#8594;</span>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${
              current === idx ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;// Migrated from landing page/src/components/ui/carousel.tsx