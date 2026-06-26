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


    invoicecreate: builder.mutation({
      query: ({ body }) => ({
        url: `/invoice/create`,
        method: 'POST',
        body,
      })
    }),

    getMyInvoices: builder.query({
      query: () => ({
        url: `/invoice/getAllInvoices`,
        method: 'GET'
      })
    }),

    invoicePdfGenerate: builder.mutation({
      query: (id) => ({
        url: `/invoice/${id}/pdf`,
        method: 'POST',
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error('Failed to download PDF API ERROR');
          }
          return response.blob();
        },
      })
    }),


  })
})
export const {
  useGetprofomainvoiceMutation,
  useGetprofomapartyMutation,
  useInvoicecreateMutation,
  useGetMyInvoicesQuery,
  useInvoicePdfGenerateMutation,


} = invoiceApiSlice
