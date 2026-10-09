import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

function FavoritesPage({ favorites, onToggleFavorite }) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItemId, setAddingItemId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://m26452hl.beget.tech/get_favorites.php', { credentials: 'include' });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Ошибка загрузки избранного:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelectedProduct(null); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [selectedProduct]);

  const handleAddToCart = async (productId) => {
    setAddingItemId(productId);
    try {
      const response = await fetch('http://m26452hl.beget.tech/add_to_cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Товар добавлен в корзину');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else throw new Error(result.error || 'Ошибка');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAddingItemId(null);
    }
  };

  const handleRemoveFav = async (productId) => {
    await onToggleFavorite(productId);
    setItems(prev => prev.filter(i => i.id !== productId));
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/600x800/e9b8b2/3c3c3c?text=Изображение+недоступно';
  };

  const goToCatalog = () => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'services' }));
  };

  const openProduct = (item) => setSelectedProduct(item);
  const closeProduct = () => setSelectedProduct(null);

  if (loading) {
    return (
      <div className="page-content">
        <section className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>⏳ Загрузка избранного...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="container">
        <h1 className="page-title">❤️ Избранное</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '20px', color: '#666', marginBottom: '10px' }}>
              Вы пока ничего не добавили в избранное
            </p>
            <p style={{ fontSize: '14px', color: '#999', marginBottom: '30px' }}>
              Нажмите на 🤍 рядом с товаром в каталоге, чтобы сохранить его здесь
            </p>
            <button className="btn btn-primary" onClick={goToCatalog}>Перейти в каталог</button>
          </div>
        ) : (
          <div className="clothing-grid">
            {items.map(item => (
              <div className="clothing-card" key={item.id}>
                <div className="card-image" onClick={() => openProduct(item)} style={{ cursor: 'pointer' }}>
                  <img src={item.image} alt={item.name} onError={handleImageError} loading="lazy" />
                  <button
                    className="fav-btn active"
                    onClick={(e) => { e.stopPropagation(); handleRemoveFav(item.id); }}
                  >❤️</button>
                  <div className="card-image-overlay">
                    <span className="card-view-badge">👁 Просмотр</span>
                  </div>
                </div>
                <div className="card-body">
                  <h3 onClick={() => openProduct(item)} style={{ cursor: 'pointer' }}>{item.name}</h3>
                  <p className="category">{item.category}</p>
                  <p className="description">{item.description}</p>
                  <span className="price">{Number(item.price).toLocaleString()} ₽</span>
                  <div className="card-actions">
                    <button
                      className="btn btn-primary card-btn-cart"
                      onClick={() => handleAddToCart(item.id)}
                      disabled={addingItemId === item.id}
                    >
                      {addingItemId === item.id ? '⏳' : '🛒 В корзину'}
                    </button>
                    <button className="btn card-btn-more" onClick={() => openProduct(item)}>Подробнее</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProduct && (
          <div className="product-modal-overlay" onClick={closeProduct}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <button className="product-modal-close" onClick={closeProduct}>✕</button>
              <div className="product-modal-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} onError={handleImageError} />
                <button
                  className={`fav-btn fav-btn-modal ${favorites?.has(selectedProduct.id) ? 'active' : ''}`}
                  onClick={() => onToggleFavorite(selectedProduct.id)}
                >
                  {favorites?.has(selectedProduct.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="product-modal-info">
                <span className="product-modal-category">{selectedProduct.category}</span>
                <h2 className="product-modal-title">{selectedProduct.name}</h2>
                <p className="product-modal-desc">{selectedProduct.description}</p>
                <div className="product-modal-price-row">
                  <span className="product-modal-price">{Number(selectedProduct.price).toLocaleString()} ₽</span>
                </div>
                <div className="product-modal-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(selectedProduct.id)}
                    disabled={addingItemId === selectedProduct.id}
                    style={{ flex: 1 }}
                  >
                    {addingItemId === selectedProduct.id ? '⏳ Добавление...' : '🛒 Добавить в корзину'}
                  </button>
                  <button className="btn btn-outline-dark" onClick={closeProduct} style={{ flex: 1 }}>Закрыть</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default FavoritesPage;