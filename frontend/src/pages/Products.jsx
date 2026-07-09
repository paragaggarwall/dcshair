

// import React, { useState, useEffect } from 'react';
// import { Package, Search, Plus, X, Loader2, Image as ImageIcon, Barcode, Layers, Pencil } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import InputBox from '../components/inputBox';
// import api from '../utils/api';
// import CustomSelect from '../components/CustomSelect';
// import toast from 'react-hot-toast';

// const COLOR_SWATCHES = [
//   { id: 'Black', name: 'Black', hex: '#1a1a1a' },
//   { id: 'Brown', name: 'Brown', hex: '#7B4F2E' },
//   { id: 'Dark Brown', name: 'Dark Brown', hex: '#3B1F0A' },
//   { id: 'Auburn', name: 'Auburn', hex: '#A0522D' },
//   { id: 'Copper', name: 'Copper', hex: '#aa6626' },
//   { id: 'Red', name: 'Red', hex: '#C0392B' },
//   { id: 'Blonde', name: 'Blonde', hex: '#F5DEB3' },
//   { id: 'Ash Blonde', name: 'Ash Blonde', hex: '#D4C5A9' },
//   { id: 'Platinum', name: 'Platinum', hex: '#E8E0D0' },
//   { id: 'Silver', name: 'Silver', hex: '#9E9E9E' },
//   { id: 'Grey', name: 'Grey', hex: '#6B6B6B' },
// ];

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     name: '', size: '', color: '', imageUrl: '', skuCode: ''
//   });

//   const initialFormState = {
//     name: '',
//     size: '',
//     color: '',
//     imageUrl: '',
//     skuCode: ''
//   };

//   const resetForm = () => {
//     setFormData(initialFormState);
//     setError('');
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await api.post('/products/get');
//       setProducts(res.data);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       toast.error('Error fetching products:', err)
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchProducts(); }, []);



//   const fetchProductById = async () => {
//     try {
//       const res = await api.get(`/products/${selectedProductId}`);
//       setFormData({
//         name: res.data.name || '',
//         size: res.data.size || '',
//         color: res.data.color || '',
//         imageUrl: res.data.imageUrl || '',
//         skuCode: res.data.skuCode || ''
//       });
//     } catch (err) {
//       console.error('Error fetching product details:', err);
//       toast.error(err.response?.data?.error || 'Error fetching product details');
//     }
//   };

//   useEffect(() => {
//     if (isEditModalOpen && selectedProductId) {
//       fetchProductById();
//     }
//   }, [isEditModalOpen, selectedProductId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };


//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       toast.error('Product name is required');
//       return false;
//     }

//     if (!formData.skuCode.trim()) {
//       toast.error('SKU Code is required');
//       return false;
//     }

//     if (!formData.color) {
//       toast.error('Please select a hair color');
//       return false;
//     }
//     if (!formData.size) {
//       toast.error('Size is required');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setIsSubmitting(true);
//     setError('');
//     try {
//       await api.post('/products/create', formData);
//       setIsModalOpen(false);
//       setFormData({ name: '', size: '', color: '', imageUrl: '', skuCode: '' });
//       fetchProducts();
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to add product. Please check if SKU is unique.')
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     setError('');

//     try {
//       await api.post(`/products/update/${selectedProductId}`, formData);

//       setIsEditModalOpen(false);
//       setSelectedProductId(null);

//       setFormData({
//         name: '',
//         size: '',
//         color: '',
//         imageUrl: '',
//         skuCode: ''
//       });

//       fetchProducts();
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to update product')
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const colorHex = COLOR_SWATCHES.find(s => s.id === formData.color)?.hex ?? null;

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.skuCode.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="h-screen flex flex-col bg-[#f5f7fa]">

//       {/* ── Top Bar ── */}
//       <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-20">
//         <div className="px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-11 h-11 rounded-xl bg-[#003366] flex items-center justify-center text-white shadow-lg shadow-[#003366]/20">
//               <Package className="w-5 h-5" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">Products</h1>
//               <p className="text-xs text-gray-400 font-medium">Manage hair care products & inventory</p>
//             </div>
//           </div>
//           <button
//             onClick={() => {
//               resetForm();
//               setIsModalOpen(true);
//             }}
//             className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/25 active:scale-95 cursor-pointer"
//           >
//             <Plus className="w-4 h-4" />
//             Add Product
//           </button>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col min-h-0 m-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

//         <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
//           <div className="w-80">
//             <InputBox
//               inputFor="search"
//               value={searchTerm}
//               handleChangeFunction={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by name or SKU..."
//               icon={<Search className="w-4 h-4" />}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="w-2 h-2 rounded-full bg-emerald-400" />
//             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//               {filteredProducts.length} Products
//             </span>
//           </div>
//         </div>

//         <div className="flex-shrink-0 bg-gray-50/80 border-b border-gray-100">
//           <table className="w-full text-left table-fixed">
//             <thead>
//               <tr className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">
//                 <th className="px-6 py-3">Product</th>
//                 <th className="px-6 py-3">SKU Code</th>
//                 <th className="px-6 py-3">Size</th>
//                 <th className="px-6 py-3">Color</th>
//                 <th className="px-6 py-3">Added On</th>
//                 <th className="px-6 py-3">edit</th>
//               </tr>
//             </thead>
//           </table>
//         </div>

