import React from 'react';

const LoginPage = ({ goToSignup }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f6f8',
    }}>
      <form style={{
        background: '#fff',
        padding: '32px',
        borderRadius: '8px',
        width: '360px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Login</h1>

        <label>TR Identity Number</label>
        <input type="text" required style={{ marginBottom: '16px', padding: '8px' }} />

        <label>Password</label>
        <input type="password" required style={{ marginBottom: '20px', padding: '8px' }} />

        <button type="submit" style={{ padding: '10px', marginBottom: '10px' }}>
          Login
        </button>

        <button type="button" onClick={goToSignup}>
          Don’t have an account? Sign Up
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
