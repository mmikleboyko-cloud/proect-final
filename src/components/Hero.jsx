import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <span className="sub-title">Ваш идеальный стиль</span>
        <h1 className="main-title">Наслаждения <br />от вещей</h1>
        <p className="hero-desc">Погрузитесь в атмосферу спокойствия и удовлетворения.</p>
        <div className="hero-btns">
          <a href="#" className="btn btn-primary">Перейти в каталог</a>
          <a href="#" className="btn btn-outline">Смотреть видео</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;