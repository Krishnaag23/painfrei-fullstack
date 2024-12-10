
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddressesPage() {
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [newAddress, setNewAddress] = useState({
    city: '',
    street: '',
    phone: '',
  });

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + 'address', {headers: { token: ` ${localStorage.getItem('token')}` }})
     .then((response) => {
        setAddresses(response.data.getAllAddresses);
        // console.log("Response:", response);
        // console.log("response.getAllAddresses:", response.getAllAddresses);
        // console.log("response data", response.data);
      })
     .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleAddAddress = (e) => {
    e.preventDefault();
    axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL + 'address', newAddress, {headers: { token: ` ${localStorage.getItem('token')}` }})
     .then(() => {
        setNewAddress({
          city: '',
          street: '',
          phone: '',
        });
      })
     .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="container mx-auto p-4 pt-36 ">
      <h1 className="text-3xl font-bold mb-4">Addresses</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowForm(true)}>Add New Address</button>
      </div>
      {showForm && (
        <form onSubmit={handleAddAddress}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City:</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">Street:</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="street" type="text" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone:</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value })} />
          </div>
          <div className="mb-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Add Address</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {addresses.length ?<>{addresses.map((address) => (
          <div key={address._id} className="bg-white rounded shadow-md p-4">
            <h2 className="text-lg font-bold mb-2">{address.city}</h2>
            <p className="text-gray-600 mb-2">{address.street}</p>
            <p className="text-gray-600 mb-2">{address.phone}</p>
          </div>
        ))}</> : <p>No addresses found</p>}
      </div>
    </div>
  );
}
