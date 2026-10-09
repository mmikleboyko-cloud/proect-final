import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

function ProfilePage({ onLogout }) {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activating, setActivating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://m26452hl.beget.tech/profile.php', { credentials: 'include' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Ошибка загрузки');
      setProfile(data.user);
      setOrders(data.orders);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleCopyCode = async () => {
    if (!profile?.welcome_code) return;
    try {
      await navigator.clipboard.writeText(profile.welcome_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.warning('Не удалось скопировать. Код: ' + profile.welcome_code);
    }
  };

  const handleActivate = async () => {
    if (!window.confirm('Активировать код? После этого он станет использованным.')) return;
    setActivating(true);
    try {
      const res = await fetch('http://m26452hl.beget.tech/activate_welcome.php', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Ошибка');

      setProfile(prev => ({ ...prev, welcome_used: true, discount_percent: data.discount_percent }));
      toast.success(data.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActivating(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso.replace(' ', 'T'));
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const goToCatalog = () => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'services' }));
  };

  if (loading) {
    return (
      <div className="page-content">
        <section className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>⏳ Загрузка профиля...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <section className="container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#e74c3c', fontSize: '18px' }}>❌ {error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
              Обновить страницу
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="container">
        <h1 className="page-title">Личный кабинет</h1>

        <div className="profile-layout">
          <aside className="profile-card">
            <div className="profile-avatar">{getInitials(profile.name)}</div>
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-email">{profile.email}</p>

            <div className="profile-divider" />

            <ul className="profile-info-list">
              <li><span className="label">Город</span><span className="value">{profile.city || '—'}</span></li>
              <li><span className="label">Возраст</span><span className="value">{profile.age ?? '—'}</span></li>
              <li><span className="label">С нами с</span><span className="value">{formatDate(profile.created_at)}</span></li>
            </ul>

            <button className="btn profile-logout-btn" onClick={onLogout}>Выйти из аккаунта</button>
          </aside>

          <div className="profile-main">
            {!profile.welcome_used && profile.welcome_code ? (
              <div className="profile-block gift-block">
                <div className="gift-header">
                  <span className="gift-icon">🎁</span>
                  <div>
                    <h3>Приветственный подарок</h3>
                    <p>Ваш одноразовый код на скидку <strong>10%</strong> на следующий заказ</p>
                  </div>
                </div>

                <div className="gift-code-wrapper">
                  <code className="gift-code">{profile.welcome_code}</code>
                  <button className="btn btn-primary gift-copy-btn" onClick={handleCopyCode}>
                    {copied ? '✓ Скопировано' : 'Скопировать'}
                  </button>
                </div>

                <button
                  className="btn btn-outline-dark gift-activate-btn"
                  onClick={handleActivate}
                  disabled={activating}
                >
                  {activating ? '⏳ Активация...' : '✨ Активировать сейчас'}
                </button>

                <p className="gift-note">
                  Код можно активировать <strong>только один раз</strong>. После активации скидка 10% применится к следующему заказу.
                </p>
              </div>
            ) : profile.welcome_used ? (
              <div className="profile-block gift-block used">
                <span className="gift-icon">✅</span>
                <div>
                  <h3>Код активирован</h3>
                  <p>Ваша скидка <strong>{profile.discount_percent}%</strong> ждёт следующего заказа</p>
                </div>
              </div>
            ) : null}

            <div className="profile-block">
              <h3 className="profile-block-title">📦 История заказов</h3>
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <p>У вас пока нет заказов</p>
                  <button className="btn btn-primary" onClick={goToCatalog}>Перейти в каталог</button>
                </div>
              ) : (
                <div className="orders-table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>№ заказа</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>{formatDate(o.created_at)}</td>
                          <td><strong>{o.total.toLocaleString()} ₽</strong></td>
                          <td>
                            <span className={`status-badge status-${o.status}`}>
                              {o.status === 'new' ? 'Новый' : o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;