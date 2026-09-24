import React from 'react';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo" style={{ color: 'var(--white)' }}>Reion<span>Oqwei</span></div>
          <p>Премиальное качество для тех, кто любит себя</p>
        </div>
        <div className="footer-nav">
          <h4>Навигация</h4>
          <ul>
            <li><button onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'home' }))} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '14px' }}>Главная</button></li>
            <li><button onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'services' }))} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '14px' }}>Каталог</button></li>
            <li><button onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'contact' }))} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '14px' }}>Контакты</button></li>
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
  );
}

export default Footer;