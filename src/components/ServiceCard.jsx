import React from 'react';

function ServiceCard({ title, description, image, large }) {
  return (
    <article className={`service-card ${large ? 'large' : ''}`}>
      <div className="service-img-wrapper">
        <img src={image} alt={title} />
      </div>
      <div className="service-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <a href="#" className="arrow-link">Узнать больше <span>&rarr;</span></a>
      </div>
    </article>
  );
}

export default ServiceCard;