import React, { useState } from 'react';

function Header({ currentPage, setCurrentPage, cartCount, favCount, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const baseLinks = [
    { id: 'home', name: 'Главная' },
    { id: 'services', name: 'Каталог' },
    { id: 'favorites', name: 'Избранное' },
    { id: 'cart', name: 'Корзина' },
    { id: 'contact', name: 'Контакты' }
  ];

  const navLinks = user
    ? baseLinks
    : [...baseLinks, { id: 'register', name: 'Регистрация' }];

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="container header-flex">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}>
          Reion<span>Oqwei</span>
        </a>

        <button
          className={`burger-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
          aria-expanded={menuOpen}
        >
          <span></span><span></span><span></span>
        </button>

        <nav className={`desktop-nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {navLinks.map(link => (
              <li key={link.id}>
                <button
                  className={`nav-link ${currentPage === link.id ? 'active' : ''}`}
                  onClick={() => handleNavigate(link.id)}
                >
                  {link.id === 'favorites' ? (
                    <>Избранное {favCount > 0 && <span className="cart-badge">{favCount}</span>}</>
                  ) : link.id === 'cart' ? (
                    <>Корзина {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</>
                  ) : link.name}
                </button>
              </li>
            ))}

            {!user ? (
              <li>
                <button
                  className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
                  onClick={() => handleNavigate('login')}
                >
                  Вход
                </button>
              </li>
            ) : (
              <li>
                <button
                  className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
                  onClick={() => handleNavigate('profile')}
                  style={{ color: 'var(--accent)' }}
                >
                  Профиль
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  );
}

export default Header;