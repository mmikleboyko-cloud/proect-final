import React from 'react';

function Hero() {
  const goToCatalog = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'services' }));
  };

  return (
    <section className="hero" style={{ backgroundImage: "url('/images/hero.jpg')" }}>
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <span className="sub-title">Ваш идеальный стиль</span>
        <h1 className="main-title">Наслаждения <br />от вещей</h1>
        <p className="hero-desc">Погрузитесь в атмосферу спокойствия и удовлетворения.</p>
        <div className="hero-btns">
          <a href="#" className="btn btn-primary" onClick={goToCatalog}>
            Перейти в каталог
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;