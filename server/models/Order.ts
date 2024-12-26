import mongoose, { Model, Schema } from "mongoose"

export interface IProduct {
    _id?: string
    name: string
    price: string
    desc: string
    image: string
}

interface IProducts {
    _id?: string
    productId: mongoose.Schema.Types.ObjectId | IProduct
    quantity: number
}

export interface IOrder {
    userId: mongoose.Schema.Types.ObjectId
    products: IProducts[]
    totalAmount: number
    shippingDetails: {
        fullName: string
        address: string
        city: string
        state: string
        zipCode: string
    }
    paymentMethod: string,
    status: string
    returnStatus: string
    returnReason: String
}

const orderSchema = new Schema<IOrder>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    shippingDetails: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Cash on Delivery"],
        default: "Cash on Delivery",
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Returned"],
        default: "Pending",
    },
    returnStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: null,
    },
    returnReason: { type: String, default: null }
}, { timestamps: true })

export const Order: Model<IOrder> = mongoose.model<IOrder>("order", orderSchema)