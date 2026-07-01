import React from 'react';

function Header({ currentPage, setCurrentPage }) {
  const navLinks = [
    { id: 'home', name: 'Главная' },
    { id: 'services', name: 'Каталог' },
    { id: 'contact', name: 'Контакты' },
    { id: 'register', name: 'Регистрация' }
  ];

  return (
    <header className="main-header">
      <div className="container header-flex">
        <a href="#" className="logo" onClick={(e) => {
          e.preventDefault();
          setCurrentPage('home');
        }}>
          Reion<span>Oqwei</span>
        </a>
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navLinks.map(link => (
              <li key={link.id}>
                <button
                  className={`nav-link ${currentPage === link.id ? 'active' : ''}`}
                  onClick={() => setCurrentPage(link.id)}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <a href="tel:+79008005040" className="phone-link">+7 (900) 800-50-45</a>
        </div>
      </div>
    </header>
  );
}

export default Header;