//         <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
//           <table className="w-full text-left table-fixed">

//             <tbody className="divide-y divide-gray-50">
//               {loading ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-20 text-center">
//                     <div className="flex flex-col items-center gap-3">
//                       <Loader2 className="w-7 h-7 animate-spin text-[#003366]" />
//                       <span className="text-gray-400 text-sm font-medium">Loading products...</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredProducts.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-20 text-center">
//                     <div className="flex flex-col items-center gap-2">
//                       <Package className="w-10 h-10 text-gray-200" />
//                       <span className="text-gray-400 font-medium">No products found</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredProducts.map((product, i) => {
//                 const hex = COLOR_SWATCHES.find(s => s.id === product.color)?.hex
//                   ?? (product.color?.startsWith('#') ? product.color : null);
//                 return (
//                   <motion.tr
//                     key={product.id}
//                     initial={{ opacity: 0, y: 6 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.04 }}
//                     className="hover:bg-blue-50/30 transition-colors"
//                   >
//                     {/* Product */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
//                           {product.imageUrl
//                             ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
//                             : <ImageIcon className="w-4 h-4 text-gray-400" />}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
//                           <p className="text-[10px] text-gray-400 font-semibold tracking-tight">
//                             PRD-{product.id.toString().padStart(4, '0')}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* SKU */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-1.5 text-xs font-bold text-[#003366] bg-blue-50 px-2.5 py-1.5 rounded-lg w-fit border border-blue-100">
//                         <Barcode className="w-3 h-3" />
//                         {product.skuCode}
//                       </div>
//                     </td>

//                     {/* Size */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold">
//                         <Layers className="w-3.5 h-3.5 text-gray-300" />
//                         {product.size ? `${product.size} KG` : '—'}
//                       </div>
//                     </td>

//                     {/* Color */}
//                     <td className="px-6 py-4">
//                       {hex ? (
//                         <div className="flex items-center gap-2">
//                           <span
//                             className="w-4 h-4 rounded-full border border-gray-200 shadow-sm flex-shrink-0"
//                             style={{ background: hex }}
//                           />
//                           <span className="text-sm text-gray-600 font-medium">{product.color}</span>
//                         </div>
//                       ) : (
//                         <span className="text-sm text-gray-400">{product.color || '—'}</span>
//                       )}
//                     </td>

//                     {/* Date */}
//                     <td className="px-6 py-4 text-sm text-gray-400 font-medium">
//                       {new Date(product.createdAt).toLocaleDateString('en-GB', {
//                         day: '2-digit', month: 'short', year: 'numeric'
//                       })}
//                     </td>

//                     <td className="px-6 py-4 text-sm text-gray-400 font-medium">
//                       <button
//                         onClick={() => {
//                           setSelectedProductId(product.id);
//                           setIsEditModalOpen(true);
//                         }}
//                         className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition cursor-pointer"
//                       >
//                         <Pencil className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </motion.tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Add Product Modal ── */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsModalOpen(false)}
//               className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.96, y: 16 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.96, y: 16 }}
//               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
//               className="bg-white w-full max-w-lg rounded-[1.75rem] shadow-2xl overflow-visible relative z-10 border border-gray-100"
//             >
//               <div className="px-8 pt-7 pb-5 flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-3 mb-1">
//                     <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center">
//                       <Plus className="w-4 h-4 text-white" />
//                     </div>
//                     <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
//                   </div>
//                   <p className="text-xs text-gray-400 ml-11">Register a new product in the catalog</p>
//                 </div>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>

//               <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8" />

//               <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
//                 {error && (
//                   <div className="p-3.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 flex items-center gap-2.5">
//                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
//                     {error}
//                   </div>
//                 )}

//                 {/* Product Name */}
//                 <InputBox
//                   title="Product Name"
//                   isMandatory
//                   inputFor="name"
//                   value={formData.name}
//                   handleChangeFunction={handleInputChange}
//                   placeholder="e.g. Premium Hair Serum"
//                   icon={<Package className="w-4 h-4" />}
//                 />

//                 {/* SKU + Size */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <InputBox
//                     title="SKU Code"
//                     isMandatory
//                     inputFor="skuCode"
//                     value={formData.skuCode}
//                     handleChangeFunction={handleInputChange}
//                     placeholder="DCS-HS-001"
//                     icon={<Barcode className="w-4 h-4" />}
//                   />
//                   <InputBox
//                     title="Size"
//                     isMandatory
//                     inputFor="size"
//                     type="number"
//                     isDecimalAllowed
//                     value={formData.size}
//                     handleChangeFunction={handleInputChange}
//                     placeholder="e.g. 1"
//                     isSufixOrPrefix="sufix"
//                     measure="KG"
//                     icon={<Layers className="w-4 h-4" />}
//                   />
//                 </div>

