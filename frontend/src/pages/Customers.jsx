
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/api';
// import {
//   UserPlus,
//   Search,
//   Phone,
//   MapPin,
//   Mail,
//   Loader2,
//   Globe,
//   Pencil,
//   Users
// } from 'lucide-react';

// import CustomSelect from '../components/CustomSelect';
// import InputBox from '../components/InputBox';
// import { useGetMyCustomerMutation } from '../customerapiSlice/apiSlicecustomer';
// import toast from 'react-hot-toast';

// export default function Customers() {
//   const navigate = useNavigate();
//   const [customers, setCustomers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState('All');
//   const [getMyCustomer, { isLoading }] = useGetMyCustomerMutation();

//   const allCountries = [
//     'India', 'China', 'Japan', 'South Korea', 'North Korea', 'Thailand',
//     'Vietnam', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines',
//     'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Afghanistan',
//     'Iran', 'Iraq', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait',
//     'Oman', 'Yemen', 'Israel', 'Jordan', 'Turkey', 'Kazakhstan',
//     'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Mongolia',
//     'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Portugal',
//     'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway',
//     'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Greece',
//     'Ireland', 'Romania', 'Bulgaria', 'Croatia', 'Serbia', 'Ukraine',
//     'Russia', 'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Ethiopia',
//     'Morocco', 'Ghana', 'Algeria', 'Tunisia', 'Uganda', 'United States',
//     'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia',
//     'Venezuela', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea'
//   ];
//   const filterCountries = ['All', ...allCountries];

//   const fetchCustomers = async () => {
//     try {
//       const res = await getMyCustomer();
//       const response = res?.data

//       if (res.error) {
//         throw new Error(res.error?.data?.message);
//       }

//       setCustomers(response?.data);
//       toast.success(response.message)

