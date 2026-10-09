import { useState, useEffect } from 'react';
import RulesContent from './RulesContent';
import { useToast } from '../context/ToastContext';

function RegistrationForm({ onRegisterSuccess }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    rules: false,
    personalData: false
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [rulesOpen, setRulesOpen] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (formData.name.length < 2) newErrors.name = 'Введите имя не менее 2 символов';
    if (!formData.email.includes('@') || !formData.email.includes('.')) newErrors.email = 'Введите корректный email';
    if (!formData.password || formData.password.length < 10) newErrors.password = 'Пароль должен содержать минимум 10 символов';
    if (!formData.city) newErrors.city = 'Выберите город из списка';
    if (!formData.rules) newErrors.rules = 'Необходимо согласиться с правилами';
    if (!formData.personalData) newErrors.personalData = 'Необходимо согласие на обработку данных';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const response = await fetch('http://m26452hl.beget.tech/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          city: formData.city,
          rules: formData.rules,
          personalData: formData.personalData
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', password: '', city: '', rules: false, personalData: false });
        toast.success('Регистрация успешна!');
        if (onRegisterSuccess) onRegisterSuccess(result.user);
      } else {
        if (result.errors) setErrors(result.errors);
        else setServerError(result.error || 'Ошибка при регистрации');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      setServerError('Ошибка соединения с сервером.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', password: '', city: '', rules: false, personalData: false });
    setErrors({});
    setSubmitted(false);
    setServerError('');
  };

  const acceptRules = () => {
    setFormData(prev => ({ ...prev, rules: true }));
    setErrors(prev => ({ ...prev, rules: '' }));
    setRulesOpen(false);
  };

  useEffect(() => {
    if (!rulesOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setRulesOpen(false); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [rulesOpen]);

  if (submitted) {
    return (
      <div className="form-section">
        <div className="message success">✅ Регистрация успешно завершена!</div>
        <div className="form-buttons" style={{ marginTop: '20px' }}>
          <button onClick={handleReset} className="btn" style={{ background: '#334155', color: 'white' }}>
            Зарегистрировать еще
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h2>Форма регистрации</h2>

      {serverError && (
        <div className="message error" style={{ marginBottom: '20px' }}>
          ❌ {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите имя"
            disabled={loading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите email"
            disabled={loading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Пароль *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль (минимум 10 символов)"
            disabled={loading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Город *</label>
          <select name="city" value={formData.city} onChange={handleChange} disabled={loading}>
            <option value="">Выберите город</option>
            <option value="Москва">Москва</option>
            <option value="Санкт-Петербург">Санкт-Петербург</option>
            <option value="Ростов-на-Дону">Ростов-на-Дону</option>
            <option value="Казань">Казань</option>
            <option value="Новосибирск">Новосибирск</option>
            <option value="Екатеринбург">Екатеринбург</option>
          </select>
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rules"
              checked={formData.rules}
              onChange={handleChange}
              disabled={loading}
            />
            <span
              className="rules-link-text"
              onClick={(e) => {
                e.preventDefault();
                setRulesOpen(true);
              }}
            >
              Согласен с правилами
            </span>
          </label>
          {errors.rules && <span className="error-message">{errors.rules}</span>}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="personalData"
              checked={formData.personalData}
              onChange={handleChange}
              disabled={loading}
            />
            Я даю согласие на обработку персональных данных
          </label>
          {errors.personalData && <span className="error-message">{errors.personalData}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Отправка...' : 'Отправить'}
          </button>
          <button type="button" onClick={handleReset} className="btn" style={{ background: '#ccc', color: '#333' }} disabled={loading}>
            Очистить
          </button>
        </div>
      </form>

      {rulesOpen && (
        <div className="rules-modal-overlay" onClick={() => setRulesOpen(false)}>
          <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
            <button className="rules-modal-close" onClick={() => setRulesOpen(false)}>✕</button>
            <h2 className="rules-modal-title">Правила пользования</h2>
            <div className="rules-modal-body">
              <RulesContent />
            </div>
            <div className="rules-modal-actions">
              <button className="btn btn-primary" onClick={acceptRules} style={{ flex: 1 }}>
                Я согласен с правилами
              </button>
              <button className="btn btn-outline-dark" onClick={() => setRulesOpen(false)} style={{ flex: 1 }}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationForm;