interface NavbarProps {
  onWaitlistClick: () => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
}

function Navbar({ onWaitlistClick, showChat, setShowChat }: NavbarProps) {
  return (
    <header className="bg-[#fff] w-full px-6 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-2xl font-bold text-[#081427]">MoveMates</span>
      </div>
      <nav>
        {!showChat ? (
          <>
            <button 
              onClick={onWaitlistClick}
              className="hidden md:block bg-[#FE6912] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300"
            >
              Join Waitlist
            </button>
            <div 
              className="md:hidden flex items-center gap-3 cursor-pointer" 
              onClick={() => setShowChat(true)}
            >
              <div className="bg-white rounded-full shadow-lg px-4 py-2">
                <p className="text-gray-700">Chat with<br/> our Assistant</p>
              </div>
              <img 
                src="/assets/images/bot.png" 
                alt="Chat Assistant" 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FE6912] shadow-lg animate-bounce"
              />
            </div>
          </>
        ) : null}
      </nav>
    </header>
  );
}

export default Navbar;