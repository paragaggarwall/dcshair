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
        url: "/contracts/party",
        method: "POST",
        body
      }),
    }),

  })
})
export const {
  useGetMyCustomerMutation,
  useGetCustomerbyIdMutation,
  useAddCustomerPartyMutation,
} = customerApiSlice
