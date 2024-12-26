import express from "express"
import * as orderController from "../controllers/order.controller"

const ORDER_ROUTER = express.Router()

ORDER_ROUTER
    .get("/", orderController.getOrders)
    .post("/add-order", orderController.addOrder)
    .put("/cancel-order/:id", orderController.cancelOrder)
    .put("/return-order/:id", orderController.returnOrderRequest)
    .put("/update-status/:id", orderController.updateOrderStatus)

export default ORDER_ROUTER