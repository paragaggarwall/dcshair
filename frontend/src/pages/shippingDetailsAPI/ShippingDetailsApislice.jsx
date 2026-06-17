import { apiSlice } from '../../app/apiSlice/apiSlice'

export const shippingApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getInvoices: builder.query({
            query: () => "/invoice/getMyInvoices",
            keepUnusedDataFor: 0,
        }),
        getInvoiceById: builder.query({
            query: (id) => `/invoice/${id}`,
            skip: (id) => !id,
            keepUnusedDataFor: 0,
        }),
        createShippingDetails: builder.mutation({
            query: (body) => ({
                url: "/invoice/shipping-details",
                method: "POST",
                body,
            }),
        }),
        createShippingTracking: builder.mutation({
            query: (body) => ({
                url: "/invoice/shipping-tracking",
                method: "POST",
                body,
            }),
        }),
        createCustomSale: builder.mutation({
            query: (body) => ({
                url: "/invoice/customSaleDetails",
                method: "POST",
                body,
            })
        }),
        createBankSale: builder.mutation({
            query: (body) => ({
                url: '/invoice/bankSaleDetails',
                method: "POST",
                body,
            })
        }),
        updateAllInvoiceDetail: builder.mutation({
            query: ({ id, body }) => ({
                url: `/invoice/updateInvoice/${id}`,
                method: "POST",
                body,
            }),
        }),

    })
})

export const {
    useGetInvoicesQuery,
    useGetInvoiceByIdQuery,
    useCreateShippingDetailsMutation,
    useCreateShippingTrackingMutation,
    useCreateCustomSaleMutation,
    useCreateBankSaleMutation,
    useUpdateAllInvoiceDetailMutation,
} = shippingApiSlice
