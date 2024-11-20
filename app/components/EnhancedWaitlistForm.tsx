// import React, { useState } from 'react';
// import CustomerFeatures from './features/CustomerFeatures';
// import DriverFeatures from './features/DriverFeatures';
// import BusinessFeatures from './features/BusinessFeatures';

// interface EnhancedWaitlistFormProps {
//   onClose: () => void;
// }

// const EnhancedWaitlistForm: React.FC<EnhancedWaitlistFormProps> = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     type: 'customer',
//     province: '',
//     city: '',
//     verificationCode: '',
//   });
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState('');
//   const [step, setStep] = useState(1); // Step for controlling form parts
//   const [verificationCodeSent, setVerificationCodeSent] = useState(false);
//   const [alreadyRegistered, setAlreadyRegistered] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const validateEmailOrPhone = () => {
//     // Check if either email or phone is provided
//     return formData.email || formData.phone;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setAlreadyRegistered(false);

//     if (!validateEmailOrPhone()) {
//       setError('Please provide at least one valid contact method (email or phone).');
//       return;
//     }

//     if (step === 1) {
//       // Step 1: Submit basic info and send verification code
//       try {
//         const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://movemates.co.za';
//       const response = await fetch(`${baseUrl}/api/sendVerificationCode`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email: formData.email, phone: formData.phone }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           console.log(errorData);
//           if (errorData.error === 'User already exists.') {
//             setAlreadyRegistered(true);
//             return;
//           }
//           throw new Error(errorData.error || 'Failed to send verification code');
//         }

//         setVerificationCodeSent(true);
//         setStep(2); // Move to the next step
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       }
//     } else if (step === 2) {
//       // Step 2: Verify the code
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verifyCode`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           // body: JSON.stringify({ verificationCode: formData.verificationCode }),
//           body: JSON.stringify({
//             verificationCode: formData.verificationCode,
//             name: formData.name,
//             email: formData.email,
//             phone: formData.phone,
//             type: formData.type,
//             province: formData.province,
//             city: formData.city,
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Invalid verification code');
//         }

//         setSubmitted(true);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       }
//     }
//   };

//   if (alreadyRegistered) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full p-4 z-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
//           <h2 className="text-2xl font-bold mb-4">You are already registered!</h2>
//           <p className="text-gray-700 mb-4">
//             It seems like you’ve already joined the waitlist. Please check your email or phone for updates.
//           </p>
//           <button
//             onClick={onClose}
//             className="mt-4 bg-[#FE6912] text-white py-2 px-4 rounded-full hover:bg-[#FF8A47] transition duration-300"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (submitted) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full p-4 z-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
//           <h2 className="text-2xl font-bold mb-4">Thank you for joining the waitlist!</h2>
//           <p className="text-gray-700 mb-4">
//             We have received your information. We`ll be in touch soon with the latest updates.
//           </p>
//           <button
//             onClick={onClose}
//             className="mt-4 bg-[#FE6912] text-white py-2 px-4 rounded-full hover:bg-[#FF8A47] transition duration-300"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full p-4 z-50">
//       <div className="relative max-w-7xl mx-auto bg-white rounded-xl shadow-xl flex flex-col md:flex-row min-h-[80vh] mt-8">
//         {/* Form Section */}
//         <div className="w-full md:w-1/3 bg-[#081427] text-white p-8 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
//           <h2 className="text-3xl font-bold mb-8">Waiting List</h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <h3 className="text-xl mb-4">Personal Information</h3>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name and Surname"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded bg-white text-black"
//                 required
//               />
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="p-3 rounded bg-white text-black"
//                   required
//                 />
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="Phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="p-3 rounded bg-white text-black"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <h3 className="text-xl mb-4">Join as</h3>
//               <div className="flex flex-wrap gap-4">
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="type"
//                     value="customer"
//                     checked={formData.type === 'customer'}
//                     onChange={handleChange}
//                     className="mr-2"
//                   />
//                   Customer
//                 </label>
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="type"
//                     value="driver"
//                     checked={formData.type === 'driver'}
//                     onChange={handleChange}
//                     className="mr-2"
//                   />
//                   Driver
//                 </label>
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="type"
//                     value="business"
//                     checked={formData.type === 'business'}
//                     onChange={handleChange}
//                     className="mr-2"
//                   />
//                   Business
//                 </label>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <select
//                 name="province"
//                 value={formData.province}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded bg-white text-black"
//                 required
//               >
//                 <option value="">Select your province</option>
//                 <option value="gauteng">Gauteng</option>
//                 <option value="western-cape">Western Cape</option>
//                 <option value="kwazulu-natal">KwaZulu-Natal</option>
//               </select>

