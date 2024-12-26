interface Product {
    _id?: string
    name: string
    price: string
    desc: string
    image: string
}
interface IProducts {
    _id?: string
    productId: Product,
    quantity: number
}

export interface IOrder {
    _id?: string
    userId?: string
    products: IProducts[]
    totalAmount: number
    shippingDetails: {
        fullName: string
        address: string
        city: string
        state: string
        zipCode: string
    }
    paymentMethod?: string,
    status?: string
    returnStatus?: string
    returnReason?: string
}
