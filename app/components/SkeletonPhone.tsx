import { useEffect, useState } from 'react';

const SkeletonPhone = () => {
  const [showImage, setShowImage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Show buttons after initial animations
    const buttonsTimer = setTimeout(() => {
      setShowButtons(true);
    }, 2200);

    // Show final image after all animations
    const imageTimer = setTimeout(() => {
      setShowImage(true);
    }, 3500);

    return () => {
      clearTimeout(buttonsTimer);
      clearTimeout(imageTimer);
    };
  }, []);

  return (
    <div className="relative w-[300px] h-[630px]">
      <img 
        src="/assets/svg/app-driver.svg"
        alt="Phone Interface"
        className={`absolute inset-0 w-full h-full object-cover rounded-[40px] transition-opacity duration-500 ${
          showImage ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        showImage ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="absolute inset-0 rounded-[40px] overflow-hidden">
          <div className="absolute inset-0 p-[3px] animate-draw-border">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-[#2C4159] to-[#FF9B59]" 
                 style={{ 
                   clipPath: 'inset(0 0 0 0)',
                   transition: 'clip-path 1.5s ease-in-out'
                 }} 
            />
          </div>
          
          <div className="absolute inset-[8px] bg-white rounded-[35px] p-4 animate-fade-in">
            {/* Top Bar with Map Area */}
            <div className="flex flex-col mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full animate-slide-in p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59]"
                       style={{ animationDelay: '1s' }}>
                    <div className="h-full w-full bg-white rounded-full" />
                  </div>
                  <div className="h-4 w-20 rounded animate-slide-in p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59]"
                       style={{ animationDelay: '1.1s' }}>
                    <div className="h-full w-full bg-white rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 rounded-full animate-slide-in p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59]"
                     style={{ animationDelay: '1.2s' }}>
                  <div className="h-full w-full bg-white rounded-full" />
                </div>
              </div>
              {/* Map Area */}
              <div className="h-20 rounded-lg animate-slide-in p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59]"
                   style={{ animationDelay: '1.3s' }}>
                <div className="h-full w-full bg-white rounded-lg" />
              </div>
            </div>
            
            {/* Driver Info */}
            <div className="bg-white rounded-lg p-4 mb-6 animate-slide-in"
                 style={{ animationDelay: '1.4s' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="space-y-2">
                  <div className="h-4 w-16 rounded p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59]">
                    <div className="h-full w-full bg-white rounded" />
                  </div>
                  <div className="h-5 w-32 rounded p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59]">
                    <div className="h-full w-full bg-white rounded" />
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59]">
                  <div className="h-full w-full bg-white rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 rounded p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59]">
                  <div className="h-full w-full bg-white rounded" />
                </div>
                <div className="h-4 w-48 rounded p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59]">
                  <div className="h-full w-full bg-white rounded" />
                </div>
              </div>
            </div>
            
            {/* Rating Stars */}
            <div className="flex space-x-2 mb-6 animate-slide-in"
                 style={{ animationDelay: '1.6s' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 w-6 p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59] rounded-full">
                  <div className="h-full w-full bg-white rounded-full" />
                </div>
              ))}
            </div>
            
            {/* Vehicle Images */}
            <div className="grid grid-cols-3 gap-2 mb-6 animate-slide-in"
                 style={{ animationDelay: '1.8s' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 p-[2px] bg-gradient-to-r from-[#2C4159] to-[#FF9B59] rounded-lg">
                  <div className="h-full w-full bg-white rounded-lg" />
                </div>
              ))}
            </div>

            {/* Bottom Buttons */}
            {showButtons && (
              <div className="absolute bottom-6 left-4 right-4 space-y-2">
                <div className="h-12 w-full bg-gradient-to-r from-[#2C4159] to-[#FF9B59] rounded-full p-[2px] animate-slide-in"
                    style={{ animationDelay: '2s' }}>
                  <div className="h-full w-full bg-white rounded-full" />
                </div>
                <div className="h-12 w-full bg-gradient-to-r from-[#2C4159] to-[#FF9B59] rounded-full p-[2px] animate-slide-in"
                    style={{ animationDelay: '2.2s' }}>
                  <div className="h-full w-full bg-white rounded-full" />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPhone;