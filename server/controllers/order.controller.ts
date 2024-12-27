import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { Order } from "../models/Order"
import { MSG_PRODUCER } from "../utils/messageProducer"
import { MSG_CONSUMER } from "../utils/messageConsumer"
import { channel, PRODUCT_REQUEST, PRODUCT_RESPONSE } from "../services/rabbitMQ.service"
import { generateCorrelationId } from "../utils/correlationId"

export const getOrders = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { fetchAllOrders } = req.query

    let orders
    if (fetchAllOrders === "true") {
        orders = await Order.find().lean()
    } else {
        orders = await Order.find({ userId: req.body.userId }).lean()
    }

    if (!orders.length) {
        return res.status(200).json({ message: "No orders found", result: [] });
    }

    const productIds = orders.flatMap((item) => {
        const product = item.products.map((prod) => prod.productId)
        return product
    })

    const correlationId = generateCorrelationId()
    MSG_PRODUCER(channel, PRODUCT_REQUEST, { productIds }, correlationId)

    const products = await MSG_CONSUMER(channel, PRODUCT_RESPONSE, correlationId)

    const result = orders.map((item) => ({
        ...item,
        products: item.products.map((prod) => ({
            ...prod,
            productId: products.find(
                (prodDetail: any) => prodDetail._id === prod.productId.toString()
            )
        })),
    }));

    res.status(200).json({ message: "Orders Fetch Successfully", result })
})

export const addOrder = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    await Order.create(req.body)
    res.status(200).json({ message: "Order Placed Successfully" })
})

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    const { status, returnStatus } = req.body
    console.log(req.body, "body=======================================");


    const order = await Order.findById(id)

    if (!order) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    await Order.findByIdAndUpdate(id, { status, returnStatus })
    res.status(200).json({ message: "Order Status Update Successfully" })
})

export const cancelOrder = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    await Order.findByIdAndUpdate(id, { status: "Cancelled" })
    res.status(200).json({ message: "Order Cancel Successfully" })
})

export const returnOrderRequest = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    await Order.findByIdAndUpdate(id, { returnStatus: "Pending", returnReason: req.body.returnReason })
    res.status(200).json({ message: "Order Return Requested Successfully" })
})