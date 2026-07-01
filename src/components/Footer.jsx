import React from 'react';


function Footer() {
  return (
 <div className="wrapper">
      <main className="content"></main>

    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">Reion<span>Oqwei</span></div>
          <p>Премиальное качество для тех, кто любит себя</p>
        </div>
        <div className="footer-nav">
          <h4>Навигация</h4>
          <ul>
            <li><a href="#">Главная</a></li>
            <li><a href="#">Услуги и цены</a></li>
            <li><a href="#">Наши контакты</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Мы в соцсетях</h4>
          <ul>
            <li><a href="#">Telegram</a></li>
            <li><a href="#">WhatsApp</a></li>
            <li><a href="#">VK</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; 2025 Reion Oqwei. Все права защищены</p>
      </div>
    </footer>
    </div>
  );
}

export default Footer;