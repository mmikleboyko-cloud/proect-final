import React from 'react';

function ContactMap() {
  return (
    <div className="contact-map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2836.837330559091!2d40.20364931548687!3d43.68263197912015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDQwJzU3LjUiTiA0MMKwMTInMTMuMSJF!5e0!3m2!1sru!2sru!4v1620000000000!5m2!1sru!2sru"
        width="100%"
        height="400"
        style={{ border: 0, borderRadius: '15px' }}
        allowFullScreen=""
        loading="lazy"
        title="Карта расположения"
      ></iframe>
    </div>
  );
}

export default ContactMap;