import { configureStore } from "@reduxjs/toolkit";
import { orderApi } from "./apis/order.api";

const reduxStore = configureStore({
    reducer: {
        [orderApi.reducerPath]: orderApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(orderApi.middleware)
})

export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore