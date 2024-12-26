import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const OrderSuccess = () => {
    const navigate = useNavigate();

    const handleGoToOrders = () => {
        navigate('/order'); // Redirect to the orders page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            {/* Card Container */}
            <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-lg text-center">
                {/* Success Icon */}
                <div className="w-16 h-16 flex items-center justify-center mx-auto text-teal-700 rounded-full mb-6">
                    <AiOutlineCheckCircle size={40} />
                </div>

                {/* Success Message */}
                <h1 className="text-2xl font-bold text-teal-700 mb-4">Order Successful!</h1>
                <p className="text-gray-600 text-sm mb-6">
                    Your order has been placed successfully. You can track your order details on the orders page.
                </p>

                {/* Go to Orders Button */}
                <button
                    onClick={handleGoToOrders}
                    className="w-full py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition duration-300"
                >
                    Go to Orders
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;
