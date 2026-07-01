import React from 'react';
import ContactInfo from '../components/ContactInfo';
import ContactMap from '../components/ContactMap';

function ContactPage() {
  return (
    <div className="page-content">
      <section className="contact-hero container">
        <h1 className="page-title">Свяжитесь с нами</h1>
        <div className="contact-grid">
          <ContactInfo />
          <ContactMap />
        </div>
      </section>
    </div>
  );
}

export default ContactPage;