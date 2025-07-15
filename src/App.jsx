import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Hero from './components/custom/Hero';
import About from './components/custom/About';
import Footer from './components/custom/Footer';
import Navbar from './components/custom/Navbar';
import GetStarted from './components/custom/GetStarted';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar />
        <section id="home">
          <Hero />
        </section>
        <About />
        <section id="get-started">
          <GetStarted />
        </section>
        <section id="contact">
          <Footer />
        </section>
      </div>
    </ThemeProvider>
  );
}

export default App;
