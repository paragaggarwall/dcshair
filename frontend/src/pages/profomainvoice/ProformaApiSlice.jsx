import { apiSlice } from '../../app/apiSlice/apiSlice'

export const ProformaApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getallcontract: builder.query({
            query: () => ({
                url: `/proformainvoice/allcontract`,
                method: 'GET'
            })
        }),
        getproformainvoiceparties: builder.mutation({
            query: (contractId) => ({
                url: `/proformainvoice/${contractId}/parties`,
                method: 'GET',
            })
        }),

        proformainvoicecreate: builder.mutation({
            query: ({ body }) => ({
                url: `/proformainvoice/pdfgenerate`,
                method: 'POST',
                body,
            })
        }),

        getMyProformaInvoices: builder.query({
            query: () => ({
                url: '/proformainvoice/getMyProformaInvoices',
                method:'GET',
            })
        }),

    })
})
export const {
    useGetallcontractQuery,
    useGetproformainvoicepartiesMutation,
    useProformainvoicecreateMutation,
    useGetMyProformaInvoicesQuery,
} = ProformaApiSlice
