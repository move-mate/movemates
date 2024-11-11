interface NavbarProps {
    onWaitlistClick: () => void;
    showChat: boolean;
  }
  
  function Navbar({ onWaitlistClick, showChat }: NavbarProps) {
    return (
      <header className="bg-[#fff] w-full px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-[#081427]">MoveMates</span>
        </div>
        <nav>
          {!showChat && (
            <button 
              onClick={onWaitlistClick} 
              className="bg-[#FE6912] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300"
            >
              Join Waitlist
            </button>
          )}
        </nav>
      </header>
    );
  }
  
  export default Navbar;