//               <select
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded bg-white text-black"
//                 required
//               >
//                 <option value="">Select your city</option>
//                 <option value="johannesburg">Johannesburg</option>
//                 <option value="cape-town">Cape Town</option>
//                 <option value="durban">Durban</option>
//               </select>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-[#FE6912] text-white py-3 rounded-full hover:bg-[#FF8A47] transition duration-300"
//             >
//               {step === 1 ? 'Send Verification Code' : 'Verify Code'}
//             </button>

//             {error && <p className="text-red-500 mt-2">{error}</p>}
//           </form>

//           {verificationCodeSent && step === 2 && (
//             <div className="mt-6">
//               <input
//                 type="text"
//                 name="verificationCode"
//                 placeholder="Enter Verification Code"
//                 value={formData.verificationCode}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded bg-white text-black"
//                 maxLength={6}
//                 required
//               />
//             </div>
//           )}
//         </div>

//         {/* Features Section */}
//         <div className="w-full md:w-2/3 p-8">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//           >
//             ×
//           </button>
//           {formData.type === 'customer' && <CustomerFeatures />}
//           {formData.type === 'driver' && <DriverFeatures />}
//           {formData.type === 'business' && <BusinessFeatures />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnhancedWaitlistForm;




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
    type: 'customer',
    province: '',
    city: '',
    verificationCode: '',
    preferredContact: 'email', // Default preference for receiving the code
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Step for controlling form parts
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmailOrPhone = () => {
    return formData.email || formData.phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAlreadyRegistered(false);

    if (!validateEmailOrPhone()) {
      setError('Please provide at least one valid contact method (email or phone).');
      return;
    }

    if (step === 1) {
      // Step 1: Submit basic info and send verification code
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://movemates.co.za';
        const response = await fetch(`${baseUrl}/api/sendVerificationCode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            phone: formData.phone,
            preferredContact: formData.preferredContact,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === 'User already exists.') {
            setAlreadyRegistered(true);
            return;
          }
          throw new Error(errorData.error || 'Failed to send verification code');
        }

        setVerificationCodeSent(true);
        setStep(2); // Move to the next step
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } else if (step === 2) {
      // Step 2: Verify the code
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verifyCode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            verificationCode: formData.verificationCode,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            type: formData.type,
            province: formData.province,
            city: formData.city,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Invalid verification code');
        }

        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  if (alreadyRegistered) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full p-4 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">You are already registered!</h2>
          <p className="text-gray-700 mb-4">
            It seems like you’ve already joined the waitlist. Please check your email or phone for updates.
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

              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 rounded bg-white text-black"
                required
              >
                <option value="">Select your city</option>
                <option value="johannesburg">Johannesburg</option>
                <option value="cape-town">Cape Town</option>
                <option value="durban">Durban</option>
              </select>
            </div>

            {/* Preferred Contact Selector */}
            <div>
              <label className="block">Preferred method for receiving verification code:</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Email
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Phone
                </label>
              </div>
            </div>



            {/* Submit Section */}
            {!verificationCodeSent ? (
              <button
                type="submit"
                className="w-full bg-[#FE6912] text-white py-3 rounded-full hover:bg-[#FF8A47] transition duration-300"
              >
                Send Verification Code
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="Enter verification code"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-white text-black"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#FE6912] text-white py-3 rounded-full hover:bg-[#FF8A47] transition duration-300"
                >
                  Verify Code
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            )}
          </form>
        </div>

        {/* Features Section */}
        <div className="w-full md:w-2/3 bg-[#F8F8F8] p-8 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="space-y-8">
            {formData.type === 'customer' && <CustomerFeatures />}
            {formData.type === 'driver' && <DriverFeatures />}
            {formData.type === 'business' && <BusinessFeatures />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWaitlistForm;
