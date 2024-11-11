import { Star, Calculator, Handshake, Clock, Map, NotebookPen } from 'lucide-react';

const BusinessFeatures = () => {
  const features = [
    {
      icon: <NotebookPen className="w-8 h-8" />,
      title: "Tailored Moving Plans for Businesses",
      description: "MoveMates offers tailored moving plans that fit any business scale, from small offices to large corporate spaces."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Dedicated, Top-Rated Drivers",
      description: "Our network includes drivers who are highly reviewed for their professionalism and reliability, giving businesses peace of mind."
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Transparent and Upfront Pricing",
      description: "Businesses receive instant and accurate quotes, ensuring transparent pricing without hidden fees for straightforward planning."
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Comprehensive Support",
      description: "We offer end-to-end support, including packing, equipment handling, and dedicated move coordination with post-service support."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Priority Scheduling",
      description: "We provide priority scheduling and quick turnaround times to minimize business disruptions for rapid operation resumption."
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Advanced Real-Time Tracking",
      description: "Our advanced tracking system keeps businesses updated throughout the moving process with 24/7 customer care support."
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-12 px-4">
      {features.map((feature, index) => (
        <div key={index} className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-orange-500 mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BusinessFeatures;