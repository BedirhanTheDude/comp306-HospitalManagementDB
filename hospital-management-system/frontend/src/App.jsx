import React from 'react';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  const [page, setPage] = useState('login'); // 'login' | 'signup'

    return (
      <div className="App">
        {page === 'login' ? (
          <LoginPage goToSignup={() => setPage('signup')} />
        ) : (
          <SignupPage goToLogin={() => setPage('login')} />
        )}
      </div>
    );
}

export default App;
