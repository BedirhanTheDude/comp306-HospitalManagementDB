import React from 'react';

const SignupPage = ({ goToLogin }) => {
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
        width: '380px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Sign Up</h1>

        <label>Full Name</label>
        <input type="text" required style={{ marginBottom: '12px', padding: '8px' }} />

        <label>Username</label>
        <input type="text" required style={{ marginBottom: '12px', padding: '8px' }} />

        <label>Email</label>
        <input type="email" required style={{ marginBottom: '12px', padding: '8px' }} />

        <label>Password</label>
        <input type="password" required style={{ marginBottom: '12px', padding: '8px' }} />

        <label>Confirm Password</label>
        <input type="password" required style={{ marginBottom: '20px', padding: '8px' }} />

        <button type="submit" style={{ padding: '10px', marginBottom: '10px' }}>
          Create Account
        </button>

        <button type="button" onClick={goToLogin}>
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