//     } catch (err) {
//       console.error('Error fetching customers:', err);
//       toast.error(err.message)
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const filteredCustomers = customers.filter(customer => {
//     const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone?.includes(searchTerm);
//     const matchesCountry = selectedCountry === 'All' || customer.country === selectedCountry;
//     return matchesSearch && matchesCountry;
//   });

//   return (
//     <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

//       {/* ================= HEADER ================= */}
//       <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
//         <div className="px-6 py-4 flex items-center justify-between">

//           <div className="flex items-center gap-4">
//             <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366]">
//               <Users className="w-5 h-5" />
//             </div>

//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 Customers
//               </h1>
//               <p className="text-sm text-gray-500">
//                 Directory of all salon clients and history
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
//               <Users className="w-4 h-4 text-gray-500" />
//               {filteredCustomers.length} Clients
//             </div>

//             <button
//               onClick={() => navigate('/customers/add')}
//               className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-md active:scale-95 cursor-pointer"
//             >
//               <UserPlus className="w-4 h-4" />
//               Add Customer
//             </button>
//           </div>

//         </div>
//       </div>

//       <div className="flex-1 overflow-hidden">

//         <div className="p-4 flex items-center justify-between  bg-white">

//           <div className="flex items-center gap-4">

//             <div className="w-72">
//               <InputBox
//                 inputFor="search"
//                 value={searchTerm}
//                 handleChangeFunction={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by name or phone..."
//                 icon={<Search className="w-4 h-4" />}
//               />
//             </div>

//             <div className="w-64">
//               <CustomSelect
//                 options={filterCountries.map(c => ({
//                   id: c,
//                   name: c === 'All' ? 'All Countries' : c
//                 }))}
//                 value={selectedCountry}
//                 onChange={setSelectedCountry}
//                 placeholder="All Countries"
//               />
//             </div>

//           </div>

//           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//             {filteredCustomers.length} results
//           </div>

//         </div>

//         <div className="h-full overflow-y-auto">

//           <table className="w-full text-left border-collapse">

//             {/* HEADER */}
//             <thead className="sticky top-0 bg-gray-50 z-10">
//               <tr className="text-gray-500 text-xs uppercase tracking-wider">
//                 <th className="px-8 py-4">Client Name</th>
//                 <th className="px-8 py-4">Contact</th>
//                 <th className="px-8 py-4">Location</th>
//                 <th className="px-8 py-4">Joined</th>
//                 <th className="px-8 py-4">Action</th>
//               </tr>
//             </thead>

//             {/* BODY */}
//             <tbody className="divide-y divide-gray-100">

//               {isLoading ? (
//                 <tr>
//                   <td colSpan="5" className="px-8 py-20 text-center">
//                     <Loader2 className="w-8 h-8 animate-spin text-[#003366] mx-auto" />
//                     <p className="text-gray-400 mt-2">Loading customers...</p>
//                   </td>
//                 </tr>
//               ) : filteredCustomers.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="px-8 py-20 text-center text-gray-400">
//                     No customers found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCustomers.map((client) => (
//                   <tr key={client.id} className="hover:bg-gray-50 transition">

//                     {/* NAME */}
//                     <td className="px-8 py-5">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#003366] font-bold">
//                           {client.name?.charAt(0)?.toUpperCase()}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900">
//                             {client.name}
//                           </p>
//                           <p className="text-xs text-gray-400">
//                             ID: DCS-{client.id}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* CONTACT */}
//                     <td className="px-8 py-5 text-sm text-gray-600 space-y-1">
//                       <div className="flex items-center gap-2">
//                         <Phone className="w-3.5 h-3.5 text-gray-400" />
//                         {client.phone || '—'}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Mail className="w-3.5 h-3.5 text-gray-400" />
//                         {client.email || '—'}
//                       </div>
//                     </td>

//                     {/* LOCATION */}
//                     <td className="px-8 py-5 text-sm text-gray-600">
//                       <div className="flex items-center gap-2">
//                         <MapPin className="w-3.5 h-3.5 text-gray-400" />
//                         {client.city ? `${client.city}, ${client.state}` : 'Not Specified'}
//                       </div>

//                       {client.country && (
//                         <div className="text-xs mt-1 text-blue-600 font-semibold">
//                           {client.country}
//                         </div>
//                       )}
//                     </td>

//                     {/* DATE */}
//                     <td className="px-8 py-5 text-sm text-gray-500">
//                       {new Date(client.createdAt).toLocaleDateString('en-GB')}
//                     </td>

//                     {/* ACTION */}
//                     <td className="px-8 py-5">
//                       <button
//                         onClick={() => navigate(`/customers/edit/${client.id}`)}
//                         className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition cursor-pointer"
//                       >
//                         <Pencil className="w-4 h-4" />
//                       </button>
//                     </td>

//                   </tr>
//                 ))
//               )}

//             </tbody>
//           </table>

//         </div>

//       </div>

//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Search,
  Phone,
  MapPin,
  Mail,
  Loader2,
  Pencil,
  Users
} from 'lucide-react';

import CustomSelect from '../components/CustomSelect';
import InputBox from '../components/InputBox';
import { useGetMyCustomerMutation } from '../customerapiSlice/apiSlicecustomer';
import toast from 'react-hot-toast';

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [getMyCustomer, { isLoading }] = useGetMyCustomerMutation();

  const allCountries = [
    'India', 'China', 'Japan', 'South Korea', 'North Korea', 'Thailand',
    'Vietnam', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines',
    'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Afghanistan',
    'Iran', 'Iraq', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait',
    'Oman', 'Yemen', 'Israel', 'Jordan', 'Turkey', 'Kazakhstan',
    'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Mongolia',
    'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Portugal',
    'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway',
    'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Greece',
    'Ireland', 'Romania', 'Bulgaria', 'Croatia', 'Serbia', 'Ukraine',
    'Russia', 'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Ethiopia',
    'Morocco', 'Ghana', 'Algeria', 'Tunisia', 'Uganda', 'United States',
    'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia',
    'Venezuela', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea'
  ];
  const filterCountries = ['All', ...allCountries];

  const fetchCustomers = async () => {
    try {
      const res = await getMyCustomer();
      const response = res?.data;
      if (res.error) throw new Error(res.error?.data?.message);
      setCustomers(response?.data);
      // toast.success(response.message);
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);
    const matchesCountry = selectedCountry === 'All' || customer.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

      {/* ── Header ── */}
      <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">

          {/* Left: icon + titles */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                Customers
              </h1>
              <p className="text-xs text-gray-400 font-medium leading-tight">
                Directory of all clients and history
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <button
            onClick={() => navigate('/customers/add')}
            className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* ── Inner card ── */}
      <div className="flex-1 bg-white shadow-sm overflow-hidden flex flex-col min-h-0 m-4 rounded-2xl border border-gray-100">

        {/* Search + filter bar */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-80">
              <InputBox
                inputFor="customer-search"
                placeholder="Search by name or phone..."
                value={searchTerm}
                handleChangeFunction={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={15} />}
                type="text"
                autoComplete="off"
              />
            </div>
            <div className="w-52">
              <CustomSelect
                options={filterCountries.map(c => ({
                  id: c,
                  name: c === 'All' ? 'All Countries' : c
                }))}
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="All Countries"
              />
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filteredCustomers.length} Total Customers
          </span>
        </div>

        {/* Fixed header + scrollable body */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">

          {/* Sticky thead */}
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[25%]" />
              <col className="w-[22%]" />
              <col className="w-[16%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
                <th className="px-8 py-3 font-semibold text-left">Client Name</th>
                <th className="px-8 py-3 font-semibold text-left">Contact</th>
                <th className="px-8 py-3 font-semibold text-left">Location</th>
                <th className="px-8 py-3 font-semibold text-left">Joined</th>
                <th className="px-8 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
          </table>

          {/* Scrollable tbody */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[25%]" />
                <col className="w-[22%]" />
                <col className="w-[16%]" />
                <col className="w-[12%]" />
              </colgroup>
              <tbody className="divide-y divide-gray-50">

                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
                        <span className="text-gray-400 font-medium text-sm">Loading customers...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-10 h-10 text-gray-200" />
                        <span className="text-gray-400 font-medium text-sm">No customers found</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    {/* Client Name */}
                    <td className="px-8 py-4 ">
                      <button
                        onClick={() => navigate(`/customers/edit/${client.id}`)}
                        className="group flex items-center gap-3 p-1 rounded-xl text-[#003366] hover:bg-[#004080] transition-all duration-300 active:scale-95 cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-white/20 flex items-center justify-center text-[#003366] group-hover:text-white font-bold text-sm shrink-0 transition-colors duration-300">
                          {client.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-white truncate transition-colors duration-300">
                            {client.name}
                          </p>
                          <p className="text-[10px] uppercase tracking-tight font-semibold mt-0.5 text-gray-400 group-hover:text-blue-100 transition-colors duration-300">
                            ID: DCS-{client.id}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* Contact */}
                    <td className="px-8 py-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{client.phone || '—'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{client.email || '—'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-gray-700 truncate">
                          {client.city ? `${client.city}, ${client.state}` : 'Not Specified'}
                        </span>
                      </div>
                      {client.country && (
                        <p className="text-[10px] text-blue-600 font-semibold mt-0.5 pl-[18px]">
                          {client.country}
                        </p>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-8 py-4">
                      <span className="text-sm text-gray-500 font-medium">
                        {new Date(client.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => navigate(`/customers/edit/${client.id}`)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-[#003366] transition-all active:scale-90 cursor-pointer"
                          title="Edit Customer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}