import React, { useState } from 'react'; // Import useState
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
// Assuming your styles.css is in src/ and Contact.jsx is in src/components/
import '../styles.css'; // Or your correct path to the CSS file

const Contact = () => {
  // State for the form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "", // Added subject as per your original form
    message: "",
  });

  // Handle input changes and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // WhatsApp submission logic
  const sendToWhatsApp = () => {
    const { name, email, subject, message } = formData;

    // Basic validation
    if (!name || !email || !message || !subject) { // Added subject to validation
      alert("Please fill all required fields (Name, Email, Subject, Message).");
      return;
    }

    const whatsappNumber = "9183997292"; // Your receiving WhatsApp number
    const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0ASubject: ${subject}%0AMessage: ${message}`;
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    window.open(whatsappURL, "_blank");
    // Optionally, you can alert the user or clear the form here
    alert('Your message is being prepared for WhatsApp.');
    // setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
  };


  // This handleSubmit will now trigger the WhatsApp logic
  // instead of the simple alert.
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    sendToWhatsApp();   // Call the WhatsApp function
  };

  return (
    // Your existing JSX structure with custom CSS classes
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you! Reach out for questions, support, or feedback.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">
              <FaPhone />
            </div>
            <h3>Phone</h3>
            <p>+91 98765 43210</p> {/* Update with your info */}
            <p>Mon-Fri: 9am-5pm</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <h3>Email</h3>
            <p>contact@yourdomain.com</p> {/* Update with your info */}
            <p>response within 24 hours</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Location</h3>
            <p>SITM, Garchuk</p> {/* Update with your info */}
            <p>Guwahati, Assam</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaClock />
            </div>
            <h3>Hours</h3>
            <p>Monday-Friday: 9am-5pm</p>
            <p>Saturday: 10am-2pm</p>
          </div>
        </div>

        {/* Your original form structure, now with state and onChange handlers */}
        <div className="contact-form"> {/* This div and its children will be styled by styles.css */}
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}> {/* handleSubmit now triggers WhatsApp logic */}
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}       // Controlled component
                onChange={handleChange}   // Handle changes
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}      // Controlled component
                onChange={handleChange}   // Handle changes
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}    // Controlled component
                onChange={handleChange}   // Handle changes
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows={5} // Ensure rows is a number if not a string
                placeholder="Type your message here..."
                value={formData.message}    // Controlled component
                onChange={handleChange}   // Handle changes
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send via WhatsApp {/* Button text can remain, or change to "Send via WhatsApp" */}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-map">
        <iframe
          title="Location Map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7166.495570028291!2d91.725019!3d26.090829!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5c45471a4913%3A0xfcbcab5629378517!2sScholar's%20Institute%20of%20Technology%20and%20Management!5e0!3m2!1sen!2sin!4v1734036513366!5m2!1sen!2sin"
          allowFullScreen // Corrected: no "" needed
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;