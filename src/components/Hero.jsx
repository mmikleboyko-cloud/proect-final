import React from 'react';
import overlayImage from '../images/i.webp';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay" style={{ 
          backgroundImage: `url(${overlayImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} ></div>
      <div className="container hero-content">
        <span className="sub-title">Ваш идеальный стиль</span>
        <h1 className="main-title">Наслаждения <br />от вещей</h1>
        <p className="hero-desc">Погрузитесь в атмосферу спокойствия и удовлетворения.</p>
        <div className="hero-btns">
          <a href="#" className="btn btn-primary">Добавить в покупки</a>
          <a href="#" className="btn btn-outline">Смотреть видео</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;