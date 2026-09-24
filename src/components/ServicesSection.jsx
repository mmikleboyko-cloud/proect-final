import React from 'react';
import ServiceCard from './ServiceCard';
     
const services = [
  {
    id: 1,
    title: 'Сделай себя лучше',
    description: 'Более 5 видов размера',
    image: "/images/unnamed.jpg",
    large: true
  },
  {
    id: 2,
    title: 'Сделай себя лучше',
    description: 'Более 10 видов размера',
    image: "/images/pretty-young-caucasian-woman-model-with-fashion-jeans-jacket-with-glamorous-rhinestones-black-tank-top-stands-near-modern-metal-building-street_338491-10536.avif",
    large: false
  },
  {
    id: 3,
    title: 'Сделай себя лучше',
    description: 'Более 20 видов размера',
    image: "/images/unnamed.jpg",
    large: false
  },
  {
    id: 4,
    title: 'Премиальная кожа',
    description: 'Стиль',
    image: "/images/unnamed.jpg",
    large: false
  },
  {
    id: 5,
    title: 'Яркость',
    description: 'Тебе подойдет',
    image: "/images/unnamed.jpg",
    large: false
  }
];

function ServicesSection() {
  return (
    <section className="container services-section">
      <div className="section-header">
        <h2 className="section-title">Самые популярные</h2>
        <p>Для тех кто любит одеваться стильно</p>
      </div>
      <div className="services-grid">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            image={service.image}
            large={service.large}
          />
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;