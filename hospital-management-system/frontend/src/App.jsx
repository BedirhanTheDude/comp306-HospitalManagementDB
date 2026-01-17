import React from 'react';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WelcomePage from './pages/WelcomePage';
import AdminHomePage from './pages/AdminHomePage';
import DoctorHomePage from './pages/DoctorHomePage';
import PatientHomePage from './pages/PatientHomePage';

function App() {
  const [page, setPage] = useState('welcome'); // welcome | signup | login
  const [role, setRole] = useState(null);

  return (
      <>
        {page === 'welcome' && (
          <WelcomePage
            onSelectRole={(selectedRole) => {
              setRole(selectedRole);
              setPage('login');
            }}
          />
        )}

        {page === 'login' && (
          <LoginPage
            role={role}
            goToSignup={() => setPage('signup')}
            goToWelcome={() => setPage('welcome')}
            goToHome={() => {
              if (role === 'ADMIN') setPage('adminHome');
              else if (role === 'DOCTOR') setPage('doctorHome');
              else setPage('patientHome');
            }}
          />
        )}

        {page === 'signup' && (
          <SignupPage
            goToLogin={() => setPage('login')}
            goToWelcome={() => setPage('welcome')}
            goToHome={() => setPage('patientHome')}
          />
        )}

        {page === 'adminHome' && <AdminHomePage />}
        {page === 'doctorHome' && <DoctorHomePage />}
        {page === 'patientHome' && <PatientHomePage />}
      </>
    );
  }

  export default App;
