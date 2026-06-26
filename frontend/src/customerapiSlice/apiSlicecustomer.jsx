import { apiSlice } from '../app/apiSlice/apiSlice'

export const customerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyCustomer: builder.mutation({
      query: () => ({
        url: `/customers`,
        method: 'GET',
      })
    }),

    getCustomerbyId: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'GET',
      })
    }),

    addCustomerParty: builder.mutation({
      query: (body) => ({
        url: "/customers/party",
        method: "POST",
        body
      }),
    }),

    addCustomer: builder.mutation({
      query: (body) => ({
        url: '/customers',
        method: 'POST',
        body,
      })
    }),

    updateCustomer: builder.mutation({
      query: ({ id, body }) => ({
        url: `/customers/update/${id}`,
        method: 'POST',
        body,
      })
    }),

    deleteCustomerParty: builder.mutation({
      query: (body) => ({
        url: '/customers/party/delete',
        method: 'POST',
        body,
      })
    }),

  })
})
export const {
  useGetMyCustomerMutation,
  useGetCustomerbyIdMutation,
  useAddCustomerPartyMutation,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerPartyMutation,
} = customerApiSlice
