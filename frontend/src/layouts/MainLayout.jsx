import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export const MainLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content-area">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
