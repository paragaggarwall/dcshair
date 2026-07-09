import { apiSlice } from '../../app/apiSlice/apiSlice'

export const ProductApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        createProduct: builder.mutation({
            query: (body) => ({
                url: `/products/create`,
                method: 'POST',
                body,
            })
        }),

        getProduct: builder.mutation({
            query: () => ({
                url: `/products/get`,
                method: 'POST'
            })
        }),

        getProductById: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'GET',
            })
        }),

        updateProduct: builder.mutation({
            query: ({ id, body }) => ({
                url: `/products/update/${id}`,
                method: 'POST',
                body,
            })
        }),

        createsizeColor: builder.mutation({
            query: (body) => ({
                url: `/products/createsizecolor`,
                method: 'POST',
                body,
            })
        }),

        getAllColorSize: builder.mutation({
            query: () => ({
                url: `/products/getAllColorSize`,
                method: 'GET',
            })
        }),



    })
})
export const {
    useCreateProductMutation,
    useGetProductMutation,
    useGetProductByIdMutation,
    useUpdateProductMutation,
    useCreatesizeColorMutation,
    useGetAllColorSizeMutation,
} = ProductApiSlice
