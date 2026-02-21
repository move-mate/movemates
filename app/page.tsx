"use client";
import { useState } from "react";
import EnhancedWaitlistForm from "./components/EnhancedWaitlistForm";
import Navbar from "./components/Navbar";
import ChatComponent from "./components/ChatComponent";
import Image from "next/image";
import Footer from "./components/Footer";
import { MessageSquare } from "lucide-react";
import { Button } from "./components/ui/button";

export default function App() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);

  const handleChatClose = () => {
    setShowChat(false);
    setShowMainContent(true);
  };

  return (
    <div className="h-screen max-h-screen text-secondary relative overflow-hidden flex flex-col">
      <div className="absolute inset-x-0 bottom-0 h-[10vh] md:h-[20vh] lg:h-[40vh] z-0 pointer-events-none">
        <Image
          src="/assets/images/pack.jpg"
          alt="Packing background"
          fill
          className="object-cover object-top rounded-t-3xl px-1"
          priority
        />
      </div>

      <div className="relative z-20">
        <Navbar onWaitlistClick={() => setShowWaitlist(true)} />
      </div>

      {!showWaitlist && showMainContent && (
        <main className="container mx-auto px-6 py-4 lg:py-8 max-w-7xl flex-grow flex flex-col pt-24 relative z-10 transition-all duration-500 ease-in-out">
          <section className="flex flex-col items-center justify-center w-full mt-8 lg:mt-0">
            <div className="flex flex-col items-center text-center space-y-8 max-w-5xl">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-[#081427] leading-[1.1] tracking-tight relative">
                Moving with
                <br />
                <span className="relative inline-block mt-2">
                  Complete Control
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-500 leading-relaxed font-medium">
                Your last-mile moving solution, designed for seamless
                relocations from a single item to an entire office. <br />
                Trusted, tech-enabled, and stress-free.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <Button
                  onClick={() => setShowWaitlist(true)}
                  size="lg"
                  className="hover:shadow-[0_8px_30px_rgb(254,105,18,0.3)] transition-all duration-300 ease-out transform hover:-translate-y-1 flex items-center justify-center border border-transparent focus:ring-4 focus:ring-[#FE6912]/30 focus:outline-none"
                >
                  <span>Join the Waitlist</span>
                </Button>
              </div>
            </div>
          </section>
        </main>
      )}

      <div
        className={`${
          showChat
            ? "fixed inset-0 z-50 flex items-start justify-center pt-2 px-4 md:fixed md:inset-auto md:bottom-6 md:right-6 md:pt-0 md:px-0"
            : "fixed bottom-8 right-8 z-40"
        } transition-all duration-300 ease-in-out`}
      >
        {showChat ? (
          <div className="w-full max-w-[450px] shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5 transform transition-all duration-300 scale-100 origin-bottom-right bg-white">
            <ChatComponent
              onClose={handleChatClose}
              isWaitlistOpen={showWaitlist}
            />
          </div>
        ) : (
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => setShowChat(true)}
          >
            <div className="relative bg-[#FE6912] p-4 rounded-full hover:scale-110 transition-transform duration-300">
              <MessageSquare
                className="text-white hover:scale-110 transition-transform duration-300"
                size={24}
              />
            </div>
          </div>
        )}
      </div>

      {showWaitlist && (
        <EnhancedWaitlistForm onClose={() => setShowWaitlist(false)} />
      )}

      <Footer />
    </div>
  );
}
