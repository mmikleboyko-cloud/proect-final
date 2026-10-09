function Footer() {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">Reion<span>Oqwei</span></div>
          <p>Премиальное качество для тех, кто любит себя</p>
        </div>

        <div className="footer-nav">
          <h4>Информация</h4>
          <ul>
            <li>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'rules' }))}
                className="footer-link-btn"
              >
                Правила пользования
              </button>
            </li>
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
        <p>&copy; 2026 Reion Oqwei. Все права защищены</p>
      </div>
    </footer>
  );
}

export default Footer;