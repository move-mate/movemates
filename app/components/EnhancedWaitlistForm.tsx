import React, { useState } from 'react';
import CustomerFeatures from './features/CustomerFeatures';
import DriverFeatures from './features/DriverFeatures';
import BusinessFeatures from './features/BusinessFeatures';

interface EnhancedWaitlistFormProps {
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  social: string;
  type: 'customer' | 'driver' | 'business';
  province: string;
  city: string;
}

const EnhancedWaitlistForm: React.FC<EnhancedWaitlistFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    social: '',
    type: 'customer',
    province: '',
    city: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'Please enter both name and surname';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation - basic South African format
    const phoneRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid South African phone number';
    }

    // Social validation
    if (!formData.social) {
      newErrors.social = 'Please select where you heard about us';
    }

    // Province validation
    if (!formData.province) {
      newErrors.province = 'Please select your province';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field being changed
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://movemates.co.za';
      const response = await fetch(`${baseUrl}/api/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }
      
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const renderFieldError = (fieldName: keyof FormData) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
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
                className={`w-full p-3 rounded bg-white text-black ${
                  errors.name ? 'border-2 border-red-500' : ''
                }`}
              />
              {renderFieldError('name')}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 rounded bg-white text-black ${
                      errors.email ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {renderFieldError('email')}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (e.g., 0721234567)"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 rounded bg-white text-black ${
                      errors.phone ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {renderFieldError('phone')}
                </div>
              </div>
            </div>

            {/* Join as section */}
            <div>
              <h3 className="text-xl mb-4">Join as</h3>
              <div className="flex flex-wrap gap-4">
                {['customer', 'driver', 'business'].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Where did you hear about us - Socials Section */}
            <div>
              <h3 className="text-xl mb-4">Where did you hear about us?</h3>
              <div className="flex flex-wrap gap-2">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
                  <label key={platform} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="social"
                      value={platform}
                      checked={formData.social === platform}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </label>
                ))}
              </div>
              {renderFieldError('social')}
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <div>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={`w-full p-3 rounded bg-white text-black ${
                    errors.province ? 'border-2 border-red-500' : ''
                  }`}
                >
                  <option value="">Select your province</option>
                  <option value="gauteng">Gauteng</option>
                  <option value="western-cape">Western Cape</option>
                  <option value="kwazulu-natal">KwaZulu-Natal</option>
                </select>
                {renderFieldError('province')}
              </div>

              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-3 rounded bg-white text-black ${
                    errors.city ? 'border-2 border-red-500' : ''
                  }`}
                  placeholder="Enter your city"
                />
                {renderFieldError('city')}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FE6912] text-white py-3 rounded-full hover:bg-[#FF8A47] transition duration-300"
            >
              Join Waiting List
            </button>
            {submitError && (
              <p className="text-red-500 mt-2 text-center">{submitError}</p>
            )}
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