//                 {/* Hair Color — CustomSelect with color swatches */}
//                 <CustomSelect
//                   label="Hair Color"
//                   options={COLOR_SWATCHES}
//                   value={formData.color}
//                   onChange={(val) => setFormData(prev => ({ ...prev, color: val }))}
//                   placeholder="Select hair color"
//                   searchable
//                 />

//                 {/* Color preview strip */}
//                 {formData.color && colorHex && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50"
//                   >
//                     <span
//                       className="w-8 h-8 rounded-lg shadow-sm border border-gray-200 flex-shrink-0"
//                       style={{ background: colorHex }}
//                     />
//                     <div>
//                       <p className="text-xs font-bold text-gray-700">{formData.color}</p>
//                       <p className="text-[10px] text-gray-400 font-mono">{colorHex}</p>
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Image URL */}
//                 <InputBox
//                   title="Image URL"
//                   inputFor="imageUrl"
//                   value={formData.imageUrl}
//                   handleChangeFunction={handleInputChange}
//                   placeholder="https://example.com/image.jpg"
//                   icon={<ImageIcon className="w-4 h-4" />}
//                 />

//                 {/* Buttons */}
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     disabled={isSubmitting}
//                     type="submit"
//                     className="flex-[2] bg-[#003366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 cursor-pointer"
//                   >
//                     {isSubmitting
//                       ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
//                       : <><Plus className="w-4 h-4" />Add to Catalog</>}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>




//       <AnimatePresence>
//         {isEditModalOpen && (
//           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsEditModalOpen(false)}
//               className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.96, y: 16 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.96, y: 16 }}
//               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
//               className="bg-white w-full max-w-lg rounded-[1.75rem] shadow-2xl overflow-visible relative z-10 border border-gray-100"
//             >
//               {/* Modal Header */}
//               <div className="px-8 pt-7 pb-5 flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-3 mb-1">
//                     <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center">
//                       <Plus className="w-4 h-4 text-white" />
//                     </div>
//                     <h2 className="text-lg font-bold text-gray-900">Edit Product Details</h2>
//                   </div>
//                   <p className="text-xs text-gray-400 ml-11">Edit a  product Details in the catalog</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setIsEditModalOpen(false);
//                     setSelectedProductId(null);
//                     setFormData({
//                       name: '',
//                       size: '',
//                       color: '',
//                       imageUrl: '',
//                       skuCode: ''
//                     });
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>

//               <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8" />

//               <form onSubmit={handleUpdate} className="px-8 py-6 space-y-4">

//                 {/* Product Name */}
//                 <InputBox
//                   title="Product Name"
//                   isMandatory
//                   inputFor="name"
//                   value={formData.name}
//                   handleChangeFunction={handleInputChange}
//                   placeholder="e.g. Premium Hair Serum"
//                   icon={<Package className="w-4 h-4" />}
//                 />

//                 {/* SKU + Size */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <InputBox
//                     title="SKU Code"
//                     isMandatory
//                     inputFor="skuCode"
//                     value={formData.skuCode}
//                     handleChangeFunction={handleInputChange}
//                     placeholder="DCS-HS-001"
//                     icon={<Barcode className="w-4 h-4" />}
//                   />
//                   <InputBox
//                     title="Size"
//                     isMandatory
//                     inputFor="size"
//                     type="number"
//                     isDecimalAllowed
//                     value={formData.size}
//                     handleChangeFunction={handleInputChange}
//                     placeholder="e.g. 1"
//                     isSufixOrPrefix="sufix"
//                     measure="KG"
//                     icon={<Layers className="w-4 h-4" />}
//                   />
//                 </div>

//                 {/* Hair Color — CustomSelect with color swatches */}
//                 <CustomSelect
//                   label="Hair Color"
//                   options={COLOR_SWATCHES}
//                   value={formData.color}
//                   onChange={(val) => setFormData(prev => ({ ...prev, color: val }))}
//                   placeholder="Select hair color"
//                   searchable
//                 />

//                 {/* Color preview strip */}
//                 {formData.color && colorHex && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50"
//                   >
//                     <span
//                       className="w-8 h-8 rounded-lg shadow-sm border border-gray-200 flex-shrink-0"
//                       style={{ background: colorHex }}
//                     />
//                     <div>
//                       <p className="text-xs font-bold text-gray-700">{formData.color}</p>
//                       <p className="text-[10px] text-gray-400 font-mono">{colorHex}</p>
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Image URL */}
//                 <InputBox
//                   title="Image URL"
//                   inputFor="imageUrl"
//                   value={formData.imageUrl}
//                   handleChangeFunction={handleInputChange}
//                   placeholder="https://example.com/image.jpg"
//                   icon={<ImageIcon className="w-4 h-4" />}
//                 />



//                 {/* Buttons */}
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditModalOpen(false);
//                       setSelectedProductId(null);
//                       setFormData({
//                         name: '',
//                         size: '',
//                         color: '',
//                         imageUrl: '',
//                         skuCode: ''
//                       });
//                     }}
//                     className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     disabled={isSubmitting}
//                     type="submit"
//                     className="flex-[2] bg-[#003366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 cursor-pointer"
//                   >
//                     {isSubmitting
//                       ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
//                       : <><Plus className="w-4 h-4" />Update</>}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



