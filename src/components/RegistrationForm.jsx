import React, { useState } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    city: '',
    rules: false
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [workshop, setWorkshop] = useState(false);
  const [likesBananas, setLikesBananas] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (formData.name.length < 2) {
      newErrors.name = 'Введите имя не менее 2 символов';
    }
    
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Введите корректный email';
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
    // Очищаем ошибку при изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // send form data
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      age: '',
      city: '',
      rules: false
    });
    setErrors({});
    setSubmitted(false);
    setShowOptions(false);
    setWorkshop(false);
    setLikesBananas(false);
  };

  if (submitted) {
    return (
      <div className="form-section">
        <div className="message success">
          Регистрация успешно завершена!
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
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите имя"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Возраст:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Введите возраст"
          />
        </div>

        <div className="form-group">
          <label>Город:</label>
          <select name="city" value={formData.city} onChange={handleChange}>
            <option value="">Выберите город</option>
            <option value="Москва">Москва</option>
            <option value="Санкт-Петербург">Санкт-Петербург</option>
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
            />
            Согласен с правилами
          </label>
          {errors.rules && <span className="error-message">{errors.rules}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">Отправить</button>
          <button type="button" onClick={handleReset} className="btn" style={{ background: '#ccc', color: '#333' }}>
            Очистить
          </button>
        </div>
      </form>

    
    </div>
  );
}

export default RegistrationForm;