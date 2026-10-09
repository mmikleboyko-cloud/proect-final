import { useState, useEffect } from 'react';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { useToast } from '../context/ToastContext';

function CartPage({ user }) {
  const toast = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const API_URL = 'http://m26452hl.beget.tech';

  // Если user подгрузился позже — обновить поля
  useEffect(() => {
    if (user) {
      setCheckoutData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/100x100/e9b8b2/3c3c3c?text=Нет+фото';
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/get_cart.php`, { credentials: 'include' });
      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Ошибка загрузки корзины:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;
    try {
      await fetch(`${API_URL}/update_cart.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cart_id: cartId, quantity: newQty })
      });
      fetchCart();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (e) {
      toast.error('Ошибка обновления количества');
    }
  };

  const removeItem = async (cartId) => {
    if (!window.confirm('Удалить товар из корзины?')) return;
    try {
      await fetch(`${API_URL}/remove_from_cart.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cart_id: cartId })
      });
      fetchCart();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success('Товар удалён из корзины');
    } catch (e) {
      toast.error('Ошибка удаления товара');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!checkoutData.name || !checkoutData.email || !checkoutData.phone || !checkoutData.address) {
      toast.warning('Заполните все поля');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/checkout.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(checkoutData)
      });
      const result = await res.json();
      if (result.success) {
        setOrderSuccess(true);
        setOrderId(result.order_id);
        setCartItems([]);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        toast.success('Заказ успешно оформлен!');
      } else {
        toast.error('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (e) {
      toast.error('Ошибка оформления заказа');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return (
    <div className="page-content">
      <section className="container">
        <p>⏳ Загрузка корзины...</p>
      </section>
    </div>
  );

  if (orderSuccess) {
    return (
      <div className="page-content">
        <section className="container">
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h1 style={{ color: '#28a745' }}>✅ Заказ успешно оформлен!</h1>
            <p style={{ fontSize: '18px' }}>Номер заказа: <strong>#{orderId}</strong></p>
            <p>Спасибо за покупку! Мы свяжемся с вами в ближайшее время.</p>
            <button
              className="btn btn-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'home' }))}
              style={{ marginTop: '20px' }}
            >
              Продолжить покупки
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="container">
        <h1 className="page-title">🛒 Корзина</h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: '18px' }}>Ваша корзина пуста</p>
            <button
              className="btn btn-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'services' }))}
              style={{ marginTop: '20px' }}
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map(item => (
                <div key={item.cart_id} className="cart-item">
                  <img
                    src={item.image || 'https://placehold.co/100x100/e9b8b2/3c3c3c?text=Нет+фото'}
                    alt={item.name}
                    width="100"
                    height="100"
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                    onError={handleImageError}
                  />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="category">{item.category}</p>
                    <p className="price">{Number(item.price).toLocaleString()} ₽</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}>+</button>
                      <button className="remove-btn" onClick={() => removeItem(item.cart_id)}>✕ Удалить</button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <strong>{(Number(item.price) * item.quantity).toLocaleString()} ₽</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <h3>Итого: <span>{total.toLocaleString()} ₽</span></h3>
              </div>
            </div>

            <hr style={{ margin: '30px 0' }} />

            <div className="checkout-form">
              <h2>Оформление заказа</h2>

              {user && (
                <div className="checkout-user-info">
                  ✅ Вы вошли как <strong>{user.name}</strong> ({user.email})
                </div>
              )}

              <form onSubmit={handleCheckout}>
                {!user && (
                  <>
                    <div className="form-group">
                      <label>Имя *</label>
                      <input
                        type="text"
                        value={checkoutData.name}
                        onChange={e => setCheckoutData({ ...checkoutData, name: e.target.value })}
                        required
                        placeholder="Введите ваше имя"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={checkoutData.email}
                        onChange={e => setCheckoutData({ ...checkoutData, email: e.target.value })}
                        required
                        placeholder="example@mail.com"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Телефон *</label>
                  <input
                    type="tel"
                    value={checkoutData.phone}
                    onChange={e => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                    required
                    placeholder="+7 (900) 123-45-67"
                  />
                </div>

                <div className="form-group">
                  <label>Адрес доставки *</label>
                  <AddressAutocomplete
                    value={checkoutData.address}
                    onChange={(val) => setCheckoutData({ ...checkoutData, address: val })}
                    placeholder="Начните вводить улицу (например, «ворош»)"
                  />
                  <small className="autocomplete-hint">
                    Выберите улицу из подсказок, потом добавьте дом и квартиру
                  </small>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                  Оформить заказ на {total.toLocaleString()} ₽
                </button>
              </form>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default CartPage;