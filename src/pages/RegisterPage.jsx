import React from 'react';
import RegistrationForm from '../components/RegistrationForm';

function RegisterPage({ onRegisterSuccess }) {
  return (
    <div className="page-content">
      <section className="container">
        <RegistrationForm onRegisterSuccess={onRegisterSuccess} />
      </section>
    </div>
  );
}

export default RegisterPage;