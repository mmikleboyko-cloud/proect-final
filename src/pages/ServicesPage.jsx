import React from 'react';
import PriceTable from '../components/PriceTable';

function ServicesPage({ favorites, onToggleFavorite }) {
  return (
    <div className="page-content">
      <section className="price-section container">
        <h1 className="page-title">Наилучшая одежда из продаж</h1>
        <PriceTable
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      </section>
    </div>
  );
}

export default ServicesPage;