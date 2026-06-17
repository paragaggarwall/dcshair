// import React, { useState, useEffect } from 'react';
// import api from '../utils/api';
// import { UserPlus, Search, MoreVertical, X, Loader2 } from 'lucide-react';
// import CustomSelect from '../components/CustomSelect';


// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     userName: '',
//     email: '',
//     password: '',
//     role: 'User'
//   });
//   const [error, setError] = useState('');

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/users`);
//       setUsers(res.data);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError('');
//     try {
//       await api.post(`/users`, formData);
//       setIsModalOpen(false);
//       setFormData({ userName: '', email: '', password: '', role: 'User' });
//       fetchUsers();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to create user');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage staff accounts and permissions</p>
//         </div>
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#004080] transition-colors shadow-lg"
//         >
//           <UserPlus className="w-4 h-4" />
//           Add New User
//         </button>
//       </div>

//       {/* Modal Overlay */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
//           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
//               <h2 className="text-xl font-bold text-gray-900">Add New Staff Member</h2>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-4">
//               {error && (
//                 <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
//                   {error}
//                 </div>
//               )}

//               <div>
//                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Username</label>
//                 <input 
//                   required
//                   name="userName"
//                   value={formData.userName}
//                   onChange={handleInputChange}
//                   type="text" 
//                   placeholder="e.g. John Doe"
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003366]/10 focus:border-[#003366] transition-all text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
//                 <input 
//                   required
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   type="email" 
//                   placeholder="john@example.com"
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003366]/10 focus:border-[#003366] transition-all text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
//                 <input 
//                   required
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   type="password" 
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003366]/10 focus:border-[#003366] transition-all text-sm"
//                 />
//               </div>

//               <CustomSelect 
//                 label="Role"
//                 options={[
//                   { id: 'User', name: 'Standard User' },
//                   { id: 'Admin', name: 'Administrator' }
//                 ]}
//                 value={formData.role}
//                 onChange={(val) => setFormData(p => ({ ...p, role: val }))}
//                 searchable={false}
//               />

//               <div className="pt-4 flex gap-3">
//                 <button 
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   disabled={isSubmitting}
//                   type="submit"
//                   className="flex-1 bg-[#003366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
//                 >
//                   {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create User'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
//           <div className="relative w-72">
//             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input 
//               type="text" 
//               placeholder="Search users..." 
//               className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
//                 <th className="px-8 py-4 font-semibold">User</th>
//                 <th className="px-8 py-4 font-semibold">Role</th>
//                 <th className="px-8 py-4 font-semibold">Joined Date</th>
//                 <th className="px-8 py-4 font-semibold text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {loading ? (
//                 <tr>
//                   <td colSpan="4" className="px-8 py-12 text-center text-gray-400">
//                     <div className="flex flex-col items-center gap-2">
//                       <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
//                       <span>Loading users...</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : users.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="px-8 py-12 text-center text-gray-400">No users found.</td>
//                 </tr>
//               ) : users.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
//                   <td className="px-8 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
//                         {user.userName?.[0]?.toUpperCase() || '?'}
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-gray-900">{user.userName}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-8 py-4">
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                       user.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
//                     }`}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="px-8 py-4 text-sm text-gray-500">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-8 py-4 text-right">
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
//                       <MoreVertical className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import api from '../utils/api';
// import {
//   UserPlus, Search, MoreVertical, X, Loader2,
//   Users as UsersIcon, Edit2, Trash2,
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import CustomSelect from '../components/CustomSelect';
// import InputBox from '../components/InputBox';
// import toast from 'react-hot-toast';

// const EMPTY_FORM = { userName: '', email: '', password: '', role: 'User' };

// const ROLE_OPTIONS = [
//   { id: 'User', name: 'Standard User' },
//   { id: 'Admin', name: 'Administrator' },
// ];

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState(EMPTY_FORM);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const menuRefs = useRef({});

