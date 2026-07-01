import React from 'react';
import PriceTable from '../components/PriceTable';

function ServicesPage() {
  return (
    <div className="page-content">
      <section className="price-section container">
        <h1 className="page-title">Наилучшая одежда из продаж</h1>
        <PriceTable />
      </section>
    </div>
  );
}

export default ServicesPage;