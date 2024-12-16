'use client';

import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';


export default function CheckoutForm() {
  const router = useRouter();
  const { user} = useAuth();
  
  

  const [formData, setFormData] = useState({
    name: "",
    email: "" ,
    address: '',
    city: '',
    phone: 0,
    state: '',
    shippingMethod: 'standard',
    
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        address: user.addresses[0].address,
        city: user.addresses[0].city,
        phone: parseInt(user.addresses[0].phone),
        state: formData.state,
        shippingMethod: 'standard'
        })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleShippingMethodChange = (value: string) => {
    setFormData({ ...formData, shippingMethod: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Order placed:', formData);
    router.push('/order-confirmation');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg border shadow-md bg-white max-w-xl mx-auto dark:bg-black">
      <h1 className="text-xl font-semibold">Checkout Form</h1>

      {/* Full Name */}
      <FormField
        label="Full Name"
        id="name"
        name="name"
        
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* Email */}
      <FormField
        label="Email"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      {/* Phone Number */}
      <FormField
        label="Phone Number"
        id="phone"
        name="phone"
        type="number"
        value={formData.phone}
        onChange={handleChange}
        required
        />

      {/* Address */}
      <FormField
        label="Address"
        id="address"
        name="address"
        type="text"
        value={formData.address}
        onChange={handleChange}
        required
      />

      {/* City & Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="City"
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <FormField
          label="State"
          id="State"
          name="State"
          type="text"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </div>

      

      {/* Shipping Method */}
      <div>
        <p className="font-medium">Shipping Method</p>
        <div className="flex flex-col space-y-2 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shippingMethod"
              value="standard"
              checked={formData.shippingMethod === 'standard'}
              onChange={() => handleShippingMethodChange('standard')}
              className="form-radio"
            />
            <span>Standard Shipping ($5.99)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shippingMethod"
              value="express"
              checked={formData.shippingMethod === 'express'}
              onChange={() => handleShippingMethodChange('express')}
              className="form-radio"
            />
            <span>Express Shipping ($14.99)</span>
          </label>
        </div>
      </div>

     
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Place Order
      </button>
    </form>
  );
}

// Reusable FormField Component
interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

function FormField({
  label,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:border-white "
      />
    </div>
  );
}
 