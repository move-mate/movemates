import { Button } from "./ui/button";

interface NavbarProps {
  onWaitlistClick: () => void;
}

export default function Navbar({ onWaitlistClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6 lg:px-0 py-4 flex justify-between items-center">
        <div className="flex items-center group cursor-pointer">
          <span className="text-2xl font-bold text-secondary tracking-tight">
            Move<span className="text-primary">Mates</span>
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <Button
            onClick={onWaitlistClick}
            size="sm"
            variant="secondary"
            className="bg-gray-500 text-white hover:text-secondary"
          >
            Start here
          </Button>
        </nav>
      </div>
    </header>
  );
}