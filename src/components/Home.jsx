import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Typed from 'typed.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Home.css';

const Home = () => {
  const [containerRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const navigate = useNavigate(); 
  const typedElementRef = useRef(null);
  const typedInstanceRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // State for preventing overload
  const [isNavigating, setIsNavigating] = useState(false);
  const [scrollDisabled, setScrollDisabled] = useState(false);

  // Book images array - wrapped in useMemo to prevent re-creation on every render
  const bookImages = useMemo(() => [
    "https://www.scijournal.org/articles/wp-content/uploads/2022/04/SCI062-Best-Books-for-Engineering-Students.jpg",
    "https://imgix.bustle.com/fatherly/2015/07/980x-41.jpg?w=414&h=345&fit=crop&crop=faces&dpr=2",
    "https://revolutionized.com/wp-content/uploads/sites/5/2022/04/10-books-for-engineers.jpg",
    "https://geniuslabgear.com/cdn/shop/products/engineering-is-for-everyone-sticker_2000x.jpg?v=1713710215",
    "https://i.thriftbooks.com/api/imagehandler/s/33B8137FE6CDF25D1B5BFD19D18E7C7A46296CF9.jpeg",
    "https://i.pinimg.com/originals/8b/e0/a5/8be0a5ba63674e4fe49fd5ce7098c90e.jpg",
    "https://celebratepicturebooks.com/wp-content/uploads/2022/08/celebrate-picture-books-picture-book-review-how-was-that-built-cover.jpeg",
    "https://images-na.ssl-images-amazon.com/images/I/61PmbHPRoiL.jpg",
    "https://images-na.ssl-images-amazon.com/images/I/712635tVIxL.jpg",
    "https://media.gettyimages.com/id/182675742/photo/books.jpg?s=612x612&w=0&k=20&c=9iXRdMs3sN25iHye5kAFBqD4Tr1IVR4IY8gXG8bkTMU=",
    "https://media.gettyimages.com/id/166025443/photo/opened-book-on-top-of-stack-of-blue-books-knowledge.jpg?s=612x612&w=0&k=20&c=LJ959ErCaD5WDlJ6_BhmtD_yKOez_gOeZKuar2l4axU=",
    "https://images-na.ssl-images-amazon.com/images/I/81OkWjcf4WL.jpg",
    "https://media.gettyimages.com/id/1458805217/photo/a-book-left-open-in-the-classroom.jpg?s=612x612&w=0&k=20&c=e2Mp21cpaJGx-k2TBosAwMf22rg5uSZuGGp-4sRRA5M=",
    "https://media.gcflearnfree.org/content/55e0730c7dd48174331f5164_01_17_2014/whatisacomputer_laptop_computers.jpg",
    "https://burst.shopifycdn.com/photos/laptop-from-above.jpg?width=1000&format=pjpg&exif=0&iptc=0"
  ], []);

  // Debounced explore click function to prevent overload
  const handleExploreClick = useCallback(() => {
    // Prevent multiple rapid clicks
    if (isNavigating || scrollDisabled) {
      return;
    }

    setIsNavigating(true);
    setScrollDisabled(true);

    // Temporarily disable scroll to prevent overload
    document.body.style.overflow = 'hidden';

    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please log in to access resources', {
        position: "top-center",
        autoClose: 3000,
      });
      // Show the auth modal (assuming you're using Bootstrap)
      const modal = document.getElementById('authModal');
      if (modal) {
        window.$('#authModal').modal('show');
      }
      
      // Re-enable after a short delay
      setTimeout(() => {
        setIsNavigating(false);
        setScrollDisabled(false);
        document.body.style.overflow = 'auto';
      }, 1000);
    } else {
      // Add a small delay to show loading state
      setTimeout(() => {
        navigate('/btech');
        // Navigation will handle re-enabling
      }, 300);
    }
  }, [isNavigating, scrollDisabled, navigate]);

  useEffect(() => {
    if (inView && typedElementRef.current) {
      // Initialize Typed.js
      typedInstanceRef.current = new Typed(typedElementRef.current, {
        strings: [
          'ccess previous years question papers',
          'nd academic resources easily, helping you prepare better',
          'nd improve your learning experience.'
        ],
        typeSpeed: 70,
        loop: true,
        showCursor: false
      });

      // Book and particle animation
      const container = document.querySelector('.home-container');
      const border = 100;

      const createBookElement = (imageSrc) => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book';
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = "Book Image";
        bookElement.appendChild(img);
        return bookElement;
      };

      const animateBook = (bookElement) => {
        const edge = Math.floor(Math.random() * 4);
        let startX, startY;

        switch (edge) {
          case 0: startX = -border; startY = Math.random() * container.clientHeight; break;
          case 1: startX = Math.random() * container.clientWidth; startY = -border; break;
          case 2: startX = container.clientWidth + border; startY = Math.random() * container.clientHeight; break;
          case 3: startX = Math.random() * container.clientWidth; startY = container.clientHeight + border; break;
          default: startX = -border; startY = Math.random() * container.clientHeight; break;
        }

        bookElement.style.left = `${startX}px`;
        bookElement.style.top = `${startY}px`;
        bookElement.style.transform = 'scale(1) rotate(0deg)';

        container.appendChild(bookElement);

        const duration = Math.random() * 3 + 1;
        bookElement.style.transition = `transform ${duration}s linear, opacity ${duration}s linear`;
        bookElement.style.transform = `translate(${container.clientWidth / 2 - startX}px, ${container.clientHeight / 2 - startY}px) scale(0.5) rotate(${Math.random() * 360}deg)`;
        bookElement.style.opacity = 0;

        setTimeout(() => {
          if (bookElement.parentNode === container) {
            bookElement.remove();
          }
        }, duration * 1000);
      };

      const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const edge = Math.floor(Math.random() * 4);
        let startX, startY;

        switch (edge) {
          case 0: startX = -border; startY = Math.random() * container.clientHeight; break;
          case 1: startX = Math.random() * container.clientWidth; startY = -border; break;
          case 2: startX = container.clientWidth + border; startY = Math.random() * container.clientHeight; break;
          case 3: startX = Math.random() * container.clientWidth; startY = container.clientHeight + border; break;
          default: startX = -border; startY = Math.random() * container.clientHeight; break;
        }

        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        container.appendChild(particle);

        const duration = Math.random() * 3 + 2;
        particle.style.transition = `transform ${duration}s linear, opacity ${duration}s linear`;
        particle.style.transform = `translate(${container.clientWidth / 2 - startX}px, ${container.clientHeight / 2 - startY}px)`;
        particle.style.opacity = 0;

        setTimeout(() => {
          if (particle.parentNode === container) {
            particle.remove();
          }
        }, duration * 1000);
      };

      const continuouslyAddBooksAndParticles = () => {
        bookImages.forEach((imageSrc, index) => {
          setTimeout(() => {
            const bookElement = createBookElement(imageSrc);
            animateBook(bookElement);
          }, index * 500);
        });

        for (let i = 0; i < 50; i++) {
          setTimeout(createParticle, i * 100);
        }

        animationFrameRef.current = setTimeout(continuouslyAddBooksAndParticles, bookImages.length * 500);
      };

      continuouslyAddBooksAndParticles();
    }

    return () => {
      // Cleanup
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current);
      }
      // Ensure scroll is always re-enabled on cleanup
      document.body.style.overflow = 'auto';
    };
  }, [inView, bookImages]);

  return (
    <div id="home" className="home-container" ref={containerRef}>
      <div className="home-content">
        <motion.div
          className="hero-text"
          initial={{ y: -50, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h1 className="main-title">Welcome to <span>Prep Portal</span></h1>
          <h2 className="subtitle">Your Gateway to Academic Success</h2>
          
          <motion.p
            className="typed-text"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            A<span ref={typedElementRef}></span>
          </motion.p>
          
          <motion.div
            className="cta-container"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button 
              className={`cta-button ${isNavigating || scrollDisabled ? 'disabled' : ''}`}
              onClick={handleExploreClick}
              disabled={isNavigating || scrollDisabled}
            >
              {isNavigating || scrollDisabled ? (
                <>
                  <span className="loading-spinner"></span>
                  {isNavigating ? 'Loading...' : 'Please wait...'}
                </>
              ) : (
                <>
                  Explore Resources
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;