import { apiSlice } from '../../app/apiSlice/apiSlice'

export const invoiceApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getprofomainvoice: builder.mutation({
      query: () => ({
        url: `/proformainvoice`,
        method: 'GET',
      })
    }),
    getprofomaparty: builder.mutation({
      query: (proformaid) => ({
        url: `/proformainvoice/party/${proformaid}`,
        method: 'GET',
      })
    }),

    getalltermofpayment: builder.query({
      query: () => ({
        url: "/contracts/allterm-payment",
        method: "GET",
      }),
    }),

    invoicecreate: builder.mutation({
      query: ({ body }) => ({
        url: `/invoice/create`,
        method: 'POST',
        body,
      })
    }),

    getMyInvoices: builder.query({
      query: () => ({
        url: `/invoice/getMyInvoices`,
        method: 'GET'
      })
    }),



  })
})
export const {
  useGetprofomainvoiceMutation,
  useGetprofomapartyMutation,
  useLazyGetalltermofpaymentQuery,
  useInvoicecreateMutation,
  useGetMyInvoicesQuery,


} = invoiceApiSlice
