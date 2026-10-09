import { useState, useEffect, useMemo } from 'react';
import { useToast } from '../context/ToastContext';

const ITEMS_PER_PAGE = 8;

function PriceTable({ onAddToCart, favorites, onToggleFavorite }) {
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [clothing, setClothing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingItemId, setAddingItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredClothing = useMemo(() => {
    return clothing.filter(item => {
      if (filter !== 'all') {
        const cat = item.category.toLowerCase();
        if (filter === 'men' && !(cat.includes('муж') || cat.includes('male'))) return false;
        if (filter === 'women' && !(cat.includes('жен') || cat.includes('female'))) return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const inName = item.name.toLowerCase().includes(q);
        const inDesc = (item.description || '').toLowerCase().includes(q);
        const inCat = item.category.toLowerCase().includes(q);
        if (!inName && !inDesc && !inCat) return false;
      }
      return true;
    });
  }, [clothing, filter, searchQuery]);

  useEffect(() => { setCurrentPage(1); }, [filter, searchQuery]);

  const totalPages = Math.ceil(filteredClothing.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClothing.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClothing, currentPage]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  useEffect(() => {
    fetch('http://m26452hl.beget.tech/clothes.php')
      .then(res => res.json())
      .then(data => { setClothing(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

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
      } else {
        throw new Error(result.error || 'Ошибка добавления');
      }
    } catch (err) {
      toast.error('Ошибка: ' + err.message);
    } finally {
      setAddingItemId(null);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/600x800/e9b8b2/3c3c3c?text=Изображение+недоступно';
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProduct = (item) => setSelectedProduct(item);
  const closeProduct = () => setSelectedProduct(null);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}><p>⏳ Загрузка товаров...</p></div>;
  if (error) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
      <p>❌ Ошибка загрузки: {error}</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>Повторить попытку</button>
    </div>
  );

  return (
    <div className="price-table-container">
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по названию, описанию или категории..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && <button className="search-clear" onClick={() => setSearchQuery('')} aria-label="Очистить">✕</button>}
      </div>

      <div className="filter-buttons">
        <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-dark'}`} onClick={() => setFilter('all')}>Все</button>
        <button className={`btn ${filter === 'men' ? 'btn-primary' : 'btn-outline-dark'}`} onClick={() => setFilter('men')}>Мужская</button>
        <button className={`btn ${filter === 'women' ? 'btn-primary' : 'btn-outline-dark'}`} onClick={() => setFilter('women')}>Женская</button>
      </div>

      {searchQuery.trim() !== '' && (
        <p className="search-results-info">
          Найдено: <strong>{filteredClothing.length}</strong>
          {filteredClothing.length === 0 && ' — ничего не найдено'}
        </p>
      )}

      <div className="clothing-grid">
        {paginatedItems.map(item => {
          const isFav = favorites?.has(item.id);
          return (
            <div className="clothing-card" key={item.id}>
              <div className="card-image" onClick={() => openProduct(item)} style={{ cursor: 'pointer' }}>
                <img src={item.image} alt={item.name} onError={handleImageError} loading="lazy" />
                <button
                  className={`fav-btn ${isFav ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(item.id); }}
                  aria-label="В избранное"
                >
                  {isFav ? '❤️' : '🤍'}
                </button>
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
          );
        })}
      </div>

      {filteredClothing.length === 0 && searchQuery.trim() === '' && (
        <p className="no-items">Нет товаров в выбранной категории</p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-arrow" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Предыдущая">←</button>
          {pageNumbers.map((p, idx) =>
            p === '...' ? <span key={`dots-${idx}`} className="pagination-dots">…</span>
              : <button key={p} className={`pagination-btn ${currentPage === p ? 'active' : ''}`} onClick={() => goToPage(p)}>{p}</button>
          )}
          <button className="pagination-arrow" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Следующая">→</button>
        </div>
      )}

      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProduct}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="product-modal-close" onClick={closeProduct} aria-label="Закрыть">✕</button>
            <div className="product-modal-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} onError={handleImageError} />
              <button
                className={`fav-btn fav-btn-modal ${favorites?.has(selectedProduct.id) ? 'active' : ''}`}
                onClick={() => onToggleFavorite && onToggleFavorite(selectedProduct.id)}
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
    </div>
  );
}

export default PriceTable;