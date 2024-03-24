import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { Button } from 'primereact/button';
import Dashboard from './dashboard';
import Lista from './lista';

function App() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenu(!menu);
  }

  useEffect(() => {
    document.addEventListener('click', function(event) {
      const div = document.getElementById('sidebar');
      const targetElement = event.target;
      if (
        !targetElement.classList.contains('pi-bars')
        && !targetElement.classList.contains('menu-icon')
        && !div.contains(targetElement) && menu
      ) {
        setMenu(false);
      }
    });
  });

  return (
    <PrimeReactProvider>
      <div className="App">
        <header className="app-bar">
          <Button id="menu-btn" icon="pi pi-bars" text className="menu-icon" onClick={toggleMenu}/>
          Frontend React Test
        </header>
        <main>
          <nav id="sidebar" className={menu ? 'sidebar sidebar-active' : 'sidebar'}>
            <Link
              to="/dashboard"
              className={location.pathname === '/dashboard' ? 'link-layout link-active' : 'link-layout link'}
            >
              Dashboard
            </Link>
            <Link
              to="/"
              className={location.pathname === '/' ? 'link-layout link-active' : 'link-layout link'}
            >
              Lista
            </Link>
          </nav>
          <div className="content">
            <Routes>
              <Route path="/" element={<Lista />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </PrimeReactProvider>
  );
}

export default App;
