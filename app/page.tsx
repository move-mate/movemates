'use client'
import { useState } from 'react';
import SkeletonPhone from './components/SkeletonPhone';
import EnhancedWaitlistForm from './components/EnhancedWaitlistForm';
import Navbar from './components/Navbar';
import ChatComponent from './components/ChatComponent';
import Image from 'next/image';
import Script from 'next/script';

function App() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);

  const handleChatOpen = () => {
    setShowChat(true);
    setShowMainContent(false);
  };

  const handleChatClose = () => {
    setShowChat(false);
    setShowMainContent(true);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Google Analytics script with next/script */}
      <Script 
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-ZL776P76PN" 
        async 
      />
      <Script 
        strategy="afterInteractive"
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZL776P76PN');
          `
        }} 
      />
      <Navbar 
        onWaitlistClick={() => setShowWaitlist(true)} 
        showChat={showChat} 
        setShowChat={handleChatOpen} 
      />
      
      {!showWaitlist && showMainContent && (
        <main className="container mx-auto px-4 py-8 md:py-16">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[600px]">
            <div className="text-left mt-4 md:mt-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-[#081427] relative">
                Moving with<br />Complete Control
                <Image 
                  src="/assets/svg/underline.svg" 
                  alt="Underline" 
                  className="absolute -bottom-4 right-15 w-36 md:w-48"
                  width={144} 
                  height={36}
                />
              </h1>
              <p className="text-lg md:text-xl mb-8 md:mb-12 text-black">
                Your last-mile moving solution, designed for seamless 
                <br className="hidden md:block"/> relocations from a single item to an entire office.
                <br className="hidden md:block"/> Trusted, tech-enabled, and stress-free.
              </p>
              {!showChat && (
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="bg-[#FE6912] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#FF8A47] transition duration-300 inline-flex items-center md:block"
                >
                  Get Early Access
                  {/* <ChevronRight className="ml-2" /> */}
                </button>
              )}
            </div>
            {!showChat && (
              <div className="hidden md:flex justify-center -mt-32">
                <SkeletonPhone />
              </div>
            )}
          </section>
        </main>
      )}

      {/* Chat component - handles both mobile and desktop */}
      <div className={`${
        showChat 
          ? 'fixed inset-0 z-50 flex items-start justify-center pt-2 px-4 md:fixed md:inset-auto md:bottom-4 md:right-4 md:pt-0 md:px-0' 
          : 'fixed bottom-4 right-4 z-0 md:block hidden'
      }`}>
        {showChat ? (
          <div className="w-full max-w-[450px]">
            <ChatComponent onClose={handleChatClose} isWaitlistOpen={showWaitlist} />
          </div>
        ) : (
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowChat(true)}>
            <div className="bg-white rounded-full shadow-lg px-4 py-2">
              <p className="text-gray-700">Chat with<br/> our Assistant</p>
            </div>
            <Image 
              src="/assets/images/bot.png" 
              alt="Chat Assistant" 
              className="rounded-full object-cover border-2 border-[#FE6912] shadow-lg animate-bounce"
              width={48}  // Assuming 3rem (48px) for width
              height={48} // Assuming 3rem (48px) for height
            />
          </div>
        )}
      </div>

      {showWaitlist && (
        <EnhancedWaitlistForm onClose={() => setShowWaitlist(false)} />
      )}

      <footer className="container mx-auto px-4 py-6 text-center">
        <p>&copy; 2024 MoveMates. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;