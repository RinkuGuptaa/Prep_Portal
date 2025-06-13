import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Team = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px'
  });

  const teamMembers = [
    {
      id: 1,
      name: "Rinku Kumar Gupta",
      image: "/assets/RINKU PIC.jpg",
      github: "http://www.linkedin.com/in/rinku-gupta-384b07283",
      delay: 0.1
    },
    {
      id: 2,
      name: "Tania Samanddar",
      image: "/assets/Tania.jpg",
      github: "http://www.linkedin.com/in/tania-samaddar-280a08284",
      delay: 0.2
    },
    {
      id: 3,
      name: "Syed Mufazzul karim",
      image: "/assets/Mafusal.jpg",
      delay: 0.3
    },
    {
      id: 4,
      name: "Disharika Chakma",
      image: "/assets/Disha.jpg",
      delay: 0.4
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 30,
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const hoverEffect = {
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
    transition: {
      type: "spring",
      stiffness: 300
    }
  };

  const imageHover = {
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  };

  return (
    <motion.section 
      id="team"
      className="team-section"
      style={{ paddingTop: '80px' }}
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.h2 
        className="text-center team-heading"
        variants={itemVariants}
      >
        Team Members
      </motion.h2>

      <motion.div 
        className="team-container"
        variants={containerVariants}
      >
        {teamMembers.map((member) => (
          <motion.div
            key={member.id}
            className="team-member"
            variants={itemVariants}
            whileHover={hoverEffect}
            custom={member.delay}
          >
            <motion.div
              className="image-container"
              whileHover={imageHover}
            >
              <img 
                src={member.image} 
                alt={`Team Member ${member.name}`}
                loading="lazy"
              />
            </motion.div>
            
            {member.github ? (
              <a 
                href={member.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="member-link"
              >
                <motion.h5
                  whileHover={{ color: '#4a90e2' }}
                  transition={{ duration: 0.3 }}
                >
                  {member.name}
                </motion.h5>
              </a>
            ) : (
              <h5>{member.name}</h5>
            )}
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: member.delay + 0.3 }}
            >
              {member.role}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Team;