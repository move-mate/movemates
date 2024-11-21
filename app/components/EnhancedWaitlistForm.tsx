import React, { useState } from 'react';
import CustomerFeatures from './features/CustomerFeatures';
import DriverFeatures from './features/DriverFeatures';
import BusinessFeatures from './features/BusinessFeatures';

interface EnhancedWaitlistFormProps {
  onClose: () => void;
}

const EnhancedWaitlistForm: React.FC<EnhancedWaitlistFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    social: '',
    type: 'customer',
    province: '',
    city: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://movemates.co.za';
      const response = await fetch(`${baseUrl}/api/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join waitlist');
      }
      
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full p-4 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Thank you for joining the waitlist!</h2>
          <p className="text-gray-700 mb-4">
            We have received your information. We`ll be in touch soon with the latest updates.
          </p>
          <button
            onClick={onClose}
            className="mt-4 bg-[#FE6912] text-white py-2 px-4 rounded-full hover:bg-[#FF8A47] transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full p-4 z-50">
      <div className="relative max-w-7xl mx-auto bg-white rounded-xl shadow-xl flex flex-col md:flex-row min-h-[80vh] mt-8">
        {/* Form Section */}
        <div className="w-full md:w-1/3 bg-[#081427] text-white p-8 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          <h2 className="text-3xl font-bold mb-8">Waiting List</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl mb-4">Personal Information</h3>
              <input
                type="text"
                name="name"
                placeholder="Name and Surname"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded bg-white text-black"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 rounded bg-white text-black"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-3 rounded bg-white text-black"
                  required
                />
              </div>
            </div>

            {/* Join as section */}
            <div>
              <h3 className="text-xl mb-4">Join as</h3>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="customer"
                    checked={formData.type === 'customer'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Customer
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="driver"
                    checked={formData.type === 'driver'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Driver
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="business"
                    checked={formData.type === 'business'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Business
                </label>
              </div>
            </div>

            {/* Where did you hear about us - Socials Section */}
            <div>
              <h3 className="text-xl mb-4">Where did you hear about us?</h3>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="social"
                    value="facebook"
                    checked={formData.social === 'facebook'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Facebook
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="social"
                    value="twitter"
                    checked={formData.social === 'twitter'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Twitter
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="social"
                    value="instagram"
                    checked={formData.social === 'instagram'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Instagram
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="social"
                    value="linkedin"
                    checked={formData.social === 'linkedin'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  LinkedIn
                </label>
              </div>
            </div>


            {/* Location Section */}
            <div className="space-y-4">
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full p-3 rounded bg-white text-black"
                required
              >
                <option value="">Select your province</option>
                <option value="gauteng">Gauteng</option>
                <option value="western-cape">Western Cape</option>
                <option value="kwazulu-natal">KwaZulu-Natal</option>
              </select>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 rounded bg-white text-black"
                placeholder="Enter your city"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FE6912] text-white py-3 rounded-full hover:bg-[#FF8A47] transition duration-300"
            >
              Join Waiting List
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>

        {/* Features Section */}
        <div className="w-full md:w-2/3 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-4">
              {formData.type === 'customer' 
                ? "Do you live in Gauteng, KwaZulu Natal or Western Cape and want to be among the first to access our services?"
                : formData.type === 'driver'
                ? "Are you a driver in Gauteng, Durban, or Cape Town looking to join our network of trusted movers?"
                : "Are you a business in Gauteng, Durban, or Cape Town looking for reliable moving solutions?"}
            </h2>
            <p className="text-xl text-center text-[#FE6912]">
              Join the Movemates Waiting List Today!
            </p>
          </div>
          
          <div className="overflow-x-auto">
            {formData.type === 'customer' ? (
              <CustomerFeatures />
            ) : formData.type === 'driver' ? (
              <DriverFeatures />
            ) : (
              <BusinessFeatures />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWaitlistForm;