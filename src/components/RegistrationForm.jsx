import React, { useState } from 'react';

function RegistrationForm({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    city: '',
    rules: false
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (formData.name.length < 2) {
      newErrors.name = 'Введите имя не менее 2 символов';
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Введите корректный email';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    if (!formData.city) {
      newErrors.city = 'Выберите город из списка';
    }
    if (!formData.rules) {
      newErrors.rules = 'Необходимо согласиться с правилами';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  // ⚠️ ВАЖНО: handleSubmit объявлен как async!
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
          age: formData.age,
          city: formData.city,
          rules: formData.rules
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: '', email: '', password: '', age: '', city: '', rules: false
        });
        // Авто-логин: сообщаем наверх
        if (onRegisterSuccess) onRegisterSuccess(result.user);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setServerError(result.error || 'Ошибка при регистрации');
        }
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      setServerError('Ошибка соединения с сервером. Проверьте интернет-соединение.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '', email: '', password: '', age: '', city: '', rules: false
    });
    setErrors({});
    setSubmitted(false);
    setServerError('');
  };

  if (submitted) {
    return (
      <div className="form-section">
        <div className="message success">
          ✅ Регистрация успешно завершена!
        </div>
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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль (минимум 6 символов)"
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Возраст</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Введите возраст"
            disabled={loading}
            min="1"
            max="150"
          />
        </div>

        <div className="form-group">
          <label>Город *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={loading}
          >
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
            Согласен с правилами
          </label>
          {errors.rules && <span className="error-message">{errors.rules}</span>}
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Отправка...' : 'Отправить'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn"
            style={{ background: '#ccc', color: '#333' }}
            disabled={loading}
          >
            Очистить
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;