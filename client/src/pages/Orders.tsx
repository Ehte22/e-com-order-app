import React, { useEffect, useState } from 'react'
import { useCancelOrderMutation, useGetOrdersQuery, useReturnOrderRequestedMutation } from '../redux/apis/order.api'
import { toast } from '../services/toast'

const Orders = () => {
    const { data } = useGetOrdersQuery({ fetchAllOrders: false })
    const [cancelOrder, { data: cancelOrderMessage, isSuccess }] = useCancelOrderMutation()
    const [returnOrder, { data: returnMessage, isSuccess: isReturnRequestSuccess }] = useReturnOrderRequestedMutation()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [returnReason, setReturnReason] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>()
    const [selectedOrderId, setSelectedProductId] = useState<string>()


    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCancelOrder = (id: string) => {
        cancelOrder(id)
    }

    const handleReturnOrder = () => {
        if (selectedOrderId && returnReason?.length >= 5) {
            const returnOrderData = { id: selectedOrderId, returnReason }
            returnOrder(returnOrderData)

            setErrorMessage("")
            setIsModalOpen(false)
        } else {
            setErrorMessage("Please enter return order reason.")
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.showSuccess(cancelOrderMessage)
        }
        if (isReturnRequestSuccess) {
            toast.showSuccess(returnMessage)
        }
    }, [isSuccess, cancelOrderMessage, isReturnRequestSuccess, returnMessage])

    return <>
        <div className='min-h-screen md:px-12 lg:px-20'>
            <div className=" p-4 mx-auto py-10">
                <h3 className="text-3xl font-bold mb-8">My Orders</h3>
                <div className="overflow-x-auto">
                    {
                        data?.length === 0

                            ? <div className='text-center text-xl'>No Order Found</div>
                            : <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.slice().reverse().map((order) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                {order.products.map((item) => <div key={item._id} className='my-2'>
                                                    <img
                                                        src={item.productId?.image as string}
                                                        alt={item.productId?.name}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                </div>)}
                                            </td>
                                            <td>
                                                {order.products.map((item) => <div key={item._id} className='my-2'>
                                                    <div className="px-6 py-4 text-sm text-gray-700">${item.productId?.price}</div>
                                                </div>)}
                                            </td>
                                            <td>
                                                {order.products.map((item) => <div key={item._id} className='my-2'>
                                                    <div className="px-6 py-4 text-sm text-gray-700">{item.quantity}</div>
                                                </div>)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-md text-sm font-medium text-white 
                                                      ${order.status === "Pending"
                                                            ? "bg-yellow-500"
                                                            : order.status === "Shipped"
                                                                ? "bg-blue-600"
                                                                : order.status === "Delivered"
                                                                    ? "bg-teal-600"
                                                                    : order.status === "Cancelled"
                                                                        ? "bg-red-600"
                                                                        : "bg-slate-700"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {
                                                    order.returnStatus === "Pending" ? (
                                                        <span className="text-sm text-yellow-600">Return in Progress</span>
                                                    ) : order.status === "Pending" ? (
                                                        <button
                                                            className="text-sm text-red-500 hover:text-red-700"
                                                            onClick={() => handleCancelOrder(order._id as string)}
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    ) : order.status === 'Delivered' ? (
                                                        <button
                                                            className='text-sm text-blue-500 hover:text-blue-700'
                                                            onClick={() => {
                                                                setIsModalOpen(true)
                                                                setSelectedProductId(order._id)
                                                            }}
                                                        >
                                                            Return Order
                                                        </button>
                                                    ) : (
                                                        <span className='text-sm text-gray-500'>No Action Available</span>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </div >

        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                <div className="bg-white rounded-lg sm:w-1/2 lg:w-1/3 p-6">
                    <h2 className="text-xl font-bold mb-4">Return Order Request</h2>
                    <form >

                        <div className="mb-4">
                            <label className="block text-gray-700">Reason:</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                placeholder='Type here'
                                onChange={(e) => setReturnReason(e.target.value)}
                                rows={4}
                            />
                            <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleReturnOrder}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

    </>
}

export default Orders