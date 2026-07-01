import React from 'react';

function ContactInfo() {
  return (
    <div className="contact-info-list">
      <div className="info-item">
        <h3>Адрес</h3>
        <p>г. Ростов,<br />ул. Ворошиловский, д. 32</p>
      </div>
      <div className="info-item">
        <h3>Телефон</h3>
        <p><a href="tel:+79001234567">+7 (956) 153-67-67</a></p>
        <p><a href="tel:88005553535">8 (760) 875-37-90</a></p>
      </div>
      <div className="info-item">
        <h3>Электронная почта</h3>
        <p><a href="mailto:razio@Reion-Oqwei.ru">razio@Reion-Oqwei.ru</a></p>
      </div>
    </div>
  );
}

export default ContactInfo;