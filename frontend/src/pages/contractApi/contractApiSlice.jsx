import { apiSlice } from '../../app/apiSlice/apiSlice'

export const contractApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getAllContract: builder.mutation({
            query: () => ({
                url: '/contracts/list',
                method: 'GET',

            })
        }),

        contractPreview: builder.mutation({
            query: (id) => ({
                url: `/contracts/${id}/preview`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            })
        }),

        contractDownload: builder.mutation({
            query: (id) => ({
                url: `/contracts/${id}/pdf`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            })
        }),

        getcontractOptions: builder.mutation({
            query: () => ({
                url: 'contracts/options',
                method: 'GET',
            })
        }),

        createContract: builder.mutation({
            query: (body) => ({
                url: '/contracts/create',
                method: 'POST',
                body,
            })
        }),




    })
})
export const {
    useGetAllContractMutation,
    useContractPreviewMutation,
    useContractDownloadMutation,
    useGetcontractOptionsMutation,
    useCreateContractMutation,
} = contractApiSlice
