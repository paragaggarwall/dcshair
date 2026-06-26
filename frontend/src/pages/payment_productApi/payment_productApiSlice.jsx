import { apiSlice } from '../../app/apiSlice/apiSlice'

export const Payment_ProductApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getalltermofpayment: builder.query({
            query: () => ({
                url: "/contracts/allterm-payment",
                method: "GET",
            }),
        }),

        createtermofpayment: builder.mutation({
            query: (body) => ({
                url: '/contracts/terms-of-payment/',
                method: 'POST',
                body,
            })
        }),

    })
})
export const {
    useLazyGetalltermofpaymentQuery,
    useCreatetermofpaymentMutation,
} = Payment_ProductApiSlice
