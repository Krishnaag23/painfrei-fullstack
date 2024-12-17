'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function OrderSummary() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [coupon, setCoupon] = useState<string>('')
  const [discount, setDiscount] = useState<number>(0)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}carts/`,
          { headers: { token: `${localStorage.getItem('token')}` } }
        )
        setCart(response.data.data)
      } catch (err) {
        setError('Failed to load cart items.')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const handleApplyCoupon = async () => {
    try {
    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}carts/apply-coupon`,
    //     { code: coupon },
    //     { headers: { token: `${localStorage.getItem('token')}` } }
    //   )
    //   setDiscount(response.data.discount)
    setError('Coupon code is not valid.')
    } catch (err) {
      setError('Failed to apply coupon. Contact Developer!')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  

  if (!cart || cart.cartItem.length === 0) {
    return <div>Your cart is empty!</div>
  }

  const subtotal = cart.cartItem.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  const shipping = 500 // Set as fixed for now
  const total = subtotal - (subtotal * discount) / 100 + shipping

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md dark:bg-black">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      {cart.cartItem.map((item: any, index: number) => (
        <div key={index} className="flex justify-between mb-2">
          <span>
            {item.productId.title} x {item.quantity}
          </span>
          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="border-t border-gray-200 my-4"></div>
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span>₹{shipping.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between mb-2 text-green-600">
          <span>Discount</span>
          <span>-{discount}%</span>
        </div>
      )}
      <div className="flex justify-between font-semibold mb-4">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
      <div className="mb-4">
        <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
          Coupon Code
        </label>
        <div className="flex">
          <input
            id="coupon"
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon"
            className="border border-gray-300 rounded-md p-2 flex-1"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="ml-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            Apply
          </button>
          
        </div>
        {error ? <div className="text-red-500 pt-4">{error}</div> : ""}
      </div>
    </div>
  )
}
