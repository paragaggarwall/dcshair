import { apiSlice } from '../../app/apiSlice/apiSlice'

export const ProformaApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getallcontract: builder.query({
            query: () => ({
                url: `/contracts/list`,
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
                url: `/proformainvoice/create`,
                method: 'POST',
                body,
            })
        }),

        getMyProformaInvoices: builder.query({
            query: () => ({
                url: '/proformainvoice',
                method: 'GET',
            })
        }),

        proformaDownload: builder.mutation({
            query: (id) => ({
                url: `/proformainvoice/${id}/pdf`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            })
        }),

        proformaPreview: builder.mutation({
            query: (id) => ({
                url: `/proformainvoice/${id}/preview`,
                method: 'GET',
                // responseHandler: (response) => response.blob(),
                responseHandler: async (response) => {
                    if (!response.ok) {
                        const error = await response.json();
                        throw error;
                    }
                    return response.blob();
                },
            })
        }),

    })
})
export const {
    useGetallcontractQuery,
    useGetproformainvoicepartiesMutation,
    useProformainvoicecreateMutation,
    useGetMyProformaInvoicesQuery,
    useProformaDownloadMutation,
    useProformaPreviewMutation,
} = ProformaApiSlice
