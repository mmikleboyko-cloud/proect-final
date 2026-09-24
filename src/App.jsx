import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  const API_URL = 'http://m26452hl.beget.tech';

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`${API_URL}/get_cart.php`, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCartCount(data.reduce((s, i) => s + i.quantity, 0));
      }
    } catch (e) { console.error(e); }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/check_auth.php`, { credentials: 'include' });
      const data = await res.json();
      if (data.authenticated) setUser(data.user);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_URL}/favorites_ids.php`, { credentials: 'include' });
      const ids = await res.json();
      if (Array.isArray(ids)) setFavorites(new Set(ids));
    } catch (e) { console.error(e); }
  };

  const toggleFavorite = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/favorites_toggle.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ product_id: productId })
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Ошибка');

      setFavorites(prev => {
        const next = new Set(prev);
        if (result.favorited) next.add(productId);
        else next.delete(productId);
        return next;
      });
    } catch (e) {
      alert('❌ ' + e.message);
    }
  };

  useEffect(() => {
    fetchCartCount();
    checkAuth();
    fetchFavorites();

    const handleCartUpdate = () => fetchCartCount();
    const handleNavigate = (e) => setCurrentPage(e.detail);
    const handleFavUpdate = () => fetchFavorites();

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('navigateTo', handleNavigate);
    window.addEventListener('favoritesUpdated', handleFavUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('navigateTo', handleNavigate);
      window.removeEventListener('favoritesUpdated', handleFavUpdate);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('home');
    fetchCartCount();
    fetchFavorites();
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('profile');
    fetchCartCount();
    fetchFavorites();
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout.php`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setUser(null);
        setCartCount(0);
        setFavorites(new Set());
        alert('👋 Вы вышли из аккаунта');
        setCurrentPage('home');
      }
    } catch (e) { console.error(e); }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':      return <HomePage />;
      case 'services':  return <ServicesPage favorites={favorites} onToggleFavorite={toggleFavorite} />;
      case 'favorites': return <FavoritesPage favorites={favorites} onToggleFavorite={toggleFavorite} />;
      case 'cart':      return <CartPage />;
      case 'contact':   return <ContactPage />;
      case 'register':  return <RegisterPage onRegisterSuccess={handleRegisterSuccess} />;
      case 'login':     return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'profile':   return <ProfilePage onLogout={handleLogout} />;
      default:          return <HomePage />;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', fontSize: '18px', color: '#666'
      }}>
        ⏳ Загрузка...
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={cartCount}
        favCount={favorites.size}
        user={user}
        onLogout={handleLogout}
      />
      <main className="content">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;