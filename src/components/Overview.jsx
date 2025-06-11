import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Overview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px 0px'
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const slides = [
    { id: 1, image: "/assets/Screenshot (167).png" },
    { id: 2, image: "/assets/Screenshot (168).png" },
    { id: 3, image: "/assets/Screenshot (169).png" },
    { id: 4, image: "/assets/Screenshot (170).png" },
    { id: 5, image: "/assets/Screenshot (171).png" },
    { id: 6, image: "/assets/Screenshot (172).png" }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!inView) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [inView, slides.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0.5
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0.5,
      transition: { duration: 0.5 }
    })
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <motion.section
      id="overview"
      className="Overview"
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Overview
      </motion.h1>

      <div className="carousel-wrapper">
        <button 
          className="carousel-control prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <span className="carousel-control-icon">&#10094;</span>
        </button>

        <div className="carousel-container">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="carousel-slide"
            >
              <img 
                src={slides[currentIndex].image} 
                alt={`Overview Slide ${currentIndex + 1}`}
                className="carousel-image"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
          className="carousel-control next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <span className="carousel-control-icon">&#10095;</span>
        </button>
      </div>

      <div className="carousel-indicators">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default Overview;