import React, { useState } from 'react';
import { clothing } from '../Catalog/clothing';




function PriceTable() {
  const [filter, setFilter] = useState('all'); // 'all', 'men', 'women'
  const [clothing, setClothing] = useState([]);
  // Фильтрация товаров по категории
  const filteredClothing = clothing.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'men') return item.category === 'Мужская одежда';
    if (filter === 'women') return item.category === 'Женская одежда';
    return true;
  });

  return (
    <div className="price-table-container">
      {/* Контейнер с кнопками фильтра */}
      <div className="filter-buttons">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-dark'}`}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button
          className={`btn ${filter === 'men' ? 'btn-primary' : 'btn-outline-dark'}`}
          onClick={() => setFilter('men')}
        >
          Мужская одежда
        </button>
        <button
          className={`btn ${filter === 'women' ? 'btn-primary' : 'btn-outline-dark'}`}
          onClick={() => setFilter('women')}
        >
          Женская одежда
        </button>
      </div>

      {/* Сетка карточек товаров */}
      <div className="clothing-grid">
        {filteredClothing.map(item => (
          <div className="clothing-card" key={item.id}>
            <div className="card-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="card-body">
              <h3>{item.name}</h3>
              <p className="category">{item.category}</p>
              <p className="description">{item.description}</p>
              <span className="price">{item.price}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredClothing.length === 0 && (
        <p className="no-items">Товаров в данной категории нет</p>
      )}
    </div>
  );
}

export default PriceTable;