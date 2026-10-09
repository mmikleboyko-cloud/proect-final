import React from 'react';
import RulesContent from '../components/RulesContent';

function RulesPage() {
  return (
    <div className="page-content">
      <section className="container">
        <h1 className="page-title">Правила пользования</h1>
        <div className="rules-page-content">
          <RulesContent />
          <p className="rules-updated">Последнее обновление: 2026</p>
        </div>
      </section>
    </div>
  );
}

export default RulesPage;