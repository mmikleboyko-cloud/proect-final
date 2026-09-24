import React, { useState } from 'react';

function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = 'http://m26452hl.beget.tech';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация на клиенте
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Введите корректный email';
    }
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Важно для сессий
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (result.success) {
        // Вызываем callback успешного входа
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
        alert('✅ Добро пожаловать, ' + result.user.name + '!');
        // Очищаем форму
        setFormData({ email: '', password: '' });
        // Обновляем корзину
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        // Обрабатываем ошибки от сервера
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setServerError(result.error || 'Ошибка при входе');
        }
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      setServerError('❌ Ошибка соединения с сервером. Проверьте интернет-соединение.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section" style={{ maxWidth: '400px' }}>
      <h2>🔑 Вход в аккаунт</h2>
      
      {serverError && (
        <div className="message error" style={{ marginBottom: '20px' }}>
          ❌ {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            disabled={loading}
            className={errors.email ? 'error' : ''}
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
              placeholder="Введите пароль"
              disabled={loading}
              style={{ flex: 1 }}
              className={errors.password ? 'error' : ''}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '20px'
              }}
              disabled={loading}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-buttons" style={{ marginTop: '25px' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? '⏳ Вход...' : '🔑 Войти'}
          </button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Нет аккаунта?{' '}
            <button 
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'register' }))}
              style={{ 
                color: 'var(--accent)', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'underline'
              }}
              disabled={loading}
            >
              Зарегистрироваться
            </button>
          </p>
        </div>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#999' }}>
            <button 
              type="button"
              onClick={() => {
                setFormData({ email: 'test@example.com', password: '123456' });
              }}
              style={{ 
                color: '#999', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '12px',
                textDecoration: 'underline'
              }}
              disabled={loading}
            >
              Заполнить тестовыми данными
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;