//   /* ── data fetching ── */
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/users');
//       setUsers(res.data);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       toast.error('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserById = async (id) => {
//     try {
//       const res = await api.get(`/users/${id}`);
//       setFormData({
//         userName: res.data.userName ?? '',
//         email: res.data.email ?? '',
//         password: '',
//         role: res.data.role ?? 'User',
//       });
//     } catch (err) {
//       console.error('Error fetching user details:', err);
//       toast.error(err.response?.data?.error ?? 'Error fetching user details');
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   useEffect(() => {
//     if (openMenuId === null) return;
//     const handler = (e) => {
//       const ref = menuRefs.current[openMenuId];
//       if (ref && !ref.contains(e.target)) setOpenMenuId(null);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [openMenuId]);

//   useEffect(() => {
//     if (isEditOpen && selectedId) fetchUserById(selectedId);
//   }, [isEditOpen, selectedId]);

//   /* ── helpers ── */
//   const handleInputChange = (e) =>
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const resetForm = () => {
//     setFormData(EMPTY_FORM);
//     setSelectedId(null);
//   };

//   const openAdd = () => { resetForm(); setIsAddOpen(true); };
//   const closeAdd = () => { setIsAddOpen(false); resetForm(); };

//   const openEdit = (id) => { setSelectedId(id); setOpenMenuId(null); setIsEditOpen(true); };
//   const closeEdit = () => { setIsEditOpen(false); resetForm(); };

//   /* ── validation (toast only) ── */
//   const validateCreate = () => {
//     if (!formData.userName?.trim()) { toast.error('Username is required'); return false; }
//     if (!formData.email?.trim()) { toast.error('Email is required'); return false; }
//     if (!formData.password?.trim()) { toast.error('Password is required'); return false; }
//     if (!formData.role?.trim()) { toast.error('Role is required'); return false; }
//     return true;
//   };

//   /* ── CRUD ── */
//   const handleCreate = async () => {
//     if (!validateCreate()) return;
//     setIsSubmitting(true);
//     try {
//       await api.post('/users', formData);
//       toast.success('User created successfully');
//       closeAdd();
//       fetchUsers();
//     } catch (err) {
//       toast.error(err.response?.data?.error ?? 'Failed to create user');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!formData.userName?.trim()) { toast.error('Username is required'); return; }
//     setIsSubmitting(true);
//     try {
//       await api.post(`/users/update/${selectedId}`, formData);
//       toast.success('User updated successfully');
//       closeEdit();
//       fetchUsers();
//     } catch (err) {
//       toast.error(err.response?.data?.error ?? 'Failed to update user');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (user) => {
//     setOpenMenuId(null);
//     try {
//       const res = await api.post(`/users/delete/${user.id}`);
//       toast.success(res.data.message ?? 'Account deleted');
//       fetchUsers();
//     } catch (err) {
//       console.error('Delete failed:', err.response?.data?.error);
//       toast.error(err.response?.data?.error ?? 'Failed to delete account');
//     }
//   };

//   /* ── derived ── */
//   const filteredUsers = users.filter(u =>
//     u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

//       {/* ── Header ── */}
//       <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center shadow-md">
//               <UsersIcon className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
//                 User Management
//               </h1>
//               <p className="text-xs text-gray-400 font-medium leading-tight">
//                 Manage staff accounts and permissions
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={openAdd}
//             className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-md hover:shadow-lg active:scale-95"
//           >
//             <UserPlus className="w-4 h-4" />
//             Add New User
//           </button>
//         </div>
//       </div>

//       {/* ── Table Card ── */}
//       <div className="flex-1 bg-white shadow-sm overflow-hidden flex flex-col min-h-0 m-4 rounded-2xl border border-gray-100">

//         <div className="shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
//           <div className="w-72">
//             <InputBox
//               inputFor="user-search"
//               placeholder="Search users..."
//               value={searchTerm}
//               handleChangeFunction={(e) => setSearchTerm(e.target.value)}
//               icon={<Search size={15} />}
//               type="text"
//               autoComplete="off"
//             />
//           </div>
//           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//             {filteredUsers.length} Total Users
//           </span>
//         </div>

//         <div className="flex-1 overflow-y-auto min-h-0">
//           <table className="w-full text-left border-collapse table-fixed">
//             <colgroup>
//               <col className="w-[35%]" />
//               <col className="w-[20%]" />
//               <col className="w-[25%]" />
//               <col className="w-[20%]" />
//             </colgroup>
//             <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
//               <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
//                 <th className="px-8 py-3 font-semibold text-left">User</th>
//                 <th className="px-8 py-3 font-semibold text-left">Role</th>
//                 <th className="px-8 py-3 font-semibold text-left">Joined Date</th>
//                 <th className="px-8 py-3 font-semibold text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-50">
//               {loading ? (
//                 <tr>
//                   <td colSpan={4} className="px-8 py-20 text-center">
//                     <div className="flex flex-col items-center gap-3">
//                       <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
//                       <span className="text-gray-400 font-medium text-sm">Loading users…</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className="px-8 py-20 text-center">
//                     <div className="flex flex-col items-center gap-2">
//                       <UsersIcon className="w-10 h-10 text-gray-200" />
//                       <span className="text-gray-400 font-medium text-sm">No users found</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredUsers.map((user) => (
//                 <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">

//                   <td className="px-8 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#003366] font-bold border border-blue-100 text-sm shrink-0">
//                         {user.userName?.[0]?.toUpperCase() ?? '?'}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm font-bold text-gray-900 truncate">{user.userName}</p>
//                         <p className="text-xs text-gray-400 truncate">{user.email}</p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-8 py-4">
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'Admin'
//                       ? 'bg-purple-50 text-purple-700'
//                       : 'bg-blue-50 text-blue-700'
//                       }`}>
//                       {user.role}
//                     </span>
//                   </td>

//                   <td className="px-8 py-4 text-sm text-gray-500 font-medium">
//                     {new Date(user.createdAt).toLocaleDateString('en-GB', {
//                       day: '2-digit', month: 'short', year: 'numeric',
//                     })}
//                   </td>

//                   <td className="px-8 py-4 text-right">
//                     <div
//                       className="relative inline-block"
//                       ref={(el) => (menuRefs.current[user.id] = el)}
//                     >
//                       <button
//                         onClick={() => setOpenMenuId(prev => prev === user.id ? null : user.id)}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 active:scale-90"
//                         title="More options"
//                       >
//                         <MoreVertical className="w-4 h-4" />
//                       </button>

//                       <AnimatePresence>
//                         {openMenuId === user.id && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.95, y: -4 }}
//                             animate={{ opacity: 1, scale: 1, y: 0 }}
//                             exit={{ opacity: 0, scale: 0.95, y: -4 }}
//                             transition={{ duration: 0.12 }}
//                             className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg w-44 overflow-hidden"
//                           >
//                             <button
//                               onClick={() => openEdit(user.id)}
//                               className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
//                             >
//                               <Edit2 className="w-4 h-4 text-gray-400 shrink-0" />
//                               Edit account
//                             </button>
//                             <div className="h-px bg-gray-100 mx-3" />
//                             <button
//                               onClick={() => handleDelete(user)}
//                               className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
//                             >
//                               <Trash2 className="w-4 h-4 shrink-0" />
//                               Delete account
//                             </button>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>



//       {/* ── Add User Modal ── */}
//       <AnimatePresence>
//         {isAddOpen && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white w-full max-w-md rounded-2xl shadow-2xl"
//               initial={{ opacity: 0, scale: 0.96, y: 8 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.96, y: 8 }}
//               transition={{ duration: 0.18, ease: 'easeOut' }}
//             >
//               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60 rounded-t-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center">
//                     <UserPlus className="w-4 h-4 text-white" />
//                   </div>
//                   <h2 className="text-base font-bold text-gray-900">Add New Staff Member</h2>
//                 </div>
//                 <button
//                   onClick={closeAdd}
//                   className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>

//               <div className="p-6 space-y-4">
//                 <InputBox
//                   title="Username"
//                   inputFor="userName"
//                   placeholder="e.g. John Doe"
//                   value={formData.userName}
//                   handleChangeFunction={handleInputChange}
//                   type="text"
//                   isMandatory
//                   autoComplete="off"
//                 />
//                 <InputBox
//                   title="Email Address"
//                   inputFor="email"
//                   placeholder="john@example.com"
//                   value={formData.email}
//                   handleChangeFunction={handleInputChange}
//                   type="text"
//                   isMandatory
//                   autoComplete="off"
//                 />
//                 <InputBox
//                   title="Password"
//                   inputFor="password"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   handleChangeFunction={handleInputChange}
//                   type="password"
//                   isMandatory
//                   autoComplete="new-password"
//                 />
//                 <CustomSelect
//                   label="Role"
//                   options={ROLE_OPTIONS}
//                   value={formData.role}
//                   onChange={(val) => setFormData(p => ({ ...p, role: val }))}
//                   searchable={false}
//                 />
//                 <div className="pt-2 flex gap-3">
//                   <button
//                     onClick={closeAdd}
//                     className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     disabled={isSubmitting}
//                     onClick={handleCreate}
//                     className="flex-1 bg-[#003366] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#004080] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
//                   >
//                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create User'}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ── Edit User Modal ── */}
//       <AnimatePresence>
//         {isEditOpen && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white w-full max-w-md rounded-2xl shadow-2xl"
//               initial={{ opacity: 0, scale: 0.96, y: 8 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.96, y: 8 }}
//               transition={{ duration: 0.18, ease: 'easeOut' }}
//             >
//               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60 rounded-t-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center">
//                     <UserPlus className="w-4 h-4 text-white" />
//                   </div>
//                   <h2 className="text-base font-bold text-gray-900">Edit Staff Member</h2>
//                 </div>
//                 <button
//                   onClick={closeEdit}
//                   className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>

//               <div className="p-6 space-y-4">
//                 <InputBox
//                   title="Username"
//                   inputFor="userName"
//                   placeholder="e.g. John Doe"
//                   value={formData.userName}
//                   handleChangeFunction={handleInputChange}
//                   type="text"
//                   isMandatory
//                   autoComplete="off"
//                 />
//                 <InputBox
//                   title="Email Address"
//                   inputFor="email"
//                   placeholder="john@example.com"
//                   value={formData.email}
//                   handleChangeFunction={handleInputChange}
//                   type="text"
//                   isInputBoxDisabled
//                   autoComplete="off"
//                 />
//                 <InputBox
//                   title="Password"
//                   inputFor="password"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   handleChangeFunction={handleInputChange}
//                   type="password"
//                   isInputBoxDisabled
//                   autoComplete="new-password"
//                 />
//                 <CustomSelect
//                   label="Role"
//                   options={ROLE_OPTIONS}
//                   value={formData.role}
//                   onChange={(val) => setFormData(p => ({ ...p, role: val }))}
//                   searchable={false}
//                 />
//                 <div className="pt-2 flex gap-3">
//                   <button
//                     onClick={closeEdit}
//                     className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     disabled={isSubmitting}
//                     onClick={handleUpdate}
//                     className="flex-1 bg-[#003366] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#004080] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
//                   >
//                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update User'}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }



// import React, { useState, useEffect, useRef } from 'react';
// import api from '../utils/api';
// import {
//   UserPlus, Search, MoreVertical, X, Loader2,
//   Users as UsersIcon, Edit2, Trash2,
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import CustomSelect from '../components/CustomSelect';
// import InputBox from '../components/InputBox';
// import toast from 'react-hot-toast';

// const EMPTY_FORM = { userName: '', email: '', password: '', role: 'User' };

// const ROLE_OPTIONS = [
//   { id: 'User',  name: 'Standard User' },
//   { id: 'Admin', name: 'Administrator' },
// ];

// export default function Users() {
//   const [users,        setUsers]        = useState([]);
//   const [loading,      setLoading]      = useState(true);
//   const [searchTerm,   setSearchTerm]   = useState('');
//   const [isAddOpen,    setIsAddOpen]    = useState(false);
//   const [isEditOpen,   setIsEditOpen]   = useState(false);
//   const [selectedId,   setSelectedId]   = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData,     setFormData]     = useState(EMPTY_FORM);
//   const [openMenuId,   setOpenMenuId]   = useState(null);
//   const menuRefs = useRef({});

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/users');
//       setUsers(res.data);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       toast.error('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserById = async (id) => {
//     try {
//       const res = await api.get(`/users/${id}`);
//       setFormData({
//         userName: res.data.userName ?? '',
//         email:    res.data.email    ?? '',
//         password: '',
//         role:     res.data.role     ?? 'User',
//       });
//     } catch (err) {
//       console.error('Error fetching user details:', err);
//       toast.error(err.response?.data?.error ?? 'Error fetching user details');
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   useEffect(() => {
//     if (openMenuId === null) return;
//     const handler = (e) => {
//       const ref = menuRefs.current[openMenuId];
//       if (ref && !ref.contains(e.target)) setOpenMenuId(null);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [openMenuId]);

//   useEffect(() => {
//     if (isEditOpen && selectedId) fetchUserById(selectedId);
//   }, [isEditOpen, selectedId]);

//   const handleInputChange = (e) =>
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const resetForm = () => { setFormData(EMPTY_FORM); setSelectedId(null); };

//   const openAdd  = () => { resetForm(); setIsAddOpen(true); };
//   const closeAdd = () => { setIsAddOpen(false); resetForm(); };

//   const openEdit  = (id) => { setSelectedId(id); setOpenMenuId(null); setIsEditOpen(true); };
//   const closeEdit = () => { setIsEditOpen(false); resetForm(); };

//   const validateCreate = () => {
//     if (!formData.userName?.trim()) { toast.error('Username is required');  return false; }
//     if (!formData.email?.trim())    { toast.error('Email is required');     return false; }
//     if (!formData.password?.trim()) { toast.error('Password is required');  return false; }
//     if (!formData.role?.trim())     { toast.error('Role is required');      return false; }
//     return true;
//   };

//   const handleCreate = async () => {
//     if (!validateCreate()) return;
//     setIsSubmitting(true);
//     try {
//       await api.post('/users', formData);
//       toast.success('User created successfully');
//       closeAdd();
//       fetchUsers();
//     } catch (err) {
//       toast.error(err.response?.data?.error ?? 'Failed to create user');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!formData.userName?.trim()) { toast.error('Username is required'); return; }
//     setIsSubmitting(true);
//     try {
//       await api.post(`/users/update/${selectedId}`, formData);
//       toast.success('User updated successfully');
//       closeEdit();
//       fetchUsers();
//     } catch (err) {
//       toast.error(err.response?.data?.error ?? 'Failed to update user');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (user) => {
//     setOpenMenuId(null);
//     try {
//       const res = await api.post(`/users/delete/${user.id}`);
//       toast.success(res.data.message ?? 'Account deleted');
//       fetchUsers();
//     } catch (err) {
//       toast.error(err.response?.data?.error ?? 'Failed to delete account');
//     }
//   };

//   const filteredUsers = users.filter(u =>
//     u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     /*
//       Layout:
//         [page root]          — h-screen, flex col, overflow-hidden
//           [page header]      — shrink-0  (never scrolls)
//           [page body]        — flex-1, overflow-y-auto  ← scrollbar lives here, BELOW header
//             [card]           — min-h-fit, no overflow
//               [search bar]   — shrink-0  (sticks inside card)
//               [table]        — sticky thead, tbody unrestricted
//     */
//     <div className="h-screen flex flex-col overflow-hidden bg-gray-50">

//       {/* ── Page Header — fixed height, never scrolls ── */}
//       <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center shadow-md">
//               <UsersIcon className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
//                 User Management
//               </h1>
//               <p className="text-xs text-gray-400 font-medium leading-tight">
//                 Manage staff accounts and permissions
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={openAdd}
//             className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-md hover:shadow-lg active:scale-95"
//           >
//             <UserPlus className="w-4 h-4" />
//             Add New User
//           </button>
//         </div>
//       </div>

//       {/* ── Page Body — scrollbar appears here, starts below header ── */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="m-4">

//           {/* Card */}
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

//             {/* Search / count bar — sticky inside card */}
//             <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center backdrop-blur-sm">
//               <div className="w-72">
//                 <InputBox
//                   inputFor="user-search"
//                   placeholder="Search users..."
//                   value={searchTerm}
//                   handleChangeFunction={(e) => setSearchTerm(e.target.value)}
//                   icon={<Search size={15} />}
//                   type="text"
//                   autoComplete="off"
//                 />
//               </div>
//               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//                 {filteredUsers.length} Total Users
//               </span>
//             </div>

//             {/* Table */}
//             <table className="w-full text-left border-collapse table-fixed">
//               <colgroup>
//                 <col className="w-[35%]" />
//                 <col className="w-[20%]" />
//                 <col className="w-[25%]" />
//                 <col className="w-[20%]" />
//               </colgroup>

//               {/* Sticky thead — sticks below search bar (top-[57px] = search bar height) */}
//               <thead className="bg-gray-50 border-b border-gray-100 sticky top-[57px] z-10">
//                 <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
//                   <th className="px-8 py-3 font-semibold text-left">User</th>
//                   <th className="px-8 py-3 font-semibold text-left">Role</th>
//                   <th className="px-8 py-3 font-semibold text-left">Joined Date</th>
//                   <th className="px-8 py-3 font-semibold text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-50">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={4} className="px-8 py-20 text-center">
//                       <div className="flex flex-col items-center gap-3">
//                         <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
//                         <span className="text-gray-400 font-medium text-sm">Loading users…</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="px-8 py-20 text-center">
//                       <div className="flex flex-col items-center gap-2">
//                         <UsersIcon className="w-10 h-10 text-gray-200" />
//                         <span className="text-gray-400 font-medium text-sm">No users found</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">

//                     <td className="px-8 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#003366] font-bold border border-blue-100 text-sm shrink-0">
//                           {user.userName?.[0]?.toUpperCase() ?? '?'}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm font-bold text-gray-900 truncate">{user.userName}</p>
//                           <p className="text-xs text-gray-400 truncate">{user.email}</p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-8 py-4">
//                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                         user.role === 'Admin'
//                           ? 'bg-purple-50 text-purple-700'
//                           : 'bg-blue-50 text-blue-700'
//                       }`}>
//                         {user.role}
//                       </span>
//                     </td>

//                     <td className="px-8 py-4 text-sm text-gray-500 font-medium">
//                       {new Date(user.createdAt).toLocaleDateString('en-GB', {
//                         day: '2-digit', month: 'short', year: 'numeric',
//                       })}
//                     </td>

//                     <td className="px-8 py-4 text-right">
//                       <div
//                         className="relative inline-block"
//                         ref={(el) => (menuRefs.current[user.id] = el)}
//                       >
//                         <button
//                           onClick={() => setOpenMenuId(prev => prev === user.id ? null : user.id)}
//                           className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 active:scale-90"
//                           title="More options"
//                         >
//                           <MoreVertical className="w-4 h-4" />
//                         </button>

//                         <AnimatePresence>
//                           {openMenuId === user.id && (
//                             <motion.div
//                               initial={{ opacity: 0, scale: 0.95, y: -4 }}
//                               animate={{ opacity: 1, scale: 1,    y: 0  }}
//                               exit={  { opacity: 0, scale: 0.95, y: -4 }}
//                               transition={{ duration: 0.12 }}
//                               className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg w-44 overflow-hidden"
//                             >
//                               <button
//                                 onClick={() => openEdit(user.id)}
//                                 className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
//                               >
//                                 <Edit2 className="w-4 h-4 text-gray-400 shrink-0" />
//                                 Edit account
//                               </button>
//                               <div className="h-px bg-gray-100 mx-3" />
//                               <button
//                                 onClick={() => handleDelete(user)}
//                                 className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
//                               >
//                                 <Trash2 className="w-4 h-4 shrink-0" />
//                                 Delete account
//                               </button>
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//           </div>
//         </div>
//       </div>

//       {/* ── Add User Modal ── */}
//       <AnimatePresence>
//         {isAddOpen && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white w-full max-w-md rounded-2xl shadow-2xl"
//               initial={{ opacity: 0, scale: 0.96, y: 8 }}
//               animate={{ opacity: 1, scale: 1,    y: 0 }}
//               exit={  { opacity: 0, scale: 0.96, y: 8 }}
//               transition={{ duration: 0.18, ease: 'easeOut' }}
//             >
//               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60 rounded-t-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center">
//                     <UserPlus className="w-4 h-4 text-white" />
//                   </div>
//                   <h2 className="text-base font-bold text-gray-900">Add New Staff Member</h2>
//                 </div>
//                 <button
//                   onClick={closeAdd}
//                   className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-6 space-y-4">
//                 <InputBox
//                   title="Username"   inputFor="userName"  placeholder="e.g. John Doe"
//                   value={formData.userName}  handleChangeFunction={handleInputChange}
//                   type="text"  isMandatory  autoComplete="off"
//                 />
//                 <InputBox
//                   title="Email Address"  inputFor="email"  placeholder="john@example.com"
//                   value={formData.email}  handleChangeFunction={handleInputChange}
//                   type="text"  isMandatory  autoComplete="off"
//                 />
//                 <InputBox
//                   title="Password"  inputFor="password"  placeholder="••••••••"
//                   value={formData.password}  handleChangeFunction={handleInputChange}
//                   type="password"  isMandatory  autoComplete="new-password"
//                 />
//                 <CustomSelect
//                   label="Role"  options={ROLE_OPTIONS}  value={formData.role}
//                   onChange={(val) => setFormData(p => ({ ...p, role: val }))}  searchable={false}
//                 />
//                 <div className="pt-2 flex gap-3">
//                   <button onClick={closeAdd} className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
//                     Cancel
//                   </button>
//                   <button disabled={isSubmitting} onClick={handleCreate} className="flex-1 bg-[#003366] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#004080] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95">
//                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create User'}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ── Edit User Modal ── */}
//       <AnimatePresence>
//         {isEditOpen && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white w-full max-w-md rounded-2xl shadow-2xl"
//               initial={{ opacity: 0, scale: 0.96, y: 8 }}
//               animate={{ opacity: 1, scale: 1,    y: 0 }}
//               exit={  { opacity: 0, scale: 0.96, y: 8 }}
//               transition={{ duration: 0.18, ease: 'easeOut' }}
//             >
//               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60 rounded-t-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center">
//                     <UserPlus className="w-4 h-4 text-white" />
//                   </div>
//                   <h2 className="text-base font-bold text-gray-900">Edit Staff Member</h2>
//                 </div>
//                 <button
//                   onClick={closeEdit}
//                   className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-6 space-y-4">
//                 <InputBox
//                   title="Username"  inputFor="userName"  placeholder="e.g. John Doe"
//                   value={formData.userName}  handleChangeFunction={handleInputChange}
//                   type="text"  isMandatory  autoComplete="off"
//                 />
//                 <InputBox
//                   title="Email Address"  inputFor="email"  placeholder="john@example.com"
//                   value={formData.email}  handleChangeFunction={handleInputChange}
//                   type="text"  isInputBoxDisabled  autoComplete="off"
//                 />
//                 <InputBox
//                   title="Password"  inputFor="password"  placeholder="••••••••"
//                   value={formData.password}  handleChangeFunction={handleInputChange}
//                   type="password"  isInputBoxDisabled  autoComplete="new-password"
//                 />
//                 <CustomSelect
//                   label="Role"  options={ROLE_OPTIONS}  value={formData.role}
//                   onChange={(val) => setFormData(p => ({ ...p, role: val }))}  searchable={false}
//                 />
//                 <div className="pt-2 flex gap-3">
//                   <button onClick={closeEdit} className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
//                     Cancel
//                   </button>
//                   <button disabled={isSubmitting} onClick={handleUpdate} className="flex-1 bg-[#003366] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#004080] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95">
//                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update User'}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import {
  UserPlus, Search, MoreVertical, X, Loader2,
  Users as UsersIcon, Edit2, Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../components/CustomSelect';
import InputBox from '../components/InputBox';
import toast from 'react-hot-toast';

const EMPTY_FORM = { userName: '', email: '', password: '', role: 'User' };

const ROLE_OPTIONS = [
  { id: 'User',  name: 'Standard User' },
  { id: 'Admin', name: 'Administrator' },
];

export default function Users() {
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [isAddOpen,    setIsAddOpen]    = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [selectedId,   setSelectedId]   = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData,     setFormData]     = useState(EMPTY_FORM);
  const [openMenuId,   setOpenMenuId]   = useState(null);
  const menuRefs = useRef({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const res = await api.get(`/users/${id}`);
      setFormData({
        userName: res.data.userName ?? '',
        email:    res.data.email    ?? '',
        password: '',
        role:     res.data.role     ?? 'User',
      });
    } catch (err) {
      console.error('Error fetching user details:', err);
      toast.error(err.response?.data?.error ?? 'Error fetching user details');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (openMenuId === null) return;
    const handler = (e) => {
      const ref = menuRefs.current[openMenuId];
      if (ref && !ref.contains(e.target)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  useEffect(() => {
    if (isEditOpen && selectedId) fetchUserById(selectedId);
  }, [isEditOpen, selectedId]);

  const handleInputChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => { setFormData(EMPTY_FORM); setSelectedId(null); };

  const openAdd  = () => { resetForm(); setIsAddOpen(true); };
  const closeAdd = () => { setIsAddOpen(false); resetForm(); };

  const openEdit  = (id) => { setSelectedId(id); setOpenMenuId(null); setIsEditOpen(true); };
  const closeEdit = () => { setIsEditOpen(false); resetForm(); };

  const validateCreate = () => {
    if (!formData.userName?.trim()) { toast.error('Username is required');  return false; }
    if (!formData.email?.trim())    { toast.error('Email is required');     return false; }
    if (!formData.password?.trim()) { toast.error('Password is required');  return false; }
    if (!formData.role?.trim())     { toast.error('Role is required');      return false; }
    return true;
  };

  const handleCreate = async () => {
    if (!validateCreate()) return;
    setIsSubmitting(true);
    try {
      await api.post('/users', formData);
      toast.success('User created successfully');
      closeAdd();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.userName?.trim()) { toast.error('Username is required'); return; }
    setIsSubmitting(true);
    try {
      await api.post(`/users/update/${selectedId}`, formData);
      toast.success('User updated successfully');
      closeEdit();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    setOpenMenuId(null);
    try {
      const res = await api.post(`/users/delete/${user.id}`);
      toast.success(res.data.message ?? 'Account deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'Failed to delete account');
    }
  };

  const filteredUsers = users.filter(u =>
    u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* ── Page Header ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#003366] flex items-center justify-center text-white shadow-lg shadow-[#003366]/20">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">User Management</h1>
              <p className="text-xs text-gray-400 font-medium">Manage staff accounts and permissions</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/25 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </button>
        </div>
      </div>

      {/* ── Card (same pattern as Products) ── */}
      <div className="flex-1 flex flex-col min-h-0 m-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Search bar — never scrolls */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
          <div className="w-72">
            <InputBox
              inputFor="user-search"
              placeholder="Search users..."
              value={searchTerm}
              handleChangeFunction={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={15} />}
              type="text"
              autoComplete="off"
            />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filteredUsers.length} Total Users
          </span>
        </div>

        {/* Sticky thead — same pattern as Products (separate non-scrolling thead table) */}
        <div className="flex-shrink-0 bg-gray-50/80 border-b border-gray-100">
          <table className="w-full text-left table-fixed">
            <colgroup>
              <col className="w-[35%]" />
              <col className="w-[20%]" />
              <col className="w-[25%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                <th className="px-8 py-3">User</th>
                <th className="px-8 py-3">Role</th>
                <th className="px-8 py-3">Joined Date</th>
                <th className="px-8 py-3 text-right">Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable tbody — thin custom scrollbar, same as Products */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full text-left table-fixed">
            <colgroup>
              <col className="w-[35%]" />
              <col className="w-[20%]" />
              <col className="w-[25%]" />
              <col className="w-[20%]" />
            </colgroup>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
                      <span className="text-gray-400 font-medium text-sm">Loading users…</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <UsersIcon className="w-10 h-10 text-gray-200" />
                      <span className="text-gray-400 font-medium text-sm">No users found</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">

                  {/* User */}
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#003366] font-bold border border-blue-100 text-sm shrink-0">
                        {user.userName?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.userName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'Admin'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-8 py-4 text-sm text-gray-500 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-4 text-right">
                    <div
                      className="relative inline-block"
                      ref={(el) => (menuRefs.current[user.id] = el)}
                    >
                      <button
                        onClick={() => setOpenMenuId(prev => prev === user.id ? null : user.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 active:scale-90"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {openMenuId === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1,    y: 0  }}
                            exit={  { opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg w-44 overflow-hidden"
                          >
                            <button
                              onClick={() => openEdit(user.id)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                            >
                              <Edit2 className="w-4 h-4 text-gray-400 shrink-0" />
                              Edit account
                            </button>
                            <div className="h-px bg-gray-100 mx-3" />
                            <button
                              onClick={() => handleDelete(user)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                              <Trash2 className="w-4 h-4 shrink-0" />
                              Delete account
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add User Modal ── */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={  { opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Add New Staff Member</h2>
                </div>
                <button onClick={closeAdd} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <InputBox title="Username" inputFor="userName" placeholder="e.g. John Doe"
                  value={formData.userName} handleChangeFunction={handleInputChange}
                  type="text" isMandatory autoComplete="off" />
                <InputBox title="Email Address" inputFor="email" placeholder="john@example.com"
                  value={formData.email} handleChangeFunction={handleInputChange}
                  type="text" isMandatory autoComplete="off" />
                <InputBox title="Password" inputFor="password" placeholder="••••••••"
                  value={formData.password} handleChangeFunction={handleInputChange}
                  type="password" isMandatory autoComplete="new-password" />
                <CustomSelect label="Role" options={ROLE_OPTIONS} value={formData.role}
                  onChange={(val) => setFormData(p => ({ ...p, role: val }))} searchable={false} />
                <div className="pt-2 flex gap-3">
                  <button onClick={closeAdd} className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
                    Cancel
                  </button>
                  <button disabled={isSubmitting} onClick={handleCreate}
                    className="flex-1 bg-[#003366] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#004080] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create User'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit User Modal ── */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={  { opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Edit Staff Member</h2>
                </div>
                <button onClick={closeEdit} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <InputBox title="Username" inputFor="userName" placeholder="e.g. John Doe"
                  value={formData.userName} handleChangeFunction={handleInputChange}
                  type="text" isMandatory autoComplete="off" />
                <InputBox title="Email Address" inputFor="email" placeholder="john@example.com"
                  value={formData.email} handleChangeFunction={handleInputChange}
                  type="text" isInputBoxDisabled autoComplete="off" />
                <InputBox title="Password" inputFor="password" placeholder="••••••••"
                  value={formData.password} handleChangeFunction={handleInputChange}
                  type="password" isInputBoxDisabled autoComplete="new-password" />
                <CustomSelect label="Role" options={ROLE_OPTIONS} value={formData.role}
                  onChange={(val) => setFormData(p => ({ ...p, role: val }))} searchable={false} />
                <div className="pt-2 flex gap-3">
                  <button onClick={closeEdit} className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
                    Cancel
                  </button>
                  <button disabled={isSubmitting} onClick={handleUpdate}
                    className="flex-1 bg-[#003366] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#004080] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update User'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}