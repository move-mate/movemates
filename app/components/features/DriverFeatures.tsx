import { Users, DollarSign, Clock, MapPin, Smartphone, Headphones } from 'lucide-react';

const DriverFeatures = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Access to the Moving Market",
      description: "MoveMates provides drivers with direct access to a large, growing market of customers in need of moving services."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Low Commission Fee",
      description: "We take a small fee from each successful move, ensuring that drivers can keep most of their earnings."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Work Hours",
      description: "Drivers can choose when to work, allowing them to manage their schedule according to personal preferences."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Local Jobs, Reduced Travel",
      description: "MoveMates connects drivers with customers in their local area, reducing unnecessary travel."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Easy-to-Use Platform",
      description: "The MoveMates app simplifies job booking, scheduling, and payment for efficient task management."
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock, ensuring drivers have the assistance they need."
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-8">
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

export default DriverFeatures;