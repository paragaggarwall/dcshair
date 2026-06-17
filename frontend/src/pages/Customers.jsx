

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/api';
// import { UserPlus, Search, Phone, MapPin, Mail, Loader2, Globe, Pencil } from 'lucide-react';
// import CustomSelect from '../components/CustomSelect';
// import InputBox from '../components/InputBox';

// export default function Customers() {
//   const navigate = useNavigate();
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState('All');

//   // Predefined comprehensive country list
//   const allCountries = [
//     'India', 'China', 'Japan', 'South Korea', 'North Korea', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Afghanistan', 'Iran', 'Iraq', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Yemen', 'Israel', 'Jordan', 'Turkey', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Mongolia', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Greece', 'Ireland', 'Romania', 'Bulgaria', 'Croatia', 'Serbia', 'Ukraine', 'Russia', 'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Ethiopia', 'Morocco', 'Ghana', 'Algeria', 'Tunisia', 'Uganda', 'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea'
//   ];

//   const filterCountries = ['All', ...allCountries];

//   const fetchCustomers = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/customers`);
//       setCustomers(res.data);
//     } catch (err) {
//       console.error('Error fetching customers:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const filteredCustomers = customers.filter(customer => {
//     const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.phone?.includes(searchTerm);
//     const matchesCountry = selectedCountry === 'All' || customer.country === selectedCountry;

//     return matchesSearch && matchesCountry;
//   });

//   return (
//     <div className="h-screen flex flex-col">

//       <div className="sticky top-0 z-20 bg-white shadow-sm">
//         <div className="flex justify-between items-center p-2">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Directory of all salon clients and history
//             </p>
//           </div>

//           <button
//             onClick={() => navigate('/customers/add')}
//             className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-lg active:scale-95"
//           >
//             <UserPlus className="w-4 h-4" />
//             Add Customer
//           </button>
//         </div>
//       </div>
      
//       <div className="flex-1 overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">

//         <div className="p-2 pt-4 flex  justify-between ">
//           <div className="flex items-center gap-4">
//             <div className="relative w-72">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
//                 options={filterCountries.map(c => ({ id: c, name: c === 'All' ? 'All Countries' : c }))}
//                 value={selectedCountry}
//                 onChange={(val) => setSelectedCountry(val)}
//                 placeholder="All Countries"
//               />
//             </div>
//           </div>

//           <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//             {filteredCustomers.length} Total Results
//           </div>
//         </div>

//         {/* Scrollable table */}
//         <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
//           <table className="w-full text-left border-collapse">
//             <thead className="sticky top-0 bg-gray-50 z-10">
//               <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
//                 <th className="px-8 py-4 font-semibold">Client Name</th>
//                 <th className="px-8 py-4 font-semibold">Contact Info</th>
//                 <th className="px-8 py-4 font-semibold">Location</th>
//                 <th className="px-8 py-4 font-semibold">Joined</th>
//                 <th className="px-8 py-4 font-semibold">edit</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {loading ? (
//                 <tr>
//                   <td colSpan="4" className="px-8 py-20 text-center">
//                     <div className="flex flex-col items-center gap-3">
//                       <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
//                       <span className="text-gray-400 font-medium">Loading customers...</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredCustomers.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="px-8 py-20 text-center">
//                     <div className="flex flex-col items-center gap-2">
//                       <Search className="w-10 h-10 text-gray-200" />
//                       <span className="text-gray-400 font-medium">No customers found matching "{searchTerm}"</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredCustomers.map((client) => (
//                 <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
//                   <td className="px-8 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#003366] font-bold text-sm border border-blue-100">
//                         {client.name.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-gray-900">{client.name}</p>
//                         <p className="text-[10px] text-gray-400 uppercase tracking-tighter mt-0.5 font-semibold">ID: DCS-{client.id.toString().padStart(4, '0')}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-8 py-5">
//                     <div className="space-y-1.5">
//                       <div className="flex items-center gap-2 text-xs text-gray-600">
//                         <Phone className="w-3.5 h-3.5 text-blue-500/70" />
//                         <span className="font-medium">{client.phone || '—'}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-gray-600">
//                         <Mail className="w-3.5 h-3.5 text-blue-500/70" />
//                         <span className="font-medium">{client.email || '—'}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-8 py-5">
//                     <div className="flex flex-col gap-1 text-xs text-gray-600">
//                       <div className="flex items-center gap-2">
//                         <MapPin className="w-3.5 h-3.5 text-gray-400" />
//                         <span className="font-medium">{client.city ? `${client.city}, ${client.state}` : 'Not Specified'}</span>
//                       </div>
//                       {client.country && (
//                         <div className="flex items-center gap-2">
//                           <Globe className="w-3.5 h-3.5 text-gray-400 opacity-0" /> {/* Spacer for alignment */}
//                           <span className="text-[10px] bg-blue-50 px-1.5 py-0.5 rounded text-blue-600 font-bold uppercase tracking-wider">{client.country}</span>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-8 py-5 text-sm text-gray-500 font-medium">
//                     {new Date(client.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
//                   </td>
//                   <td>
//                     <button className="px-8 py-5 text-sm text-gray-500 font-medium" onClick={() => navigate(`/customers/edit/${client.id}`)}> <Pencil size={16} /> </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>


