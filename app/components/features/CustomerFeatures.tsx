import { Truck, DollarSign, Calendar, HandshakeIcon, Shield, Headphones } from 'lucide-react';

const CustomerFeatures = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Local Drivers, On-Demand",
      description: "We match you with drivers who are already in your area, ensuring faster, more responsive service."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Instant Quotes, No Surprises",
      description: "Get immediate, accurate pricing with MoveMates. Our transparent, real-time system ensures no delays or hidden fees."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Get a move instantly or plan ahead with flexible scheduling options to fit your timeline."
    },
    {
      icon: <HandshakeIcon className="w-8 h-8" />,
      title: "Trusted Partners",
      description: "Our vetted network of professional movers ensures reliable and quality service."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Insured",
      description: "Your belongings are protected with comprehensive insurance coverage."
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Our dedicated support team is always available to assist you."
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

export default CustomerFeatures;