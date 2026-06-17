

import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, X, Loader2, Image as ImageIcon, Barcode, Layers, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InputBox from '../components/inputBox';
import api from '../utils/api';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

const COLOR_SWATCHES = [
  { id: 'Black', name: 'Black', hex: '#1a1a1a' },
  { id: 'Brown', name: 'Brown', hex: '#7B4F2E' },
  { id: 'Dark Brown', name: 'Dark Brown', hex: '#3B1F0A' },
  { id: 'Auburn', name: 'Auburn', hex: '#A0522D' },
  { id: 'Copper', name: 'Copper', hex: '#aa6626' },
  { id: 'Red', name: 'Red', hex: '#C0392B' },
  { id: 'Blonde', name: 'Blonde', hex: '#F5DEB3' },
  { id: 'Ash Blonde', name: 'Ash Blonde', hex: '#D4C5A9' },
  { id: 'Platinum', name: 'Platinum', hex: '#E8E0D0' },
  { id: 'Silver', name: 'Silver', hex: '#9E9E9E' },
  { id: 'Grey', name: 'Grey', hex: '#6B6B6B' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '', size: '', color: '', imageUrl: '', skuCode: ''
  });

  const initialFormState = {
    name: '',
    size: '',
    color: '',
    imageUrl: '',
    skuCode: ''
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setError('');
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.post('/products/get');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Error fetching products:', err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);



  const fetchProductById = async () => {
    try {
      const res = await api.get(`/products/${selectedProductId}`);
      setFormData({
        name: res.data.name || '',
        size: res.data.size || '',
        color: res.data.color || '',
        imageUrl: res.data.imageUrl || '',
        skuCode: res.data.skuCode || ''
      });
    } catch (err) {
      console.error('Error fetching product details:', err);
      toast.error(err.response?.data?.error || 'Error fetching product details');
    }
  };

  useEffect(() => {
    if (isEditModalOpen && selectedProductId) {
      fetchProductById();
    }
  }, [isEditModalOpen, selectedProductId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }

    if (!formData.skuCode.trim()) {
      toast.error('SKU Code is required');
      return false;
    }

    if (!formData.color) {
      toast.error('Please select a hair color');
      return false;
    }
    if (!formData.size) {
      toast.error('Size is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/products/create', formData);
      setIsModalOpen(false);
      setFormData({ name: '', size: '', color: '', imageUrl: '', skuCode: '' });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add product. Please check if SKU is unique.')
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await api.post(`/products/update/${selectedProductId}`, formData);

      setIsEditModalOpen(false);
      setSelectedProductId(null);

      setFormData({
        name: '',
        size: '',
        color: '',
        imageUrl: '',
        skuCode: ''
      });

      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update product')
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorHex = COLOR_SWATCHES.find(s => s.id === formData.color)?.hex ?? null;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.skuCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-[#f5f7fa]">

      {/* ── Top Bar ── */}
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
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/25 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 m-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

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

        <div className="flex-shrink-0 bg-gray-50/80 border-b border-gray-100">
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU Code</th>
                <th className="px-6 py-3">Size</th>
                <th className="px-6 py-3">Color</th>
                <th className="px-6 py-3">Added On</th>
                <th className="px-6 py-3">edit</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
          <table className="w-full text-left table-fixed">

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-7 h-7 animate-spin text-[#003366]" />
                      <span className="text-gray-400 text-sm font-medium">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-10 h-10 text-gray-200" />
                      <span className="text-gray-400 font-medium">No products found</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.map((product, i) => {
                const hex = COLOR_SWATCHES.find(s => s.id === product.color)?.hex
                  ?? (product.color?.startsWith('#') ? product.color : null);
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    {/* Product */}
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

                    {/* SKU */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#003366] bg-blue-50 px-2.5 py-1.5 rounded-lg w-fit border border-blue-100">
                        <Barcode className="w-3 h-3" />
                        {product.skuCode}
                      </div>
                    </td>

                    {/* Size */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-gray-300" />
                        {product.size ? `${product.size} KG` : '—'}
                      </div>
                    </td>

                    {/* Color */}
                    <td className="px-6 py-4">
                      {hex ? (
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-200 shadow-sm flex-shrink-0"
                            style={{ background: hex }}
                          />
                          <span className="text-sm text-gray-600 font-medium">{product.color}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">{product.color || '—'}</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {new Date(product.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      <button
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Product Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white w-full max-w-lg rounded-[1.75rem] shadow-2xl overflow-visible relative z-10 border border-gray-100"
            >
              <div className="px-8 pt-7 pb-5 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
                  </div>
                  <p className="text-xs text-gray-400 ml-11">Register a new product in the catalog</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8" />

              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Product Name */}
                <InputBox
                  title="Product Name"
                  isMandatory
                  inputFor="name"
                  value={formData.name}
                  handleChangeFunction={handleInputChange}
                  placeholder="e.g. Premium Hair Serum"
                  icon={<Package className="w-4 h-4" />}
                />

                {/* SKU + Size */}
                <div className="grid grid-cols-2 gap-4">
                  <InputBox
                    title="SKU Code"
                    isMandatory
                    inputFor="skuCode"
                    value={formData.skuCode}
                    handleChangeFunction={handleInputChange}
                    placeholder="DCS-HS-001"
                    icon={<Barcode className="w-4 h-4" />}
                  />
                  <InputBox
                    title="Size"
                    isMandatory
                    inputFor="size"
                    type="number"
                    isDecimalAllowed
                    value={formData.size}
                    handleChangeFunction={handleInputChange}
                    placeholder="e.g. 1"
                    isSufixOrPrefix="sufix"
                    measure="KG"
                    icon={<Layers className="w-4 h-4" />}
                  />
                </div>

                {/* Hair Color — CustomSelect with color swatches */}
                <CustomSelect
                  label="Hair Color"
                  options={COLOR_SWATCHES}
                  value={formData.color}
                  onChange={(val) => setFormData(prev => ({ ...prev, color: val }))}
                  placeholder="Select hair color"
                  searchable
                />

                {/* Color preview strip */}
                {formData.color && colorHex && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50"
                  >
                    <span
                      className="w-8 h-8 rounded-lg shadow-sm border border-gray-200 flex-shrink-0"
                      style={{ background: colorHex }}
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-700">{formData.color}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{colorHex}</p>
                    </div>
                  </motion.div>
                )}

                {/* Image URL */}
                <InputBox
                  title="Image URL"
                  inputFor="imageUrl"
                  value={formData.imageUrl}
                  handleChangeFunction={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  icon={<ImageIcon className="w-4 h-4" />}
                />

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex-[2] bg-[#003366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 cursor-pointer"
                  >
                    {isSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                      : <><Plus className="w-4 h-4" />Add to Catalog</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>




      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white w-full max-w-lg rounded-[1.75rem] shadow-2xl overflow-visible relative z-10 border border-gray-100"
            >
              {/* Modal Header */}
              <div className="px-8 pt-7 pb-5 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Edit Product Details</h2>
                  </div>
                  <p className="text-xs text-gray-400 ml-11">Edit a  product Details in the catalog</p>
                </div>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedProductId(null);
                    setFormData({
                      name: '',
                      size: '',
                      color: '',
                      imageUrl: '',
                      skuCode: ''
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8" />

              <form onSubmit={handleUpdate} className="px-8 py-6 space-y-4">

                {/* Product Name */}
                <InputBox
                  title="Product Name"
                  isMandatory
                  inputFor="name"
                  value={formData.name}
                  handleChangeFunction={handleInputChange}
                  placeholder="e.g. Premium Hair Serum"
                  icon={<Package className="w-4 h-4" />}
                />

                {/* SKU + Size */}
                <div className="grid grid-cols-2 gap-4">
                  <InputBox
                    title="SKU Code"
                    isMandatory
                    inputFor="skuCode"
                    value={formData.skuCode}
                    handleChangeFunction={handleInputChange}
                    placeholder="DCS-HS-001"
                    icon={<Barcode className="w-4 h-4" />}
                  />
                  <InputBox
                    title="Size"
                    isMandatory
                    inputFor="size"
                    type="number"
                    isDecimalAllowed
                    value={formData.size}
                    handleChangeFunction={handleInputChange}
                    placeholder="e.g. 1"
                    isSufixOrPrefix="sufix"
                    measure="KG"
                    icon={<Layers className="w-4 h-4" />}
                  />
                </div>

                {/* Hair Color — CustomSelect with color swatches */}
                <CustomSelect
                  label="Hair Color"
                  options={COLOR_SWATCHES}
                  value={formData.color}
                  onChange={(val) => setFormData(prev => ({ ...prev, color: val }))}
                  placeholder="Select hair color"
                  searchable
                />

                {/* Color preview strip */}
                {formData.color && colorHex && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50"
                  >
                    <span
                      className="w-8 h-8 rounded-lg shadow-sm border border-gray-200 flex-shrink-0"
                      style={{ background: colorHex }}
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-700">{formData.color}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{colorHex}</p>
                    </div>
                  </motion.div>
                )}

                {/* Image URL */}
                <InputBox
                  title="Image URL"
                  inputFor="imageUrl"
                  value={formData.imageUrl}
                  handleChangeFunction={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  icon={<ImageIcon className="w-4 h-4" />}
                />



                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedProductId(null);
                      setFormData({
                        name: '',
                        size: '',
                        color: '',
                        imageUrl: '',
                        skuCode: ''
                      });
                    }}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex-[2] bg-[#003366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 cursor-pointer"
                  >
                    {isSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                      : <><Plus className="w-4 h-4" />Update</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