import React, { useState, useEffect, useCallback } from 'react';
import {
  Package, Search, Plus, X, Loader2,
  Image as ImageIcon, Barcode, Pencil, Palette, Ruler
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InputBox from '../components/inputBox';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';
import {
  useCreateProductMutation,
  useGetProductByIdMutation,
  useGetProductMutation,
  useUpdateProductMutation,
  useCreatesizeColorMutation,
} from './productApi/ProductApiSlice';

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_PRODUCT_FORM = { name: '', imageUrl: '', skuCode: '' };

const INITIAL_SIZE_COLOR_FORM = { color: '', size: '' };

// ─── Sub-components ───────────────────────────────────────────────────────────

function ModalShell({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // onClick={onClose}
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="bg-white w-full max-w-lg rounded-[1.75rem] shadow-2xl relative z-10 border border-gray-100"
      >
        {children}
      </motion.div>
    </div>
  );
}

function ModalHeader({ icon: Icon, title, subtitle, onClose }) {
  return (
    <>
      <div className="px-8 pt-7 pb-5 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          </div>
          <p className="text-xs text-gray-400 ml-11">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8" />
    </>
  );
}

function ModalActions({ onCancel, isSubmitting, submitLabel }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-[2] bg-[#003366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 cursor-pointer"
      >
        {isSubmitting
          ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
          : <><Plus className="w-4 h-4" />{submitLabel}</>}
      </button>
    </div>
  );
}

// ─── Color & Size Tag Input ────────────────────────────────────────────────────

function TagInput({ label, icon: Icon, placeholder, tags, onAdd, onRemove, tagColorClass }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      const val = inputValue.trim();
      if (!tags.includes(val)) onAdd(val);
      setInputValue('');
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      const val = inputValue.trim();
      if (!tags.includes(val)) onAdd(val);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>

      {/* Tag pills */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${tagColorClass}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="hover:opacity-70 transition-opacity cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-[#003366] focus-within:ring-2 focus-within:ring-[#003366]/10 transition-all">
        <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none font-medium"
        />
      </div>
      <p className="text-[10px] text-gray-400 font-medium pl-1">
        Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">Enter</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">,</kbd> to add
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal visibility
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    sizeColor: false,
  });

  const openModal = (key) => setModals((prev) => ({ ...prev, [key]: true }));
  const closeModal = (key) => setModals((prev) => ({ ...prev, [key]: false }));

  // Forms
  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM);
  const [sizeColorForm, setSizeColorForm] = useState({
    colors: [],
    sizes: [],
  });
  const [selectedProductId, setSelectedProductId] = useState(null);

  // API hooks
  const [getProduct, { isLoading }] = useGetProductMutation();
  const [getProductById] = useGetProductByIdMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [createsizeColor, { isLoading: isSavingSizeColor }] = useCreatesizeColorMutation();

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProduct().unwrap();
      if (res?.success) {
        setProducts(res.data);
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to fetch products');
    }
  }, [getProduct]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const fetchProductById = useCallback(async () => {
    if (!selectedProductId) return;
    try {
      const res = await getProductById(selectedProductId).unwrap();
      if (res?.success) {
        setProductForm({
          name: res.data.name || '',
          imageUrl: res.data.imageUrl || '',
          skuCode: res.data.skuCode || '',
        });
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to fetch product details');
    }
  }, [selectedProductId, getProductById]);

  useEffect(() => {
    if (modals.edit && selectedProductId) fetchProductById();
  }, [modals.edit, selectedProductId, fetchProductById]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateProductForm = () => {
    if (!productForm.name.trim()) { toast.error('Product name is required'); return false; }
    if (!productForm.skuCode.trim()) { toast.error('SKU Code is required'); return false; }
    return true;
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;
    try {
      const res = await createProduct(productForm).unwrap();
      if (res?.success) {
        toast.success(res?.message || 'Product created successfully');
        closeModal('add');
        setProductForm(INITIAL_PRODUCT_FORM);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;
    try {
      const res = await updateProduct({ id: selectedProductId, body: productForm }).unwrap();
      if (res?.success) {
        toast.success(res?.message || 'Product updated successfully');
        closeModal('edit');
        setSelectedProductId(null);
        setProductForm(INITIAL_PRODUCT_FORM);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to update product');
    }
  };

  const validateSizeColorForm = () => {
    if (sizeColorForm.colors.length === 0 && sizeColorForm.sizes.length === 0) { toast.error('Add at least one color or size'); return false; }
    return true;
  };

  const handleCreateSizeColor = async (e) => {
    e.preventDefault();
    if (!validateSizeColorForm()) return;
    try {
      const res = await createsizeColor(sizeColorForm).unwrap();
      if (res?.success) {
        toast.success(res?.message || 'Colors & sizes saved successfully');
        closeModal('sizeColor');
        setSizeColorForm({ colors: [], sizes: [] });
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to save colors & sizes');
    }
  };

  // Tag helpers
  const addColor = (val) => setSizeColorForm((p) => ({ ...p, colors: [...p.colors, val] }));
  const removeColor = (val) => setSizeColorForm((p) => ({ ...p, colors: p.colors.filter((c) => c !== val) }));
  const addSize = (val) => setSizeColorForm((p) => ({ ...p, sizes: [...p.sizes, val] }));
  const removeSize = (val) => setSizeColorForm((p) => ({ ...p, sizes: p.sizes.filter((s) => s !== val) }));

  const handleEditClick = (product) => {
    setSelectedProductId(product.id);
    openModal('edit');
  };

  const handleCloseEdit = () => {
    closeModal('edit');
    setSelectedProductId(null);
    setProductForm(INITIAL_PRODUCT_FORM);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.skuCode.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="h-screen flex flex-col bg-[#f5f7fa]">

      {/* Top Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#003366] flex items-center justify-center text-white shadow-lg shadow-[#003366]/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">Products</h1>
              <p className="text-xs text-gray-400 font-medium">Manage hair care products & inventory</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setSizeColorForm({ colors: [], sizes: [] }); openModal('sizeColor'); }}
              className="bg-white text-[#003366] px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all border border-[#003366]/20 shadow-sm active:scale-95 cursor-pointer"
            >
              <Palette className="w-4 h-4" />
              ADD Color & Size
            </button>
            <button
              onClick={() => { setProductForm(INITIAL_PRODUCT_FORM); openModal('add'); }}
              className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/25 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 flex flex-col min-h-0 m-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Search Bar */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
          <div className="w-80">
            <InputBox
              inputFor="search"
              value={searchTerm}
              handleChangeFunction={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or SKU..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {filteredProducts.length} Products
            </span>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex-shrink-0 bg-gray-50/80 border-b border-gray-100">
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                <th className="px-6 py-3 ">Product</th>
                <th className="px-6 py-3">SKU Code</th>
                <th className="px-6 py-3">Added On</th>
                <th className="px-6 py-3">Edit</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
          <table className="w-full text-left table-fixed">
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-7 h-7 animate-spin text-[#003366]" />
                      <span className="text-gray-400 text-sm font-medium">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-10 h-10 text-gray-200" />
                      <span className="text-gray-400 font-medium">No products found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                          {product.imageUrl
                            ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            : <ImageIcon className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold tracking-tight">
                            PRD-{product.id.toString().padStart(4, '0')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 ">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#003366] bg-blue-50 px-2.5 py-1.5 rounded-lg w-fit border border-blue-100">
                        <Barcode className="w-3 h-3" />
                        {product.skuCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {new Date(product.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Product Modal ── */}
      <AnimatePresence>
        {modals.add && (
          <ModalShell onClose={() => closeModal('add')}>
            <ModalHeader
              icon={Plus}
              title="Add New Product"
              subtitle="Register a new product in the catalog"
              onClose={() => closeModal('add')}
            />
            <form onSubmit={handleCreateProduct} className="px-8 py-6 space-y-4">
              <InputBox
                title="Product Name" isMandatory inputFor="name"
                value={productForm.name} handleChangeFunction={handleProductFormChange}
                placeholder="e.g. Premium Hair Serum" icon={<Package className="w-4 h-4" />}
              />
              <InputBox
                title="SKU Code" isMandatory inputFor="skuCode"
                value={productForm.skuCode} handleChangeFunction={handleProductFormChange}
                placeholder="DCS-HS-001" icon={<Barcode className="w-4 h-4" />}
              />
              <InputBox
                title="Image URL" inputFor="imageUrl"
                value={productForm.imageUrl} handleChangeFunction={handleProductFormChange}
                placeholder="https://example.com/image.jpg" icon={<ImageIcon className="w-4 h-4" />}
              />
              <ModalActions
                onCancel={() => closeModal('add')}
                isSubmitting={isCreating}
                submitLabel="Add to Catalog"
              />
            </form>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ── Edit Product Modal ── */}
      <AnimatePresence>
        {modals.edit && (
          <ModalShell onClose={handleCloseEdit}>
            <ModalHeader
              icon={Pencil}
              title="Edit Product Details"
              subtitle="Update product information in the catalog"
              onClose={handleCloseEdit}
            />
            <form onSubmit={handleUpdateProduct} className="px-8 py-6 space-y-4">
              <InputBox
                title="Product Name" isMandatory inputFor="name"
                value={productForm.name} handleChangeFunction={handleProductFormChange}
                placeholder="e.g. Premium Hair Serum" icon={<Package className="w-4 h-4" />}
              />
              <InputBox
                title="SKU Code" isMandatory inputFor="skuCode"
                value={productForm.skuCode} handleChangeFunction={handleProductFormChange}
                placeholder="DCS-HS-001" icon={<Barcode className="w-4 h-4" />}
              />
              <InputBox
                title="Image URL" inputFor="imageUrl"
                value={productForm.imageUrl} handleChangeFunction={handleProductFormChange}
                placeholder="https://example.com/image.jpg" icon={<ImageIcon className="w-4 h-4" />}
              />
              <ModalActions
                onCancel={handleCloseEdit}
                isSubmitting={isUpdating}
                submitLabel="Save Changes"
              />
            </form>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ── Color & Size Modal ── */}
      <AnimatePresence>
        {modals.sizeColor && (
          <ModalShell onClose={() => closeModal('sizeColor')}>
            <ModalHeader
              icon={Palette}
              title="Add Colors & Sizes"
              subtitle="Define available variants for your catalog"
              onClose={() => closeModal('sizeColor')}
            />
            <form onSubmit={handleCreateSizeColor} className="px-8 py-6 space-y-5">
              <TagInput
                label="Colors"
                icon={Palette}
                placeholder='Type a color and press Enter…'
                tags={sizeColorForm.colors}
                onAdd={addColor}
                onRemove={removeColor}
                tagColorClass="bg-purple-50 text-purple-700 border border-purple-100"
              />
              <TagInput
                label="Sizes"
                icon={Ruler}
                placeholder='Type a size and press Enter…'
                tags={sizeColorForm.sizes}
                onAdd={addSize}
                onRemove={removeSize}
                tagColorClass="bg-blue-50 text-[#003366] border border-blue-100"
              />
              <ModalActions
                onCancel={() => closeModal('sizeColor')}
                isSubmitting={isSavingSizeColor}
                submitLabel="Save Variants"
              />
            </form>
          </ModalShell>
        )}
      </AnimatePresence>
    </div>
  );
}



// import React, { useState, useEffect } from 'react';
// import { Package, Search, Plus, X, Loader2, Image as ImageIcon, Barcode, Layers, Pencil } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import InputBox from '../components/inputBox';
// import api from '../utils/api';
// import CustomSelect from '../components/CustomSelect';
// import toast from 'react-hot-toast';
// import { useCreateProductMutation, useGetProductByIdMutation, useGetProductMutation, useUpdateProductMutation, useCreatesizeColorMutation } from './productApi/ProductApiSlice';



// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [issizeColorModel, setIssizeColorModel] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [getProduct, { isLoading }] = useGetProductMutation();
//   const [getProductById] = useGetProductByIdMutation();
//   const [createProduct, { isSubmitting }] = useCreateProductMutation();
//   const [updateProduct] = useUpdateProductMutation();
//   const [createsizeColor] = useCreatesizeColorMutation();

//   const [formData, setFormData] = useState({
//     name: '', imageUrl: '', skuCode: ''
//   });

//   const initialFormState = {
//     name: '',
//     imageUrl: '',
//     skuCode: ''
//   };

//   const resetForm = () => {
//     setFormData(initialFormState);
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await getProduct().unwrap();
//       if (res?.success) {
//         setProducts(res.data);
//         toast.success(res?.message || "fetch product successfully")
//       }
//     } catch (err) {
//       console.error('Error fetching products:', err.message);
//       toast.error(err.message || err.data?.message || 'Error fetching products:')
//     }
//   };

//   useEffect(() => { fetchProducts(); }, []);


//   const fetchProductById = async () => {
//     try {
//       const res = await getProductById(selectedProductId).unwrap();
//       if (res?.success) {
//         setFormData({
//           name: res.data.name || '',
//           imageUrl: res.data.imageUrl || '',
//           skuCode: res.data.skuCode || ''
//         });
//       }
//     } catch (err) {
//       console.error('Error fetching product details:', err.message);
//       toast.error(err?.data?.message || err.message || 'Error fetching product details');
//     }
//   };

//   useEffect(() => {
//     if (isEditModalOpen && selectedProductId) {
//       fetchProductById();
//     }
//   }, [isEditModalOpen, selectedProductId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };


//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       toast.error('Product name is required');
//       return false;
//     }

//     if (!formData.skuCode.trim()) {
//       toast.error('SKU Code is required');
//       return false;
//     }



//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     try {
//       const res = await createProduct(formData).unwrap();
//       if (res?.success) {
//         toast.success(res?.message || 'create product successfully')
//         setIsModalOpen(false);
//         setFormData({ name: '', imageUrl: '', skuCode: '' });
//         fetchProducts();
//       }
//     } catch (err) {
//       console.error('fail to create product', err.message);
//       toast.error(err?.message || err.data?.message || 'Failed to add product')
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     try {
//       const id = selectedProductId;
//       const res = await updateProduct({ id, body: formData }).unwrap();

//       if (res?.success) {
//         setIsEditModalOpen(false);
//         setSelectedProductId(null);
//         setFormData({
//           name: '',
//           imageUrl: '',
//           skuCode: ''
//         });
//         fetchProducts();
//       }

//     } catch (err) {
//       toast.error(err.data?.message || err.message || 'Failed to update product')
//     }
//   };

//   const handleAddcolorSize = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await createsizeColor(body).unwrap();
//     } catch (error) {

//     }
//   }

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.skuCode.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="h-screen flex flex-col bg-[#f5f7fa]">

//       {/* ── Top Bar ── */}
//       <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-20">
//         <div className="px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-11 h-11 rounded-xl bg-[#003366] flex items-center justify-center text-white shadow-lg shadow-[#003366]/20">
//               <Package className="w-5 h-5" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">Products</h1>
//               <p className="text-xs text-gray-400 font-medium">Manage hair care products & inventory</p>
//             </div>
//           </div>


//           <div className='flex gap-4'>
//             <button
//               onClick={() => {
//                 // resetForm();
//                 setIssizeColorModel(true);
//               }}
//               className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/25 active:scale-95 cursor-pointer"
//             >
//               <Plus className="w-4 h-4" />
//               Add color & Size
//             </button>

//             <button
//               onClick={() => {
//                 resetForm();
//                 setIsModalOpen(true);
//               }}
//               className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/25 active:scale-95 cursor-pointer"
//             >
//               <Plus className="w-4 h-4" />
//               Add Product
//             </button>

//           </div>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col min-h-0 m-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

//         <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
//           <div className="w-80">
//             <InputBox
//               inputFor="search"
//               value={searchTerm}
//               handleChangeFunction={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by name or SKU..."
//               icon={<Search className="w-4 h-4" />}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="w-2 h-2 rounded-full bg-emerald-400" />
//             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//               {filteredProducts.length} Products
//             </span>
//           </div>
//         </div>

//         <div className="flex-shrink-0 bg-gray-50/80 border-b border-gray-100">
//           <table className="w-full text-left table-fixed">
//             <thead>
//               <tr className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">
//                 <th className="px-6 py-3">Product</th>
//                 <th className="px-6 py-3">SKU Code</th>
//                 <th className="px-6 py-3">Added On</th>
//                 <th className="px-6 py-3">edit</th>
//               </tr>
//             </thead>
//           </table>
//         </div>

//         <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
//           <table className="w-full text-left table-fixed">

//             <tbody className="divide-y divide-gray-50">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-20 text-center">
//                     <div className="flex flex-col items-center gap-3">
//                       <Loader2 className="w-7 h-7 animate-spin text-[#003366]" />
//                       <span className="text-gray-400 text-sm font-medium">Loading products...</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredProducts.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-20 text-center">
//                     <div className="flex flex-col items-center gap-2">
//                       <Package className="w-10 h-10 text-gray-200" />
//                       <span className="text-gray-400 font-medium">No products found</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredProducts.map((product, i) => {

//                 return (
//                   <motion.tr
//                     key={product.id}
//                     initial={{ opacity: 0, y: 6 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.04 }}
//                     className="hover:bg-blue-50/30 transition-colors"
//                   >
//                     {/* Product */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
//                           {product.imageUrl
//                             ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
//                             : <ImageIcon className="w-4 h-4 text-gray-400" />}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
//                           <p className="text-[10px] text-gray-400 font-semibold tracking-tight">
//                             PRD-{product.id.toString().padStart(4, '0')}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* SKU */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-1.5 text-xs font-bold text-[#003366] bg-blue-50 px-2.5 py-1.5 rounded-lg w-fit border border-blue-100">
//                         <Barcode className="w-3 h-3" />
//                         {product.skuCode}
//                       </div>
//                     </td>





//                     {/* Date */}
//                     <td className="px-6 py-4 text-sm text-gray-400 font-medium">
//                       {new Date(product.createdAt).toLocaleDateString('en-GB', {
//                         day: '2-digit', month: 'short', year: 'numeric'
//                       })}
//                     </td>

//                     <td className="px-6 py-4 text-sm text-gray-400 font-medium">
//                       <button
//                         onClick={() => {
//                           setSelectedProductId(product.id);
//                           setIsEditModalOpen(true);
//                         }}
//                         className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition cursor-pointer"
//                       >
//                         <Pencil className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </motion.tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Add Product Modal ── */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsModalOpen(false)}
//               className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.96, y: 16 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.96, y: 16 }}
//               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
//               className="bg-white w-full max-w-lg rounded-[1.75rem] shadow-2xl overflow-visible relative z-10 border border-gray-100"
//             >
//               <div className="px-8 pt-7 pb-5 flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-3 mb-1">
//                     <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center">
//                       <Plus className="w-4 h-4 text-white" />
//                     </div>
//                     <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
//                   </div>
//                   <p className="text-xs text-gray-400 ml-11">Register a new product in the catalog</p>
//                 </div>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>

//               <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8" />

//               <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">

//                 {/* Product Name */}
//                 <InputBox
//                   title="Product Name"
//                   isMandatory
//                   inputFor="name"
//                   value={formData.name}
//                   handleChangeFunction={handleInputChange}
//                   placeholder="e.g. Premium Hair Serum"
//                   icon={<Package className="w-4 h-4" />}
//                 />

//                 {/* SKU + Size */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <InputBox
//                     title="SKU Code"
//                     isMandatory
//                     inputFor="skuCode"
//                     value={formData.skuCode}
//                     handleChangeFunction={handleInputChange}
//                     placeholder="DCS-HS-001"
//                     icon={<Barcode className="w-4 h-4" />}
//                   />
//                 </div>


//                 {/* Image URL */}
//                 <InputBox
//                   title="Image URL"
//                   inputFor="imageUrl"
//                   value={formData.imageUrl}
//                   handleChangeFunction={handleInputChange}
//                   placeholder="https://example.com/image.jpg"
//                   icon={<ImageIcon className="w-4 h-4" />}
//                 />

//                 {/* Buttons */}
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     disabled={isSubmitting}
//                     type="submit"
//                     className="flex-[2] bg-[#003366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 cursor-pointer"
//                   >
//                     {isSubmitting
//                       ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
//                       : <><Plus className="w-4 h-4" />Add to Catalog</>}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>




//       <AnimatePresence>
//         {isEditModalOpen && (
//           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsEditModalOpen(false)}
//               className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.96, y: 16 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.96, y: 16 }}
//               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
//               className="bg-white w-full max-w-lg rounded-[1.75rem] shadow-2xl overflow-visible relative z-10 border border-gray-100"
//             >
//               {/* Modal Header */}
//               <div className="px-8 pt-7 pb-5 flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-3 mb-1">
//                     <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center">
//                       <Plus className="w-4 h-4 text-white" />
//                     </div>
//                     <h2 className="text-lg font-bold text-gray-900">Edit Product Details</h2>
//                   </div>
//                   <p className="text-xs text-gray-400 ml-11">Edit a  product Details in the catalog</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setIsEditModalOpen(false);
//                     setSelectedProductId(null);
//                     setFormData({
//                       name: '',
//                       imageUrl: '',
//                       skuCode: ''
//                     });
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>

//               <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8" />

//               <form onSubmit={handleUpdate} className="px-8 py-6 space-y-4">

//                 {/* Product Name */}
//                 <InputBox
//                   title="Product Name"
//                   isMandatory
//                   inputFor="name"
//                   value={formData.name}
//                   handleChangeFunction={handleInputChange}
//                   placeholder="e.g. Premium Hair Serum"
//                   icon={<Package className="w-4 h-4" />}
//                 />

//                 {/* SKU + Size */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <InputBox
//                     title="SKU Code"
//                     isMandatory
//                     inputFor="skuCode"
//                     value={formData.skuCode}
//                     handleChangeFunction={handleInputChange}
//                     placeholder="DCS-HS-001"
//                     icon={<Barcode className="w-4 h-4" />}
//                   />

//                 </div>



//                 {/* Image URL */}
//                 <InputBox
//                   title="Image URL"
//                   inputFor="imageUrl"
//                   value={formData.imageUrl}
//                   handleChangeFunction={handleInputChange}
//                   placeholder="https://example.com/image.jpg"
//                   icon={<ImageIcon className="w-4 h-4" />}
//                 />



//                 {/* Buttons */}
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditModalOpen(false);
//                       setSelectedProductId(null);
//                       setFormData({
//                         name: '',
//                         imageUrl: '',
//                         skuCode: ''
//                       });
//                     }}
//                     className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     disabled={isSubmitting}
//                     type="submit"
//                     className="flex-[2] bg-[#003366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 cursor-pointer"
//                   >
//                     {isSubmitting
//                       ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
//                       : <><Plus className="w-4 h-4" />Update</>}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>



//       <AnimatePresence>
//         {issizeColorModel && (
//           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.96, y: 16 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.96, y: 16 }}
//               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
//               className="bg-white w-full max-w-lg rounded-[1.75rem] shadow-2xl overflow-visible relative z-10 border border-gray-100"
//             >
//               {/* Modal Header */}
//               <div className="px-8 pt-7 pb-5 flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-3 mb-1">
//                     <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center">
//                       <Plus className="w-4 h-4 text-white" />
//                     </div>
//                     <h2 className="text-lg font-bold text-gray-900">Add Color & Size Product Details</h2>
//                   </div>
//                   <p className="text-xs text-gray-400 ml-11">product Details in the catalog</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setIssizeColorModel(false);
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>

//               <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8" />

//               <form onSubmit={handleUpdate} className="px-8 py-6 space-y-4">

//                 {/* Product Name */}
//                 <InputBox
//                   title="color"
//                   isMandatory
//                   inputFor="name"
//                   value={formData.name}
//                   handleChangeFunction={handleInputChange}
//                   placeholder="e.g. Premium Hair Serum"
//                   icon={<Package className="w-4 h-4" />}
//                 />

//                 {/* SKU + Size */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <InputBox
//                     title="size"
//                     isMandatory
//                     inputFor="skuCode"
//                     value={formData.skuCode}
//                     handleChangeFunction={handleInputChange}
//                     placeholder="DCS-HS-001"
//                     icon={<Barcode className="w-4 h-4" />}
//                   />

//                 </div>






//                 {/* Buttons */}
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIssizeColorModel(false);

//                     }}
//                     className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     disabled={isSubmitting}
//                     type="submit"
//                     className="flex-[2] bg-[#003366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 cursor-pointer"
//                   >
//                     {isSubmitting
//                       ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
//                       : <><Plus className="w-4 h-4" />Add</>}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
