import React, { useState } from 'react';
import { useForm, setError, clearErrors } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faImage, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const SignupForm = () => {
  const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm();
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signaturePhotoPreview, setSignaturePhotoPreview] = useState(null);

  const onSubmit = async (data) => {
    if (await validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('contact_no', data.contact_no);
        formData.append('alternate_contact_no', data.alternate_contact_no);
        formData.append('photo', data.photo[0]);
        formData.append('signature_photo', data.signature_photo[0]);

        try {
          await axios.post('http://127.0.0.1:8000/api/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setStep(4);
        } catch (error) {
          if (error.response && error.response.data.errors) {
            // Clear previous errors
            clearErrors();

            // Set new errors
            for (const [field, messages] of Object.entries(error.response.data.errors)) {
              messages.forEach(message => {
                setError(field, { type: 'manual', message });
              });
            }
          } else {
            console.error(error);
            alert('Registration failed');
          }
        }
      }
    }
  };

  const onPrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSignaturePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignaturePhotoPreview(URL.createObjectURL(file));
    }
  };

  const validateStep = async () => {
    let isValid = true;

    if (step === 1) {
      const { email, username, password, password_confirmation } = watch();
      if (!email || !username || !password || !password_confirmation) {
        isValid = false;
      }
    }

    // Add additional validation logic for other steps if needed

    return isValid;
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4 text-purple-700">SIGN UP YOUR USER ACCOUNT</h1>
      <p className="text-center text-gray-500 mb-6">Fill all form fields to go to the next step</p>
      
      {/* Step indicators */}
      <div className="relative mb-6">
        <div 
          className="absolute inset-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-300" 
          style={{ left: '12.5%', right: '12.5%' }}
        />
        <div 
          className="absolute inset-0 top-1/2 transform -translate-y-1/2 h-1 bg-purple-600 transition-all duration-500" 
          style={{ left: '12.5%', right: `${(4 - step) * 25}%` }}
        />
        <div className="flex justify-between relative z-10">
          <div className="flex flex-col items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 1 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-purple-600'}`}>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <span className="mt-2 text-sm font-medium text-purple-600">Account</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 2 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-purple-600'}`}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span className="mt-2 text-sm font-medium text-purple-600">Personal</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 3 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-purple-600'}`}>
              <FontAwesomeIcon icon={faImage} />
            </div>
            <span className="mt-2 text-sm font-medium text-purple-600">Image</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 4 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-purple-600'}`}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <span className="mt-2 text-sm font-medium text-purple-600">Finish</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-purple-100 rounded-full overflow-hidden mb-4">
        <div 
          className="absolute inset-0 bg-purple-600 transition-all duration-500" 
          style={{ width: `${(step - 1) * 33.33}%` }}
        >
          <div className="h-full w-full bg-gradient-to-r from-purple-500 to-purple-600" />
        </div>
      </div>

      <p className="text-purple-600 text-right mb-6">Step {step} - 4</p>

      {/* Form fields */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Account Information:</h2>

            {/* Email Field */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email:</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}

            {/* Username Field */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="username">Username:</label>
            <input
              {...register('username', { required: 'Username is required', minLength: 3 })}
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}

            {/* Password Field */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">Password:</label>
            <input
              {...register('password', { required: 'Password is required', minLength: 6 })}
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

            {/* Confirm Password Field */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password_confirmation">Confirm Password:</label>
            <input
              {...register('password_confirmation', { required: 'Confirm your password', validate: value => value === watch('password') || 'Passwords do not match' })}
              type="password"
              id="password_confirmation"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            />
            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information:</h2>

            {/* First Name Field */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="first_name">First Name:</label>
            <input
              {...register('first_name', { required: 'First Name is required' })}
              type="text"
              id="first_name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            />
            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}

            {/* Last Name Field */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="last_name">Last Name:</label>
            <input
              {...register('last_name', { required: 'Last Name is required' })}
              type="text"
              id="last_name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            />
            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}

            {/* Contact Number Field */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="contact_no">Contact Number:</label>
            <input
              {...register('contact_no', { required: 'Contact Number is required' })}
              type="text"
              id="contact_no"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            />
            {errors.contact_no && <p className="text-red-500 text-xs mt-1">{errors.contact_no.message}</p>}

            {/* Alternate Contact Number Field */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="alternate_contact_no">Alternate Contact Number:</label>
            <input
              {...register('alternate_contact_no')}
              type="text"
              id="alternate_contact_no"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            />
            {errors.alternate_contact_no && <p className="text-red-500 text-xs mt-1">{errors.alternate_contact_no.message}</p>}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Upload Images:</h2>

            {/* Photo Upload */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="photo">Profile Photo:</label>
            <input
              {...register('photo', { required: 'Profile photo is required' })}
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mb-4"
            />
            {photoPreview && <img src={photoPreview} alt="Profile Preview" className="w-32 h-32 object-cover mb-4" />}
            {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo.message}</p>}

            {/* Signature Photo Upload */}
            <label className="block text-gray-700 font-medium mb-2" htmlFor="signature_photo">Signature Photo:</label>
            <input
              {...register('signature_photo', { required: 'Signature photo is required' })}
              type="file"
              id="signature_photo"
              accept="image/*"
              onChange={handleSignaturePhotoChange}
              className="mb-4"
            />
            {signaturePhotoPreview && <img src={signaturePhotoPreview} alt="Signature Preview" className="w-32 h-32 object-cover mb-4" />}
            {errors.signature_photo && <p className="text-red-500 text-xs mt-1">{errors.signature_photo.message}</p>}
          </div>
        )}

        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={onPrevious}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            {step === 4 ? 'Finish' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
