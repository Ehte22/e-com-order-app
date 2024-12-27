import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IOrder } from "../../models/order.interface"

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: `${process.env.BASE_URL}/api/v1/order`, credentials: "include", prepareHeaders(headers, { getState }) {
        baseUrl: `https://e-com-order-app-server.vercel.app/api/v1/order`, credentials: "include", prepareHeaders(headers, { getState }) {
            const state = getState() as any
            const token = state.auth.user?.token
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ["order"],
    endpoints: (builder) => {
        return {
            getOrders: builder.query<IOrder[], { fetchAllOrders: boolean }>({
                query: (queryParams) => {
                    return {
                        url: "/",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { message: string, result: IOrder[] }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["order"]
            }),

            addOrder: builder.mutation<string, string>({
                query: cartItemData => {
                    return {
                        url: "/add-order",
                        method: "POST",
                        body: cartItemData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["order"]
            }),

            updateOrderStatus: builder.mutation<string, { id: string, statusData: { status: string, returnStatus: string } }>({
                query: ({ id, statusData }) => {
                    return {
                        url: `/update-status/${id}`,
                        method: "PUT",
                        body: statusData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["order"]
            }),

            cancelOrder: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/cancel-order/${id}`,
                        method: "PUT",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["order"]
            }),

            returnOrderRequested: builder.mutation<string, { id: string, returnReason: string }>({
                query: ({ id, returnReason }) => {
                    return {
                        url: `/return-order/${id}`,
                        method: "PUT",
                        body: { returnReason }
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["order"]
            }),
        }
    }
})

export const {
    useGetOrdersQuery,
    useAddOrderMutation,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation,
    useReturnOrderRequestedMutation
} = orderApi
