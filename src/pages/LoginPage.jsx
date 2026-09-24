import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage({ onLoginSuccess }) {
  return (
    <div className="page-content">
      <section className="container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '70vh'
      }}>
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </section>
    </div>
  );
}

export default LoginPage;