//     </div>
//   )
// }




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  UserPlus,
  Search,
  Phone,
  MapPin,
  Mail,
  Loader2,
  Globe,
  Pencil,
  Users
} from 'lucide-react';

import CustomSelect from '../components/CustomSelect';
import InputBox from '../components/InputBox';
import { useGetMyCustomerMutation } from '../customerapiSlice/apiSlicecustomer';

export default function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const [getMyCustomer]= useGetMyCustomerMutation();

 useEffect(() => {
  const fetchData = async () => {
    try {
      const resp = await getMyCustomer().unwrap();
      console.log("response:", resp);
    } catch (error) {
      console.log("error:", error);
    }
  };

  fetchData();
}, []);

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
    setLoading(true);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);

    const matchesCountry =
      selectedCountry === 'All' || customer.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366]">
              <Users className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Customers
              </h1>
              <p className="text-sm text-gray-500">
                Directory of all salon clients and history
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
              <Users className="w-4 h-4 text-gray-500" />
              {filteredCustomers.length} Clients
            </div>

            <button
              onClick={() => navigate('/customers/add')}
              className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Add Customer
            </button>
          </div>

        </div>
      </div>

      {/* ================= CONTENT WRAPPER ================= */}
      <div className="flex-1 overflow-hidden">

        {/* ================= SEARCH + FILTER ================= */}
        <div className="p-4 flex items-center justify-between  bg-white">

          <div className="flex items-center gap-4">

            <div className="w-72">
              <InputBox
                inputFor="search"
                value={searchTerm}
                handleChangeFunction={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or phone..."
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="w-64">
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

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {filteredCustomers.length} results
          </div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="h-full overflow-y-auto">

          <table className="w-full text-left border-collapse">

            {/* HEADER */}
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-8 py-4">Client Name</th>
                <th className="px-8 py-4">Contact</th>
                <th className="px-8 py-4">Location</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-100">

              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#003366] mx-auto" />
                    <p className="text-gray-400 mt-2">Loading customers...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition">

                    {/* NAME */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#003366] font-bold">
                          {client.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {client.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: DCS-{client.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-8 py-5 text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {client.phone || '—'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {client.email || '—'}
                      </div>
                    </td>

                    {/* LOCATION */}
                    <td className="px-8 py-5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {client.city ? `${client.city}, ${client.state}` : 'Not Specified'}
                      </div>

                      {client.country && (
                        <div className="text-xs mt-1 text-blue-600 font-semibold">
                          {client.country}
                        </div>
                      )}
                    </td>

                    {/* DATE */}
                    <td className="px-8 py-5 text-sm text-gray-500">
                      {new Date(client.createdAt).toLocaleDateString('en-GB')}
                    </td>

                    {/* ACTION */}
                    <td className="px-8 py-5">
                      <button
                        onClick={() => navigate(`/customers/edit/${client.id}`)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>

        </div>

      </div>

    </div>
  );
}