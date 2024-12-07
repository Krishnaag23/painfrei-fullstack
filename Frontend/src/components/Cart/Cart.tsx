import { useCart } from "@/context/CartContext";
import Image from "next/image";

const Cart = () => {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  if (state.items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">Your cart is empty</div>
    );
  }

  return (
    <div className="p-4">
      {state.items.map((item) => (
        <div key={item.id} className="flex items-center border-b py-4">
          <Image
            src={item.image}
            alt={item.title}
            width={80}
            height={80}
            className="rounded-md"
          />
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium">{item.title}</h3>
            <p className="text-gray-500">${item.price}</p>
            <div className="mt-2 flex items-center">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="rounded-l-md bg-gray-200 px-3 py-1"
              >
                -
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="rounded-r-md bg-gray-200 px-3 py-1"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-4 text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-4 flex justify-between">
        <span className="text-lg font-medium">Total:</span>
        <span className="text-lg font-medium">${state.total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Cart;
