"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import SkeletonPhone from "./components/SkeletonPhone";
import EnhancedWaitlistForm from "./components/EnhancedWaitlistForm";
import Navbar from "./components/Navbar";
import ChatComponent from "./components/ChatComponent";

export default function Home() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar onWaitlistClick={() => setShowWaitlist(true)} showChat={showChat} />
      
      {!showWaitlist ? (
        <main className="container mx-auto px-4 py-16">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[600px]">
            <div className="text-left">
              <h1 className="text-5xl font-bold mb-8 text-[#081427] relative">
                Moving with<br />Complete Control
                <Image 
                  src="/assets/svg/underline.svg" 
                  alt="Underline" 
                  className="absolute -bottom-4 right-15 w-48" 
                  width={192}
                  height={48}
                />
              </h1>
              <p className="text-xl mb-12 text-black">
                Your last-mile moving solution, designed for seamless
                relocations from a single item to an entire office.
                Trusted, tech-enabled, and stress-free.
              </p>
              {!showChat && (
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="bg-[#081427] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#FF8A47] transition duration-300 inline-flex items-center"
                >
                  Get Early Access
                  <ChevronRight className="ml-2" />
                </button>
              )}
            </div>
            {!showChat && (
              <div className="flex justify-center -mt-32">
                <SkeletonPhone />
              </div>
            )}
          </section>
        </main>
      ) : (
        <EnhancedWaitlistForm 
          onClose={() => setShowWaitlist(false)} 
        />
      )}

      <div className="fixed bottom-4 right-4 z-10">
        {showChat ? (
          <ChatComponent onClose={() => setShowChat(false)} isWaitlistOpen={showWaitlist} />
        ) : (
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowChat(true)}>
            <div className="bg-white rounded-full shadow-lg px-4 py-2">
              <p className="text-gray-700">Chat with<br /> our Assistant</p>
            </div>
            <Image
              src="/assets/images/bot.png"
              alt="Chat Assistant"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#FE6912] shadow-lg animate-bounce"
              width={48}
              height={48}
            />
          </div>
        )}
      </div>

      <footer className="container mx-auto px-4 py-6 text-center">
        <p>&copy; 2024 MoveMates. All rights reserved.</p>
      </footer>
    </div>
  );
}
