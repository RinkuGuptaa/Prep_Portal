import React from 'react';
import { FaBook, FaGraduationCap, FaFileAlt, FaRobot, FaUserShield, FaChartBar } from 'react-icons/fa';

const Enterprise = () => {
  // Styles
  const styles = {
    page: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#2c3e50',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    hero: {
      background: 'linear-gradient(135deg, #3498db, #2c3e50)',
      color: 'black',
      padding: '5rem 2rem',
      textAlign: 'center',
      borderRadius: '10px',
      margin: '2rem 0'
    },
    heroTitle: {
      fontSize: '2.5rem',
      marginBottom: '1rem'
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center'
    },
    primaryButton: {
      padding: '0.8rem 1.5rem',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'white',
      color: '#3498db',
      border: 'none'
    },
    secondaryButton: {
      padding: '0.8rem 1.5rem',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'transparent',
      color: 'white',
      border: '2px solid white'
    },
    section: {
      margin: '4rem 0',
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: '2rem',
      marginBottom: '1rem'
    },
    sectionDescription: {
      color: '#7f8c8d',
      marginBottom: '2rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    },
    card: {
      background: 'silver',
      borderRadius: '10px',
      padding: '2rem',
      boxShadow: '0 5px 15px rgba(83, 83, 83, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    icon: {
      color: '#3498db',
      marginBottom: '1rem'
    },
    testimonialContainer: {
      display: 'flex',
      gap: '2rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    testimonialCard: {
      background: 'white',
      borderRadius: '10px',
      padding: '2rem',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
      maxWidth: '400px',
      textAlign: 'left'
    },
    quote: {
      fontStyle: 'italic',
      marginBottom: '1rem'
    },
    author: {
      fontWeight: 'bold',
      color: '#3498db'
    },
    techGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem'
    },
    techItem: {
      background: 'silver',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
    },
    ctaSection: {
      background: 'green',
      borderRadius: '10px',
      padding: '3rem 2rem',
      textAlign: 'center',
      margin: '4rem 0'
    },
    ctaContent: {
      display: 'flex',
      gap: '2rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    ctaItem: {
      background: 'black',
      borderRadius: '8px',
      padding: '1.5rem 2rem',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
      minWidth: '250px'
    }
  };

  // Hover styles
  const hoverStyles = {
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(77, 86, 172, 0.62)'
    },
    primaryButtonHover: {
      background: '#f8f9fa',
      transform: 'translateY(-2px)'
    },
    secondaryButtonHover: {
      background: 'rgba(255,255,255,0.1)',
      transform: 'translateY(-2px)'
    }
  };

  const features = [
    {
      icon: <FaBook size={40} style={styles.icon} />,
      title: "Centralized Academic Resources",
      desc: "Access previous year question papers, syllabus, and notes all in one place"
    },
    {
      icon: <FaGraduationCap size={40} style={styles.icon} />,
      title: "Academic Performance",
      desc: "Track results and improve performance with organized resources"
    },
    {
      icon: <FaFileAlt size={40} style={styles.icon} />,
      title: "Resume Analyzer",
      desc: "Get professional feedback on your resume for better career opportunities"
    },
    {
      icon: <FaRobot size={40} style={styles.icon} />,
      title: "AI-Powered Chatbot",
      desc: "24/7 instant support for academic doubts and questions"
    },
    {
      icon: <FaUserShield size={40} style={styles.icon} />,
      title: "Secure Authentication",
      desc: "Protected user accounts with confidential data management"
    },
    {
      icon: <FaChartBar size={40} style={styles.icon} />,
      title: "Admin Dashboard",
      desc: "Comprehensive management tools for administrators"
    }
  ];


  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>Prep-Portal: Academic Excellence Platform</h1>
          <p style={styles.heroSubtitle}>A comprehensive solution for Engineering and BCA students</p>
          <div style={styles.buttonContainer}>
            <button 
              style={styles.primaryButton}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyles.primaryButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.primaryButton)}
            >
              View Demo
            </button>
            <button 
              style={styles.secondaryButton}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyles.secondaryButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.secondaryButton)}
            >
              Institution Inquiry
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Key Features of Prep-Portal</h2>
        <p style={styles.sectionDescription}>Designed specifically for student success</p>
        
        <div style={styles.grid}>
          {features.map((feature, index) => (
            <div 
              key={index}
              style={styles.card}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyles.cardHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.card)}
            >
              <div>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      

      {/* Technology Stack */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Technology Stack</h2>
        <div style={styles.techGrid}>
          <div style={styles.techItem}>
            <h3>Frontend</h3>
            <p>React.js</p>
          </div>
          <div style={styles.techItem}>
            <h3>Backend</h3>
            <p>Node.js, Express.js</p>
          </div>
          <div style={styles.techItem}>
            <h3>Database</h3>
            <p>MongoDB</p>
          </div>
          <div style={styles.techItem}>
            <h3>AI Services</h3>
            <p>Gemini API, Python Flask</p>
          </div>
          <div style={styles.techItem}>
            <h3>NLP</h3>
            <p>spaCy, SpellChecker</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.sectionTitle}>Ready to Enhance Student Success?</h2>
        <p style={styles.sectionDescription}>Our team is ready to discuss how Prep-Portal can benefit your institution</p>
        <div style={styles.ctaContent}>
          <div style={styles.ctaItem}>
            <h3>Contact Us</h3>
            <p>admin@prep-portal.edu</p>
            <p>+91 98765 43210</p>
          </div>
          <div style={styles.ctaItem}>
            <h3>Request Information</h3>
            <p>Learn more about our platform</p>
            <button 
              style={styles.primaryButton}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyles.primaryButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.primaryButton)}
            >
              Get Details
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Enterprise;