import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="container mx-auto px-4 py-6 text-center">
      <p>&copy; {currentYear} MoveMates. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
