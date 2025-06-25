import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useListProduct } from '../../shared/hooks/useListProduct';
import { Footer } from '../footer/Footer';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { Edit, Trash2, X, List, Grid, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';

export const ListProduct = () => {
  const navigate = useNavigate();
  const {
    products,
    isLoading,
    isDeleting,
    isUpdating,
    isUpdatingImage,
    fetchProducts,
    removeProduct,
    editProduct,
    editProductImage
  } = useListProduct();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageUpdateModalOpen, setImageUpdateModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  

  const [currentProduct, setCurrentProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imageProduct: ''
  });

 
  const [maxPrice, setMaxPrice] = useState(18000);
  const [minPriceFilter, setMinPriceFilter] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(18000);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('table');


  const handleMinPriceFilterChange = (e) => {
    const value = Number(e.target.value);
    setMinPriceFilter(value);
    if (value > maxPriceFilter) {
      setMaxPriceFilter(value);
    }
  };


  const handleMaxPriceFilterChange = (e) => {
    const value = Number(e.target.value);
    setMaxPriceFilter(value);
    if (value < minPriceFilter) {
      setMinPriceFilter(value);
    }
  };

 
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProducts = products
    .filter((producto) => {
      const matchesSearch = [producto.nombre, producto.descripcion]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesPrice = producto.precio >= minPriceFilter && producto.precio <= maxPriceFilter;
      
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let comparison = 0;
      
      if (sortField === 'precio') {
        comparison = a.precio - b.precio;
      } else if (sortField === 'nombre') {
        comparison = a.nombre?.localeCompare(b.nombre);
      } else if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortField === 'updatedAt') {
        comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleImagePreview = (product) => {
    setSelectedProduct(product);
    setImageModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    document.body.style.overflow = 'auto';
  };
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await editProduct(currentProduct._id || currentProduct.id, currentProduct);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const handleDelete = (product) => {
    setCurrentProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await removeProduct(currentProduct._id || currentProduct.id);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateImage = (product) => {
    setCurrentProduct(product);
    setImageUpdateModalOpen(true);
  };

  const confirmUpdateImage = async () => {
    if (!selectedImage) return;
    
    try {
      await editProductImage(currentProduct._id || currentProduct.id, selectedImage);
      setImageUpdateModalOpen(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error al actualizar imagen:', error);
    }
  };

  const handleAddProduct = () => {
    navigate('/product');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'cards' : 'table');
  };

  return (
    <div>
      <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">

          <h2 className="text-3xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wide">
            Lista de Productos
          </h2>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative max-w-md w-full">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                ></path>
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                className="w-full pl-10 p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleViewMode}
                className="p-2 bg-[#1e293b] rounded-lg hover:bg-[#334155] transition-colors"
                title={viewMode === 'table' ? 'Vista de tarjetas' : 'Vista de tabla'}
              >
                {viewMode === 'table' ? <Grid size={20} /> : <List size={20} />}
              </button>
              
              <button 
                className="bg-[#9AF241] text-gray-900 hover:bg-[#b9fc60] transition-all px-4 py-3 rounded-md font-semibold flex items-center gap-2"
                onClick={handleAddProduct}
              >
                <span>+</span> Agregar Producto
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-[#1e293b] rounded-lg">
            <h3 className="text-lg font-semibold text-[#9AF241] mb-3">Filtros</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-[#9AF241]">Rango de Precios</label>
                  <span className="text-white/80">${minPriceFilter} - ${maxPriceFilter}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm text-white/80">Mínimo: ${minPriceFilter}</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="10"
                      value={minPriceFilter}
                      onChange={handleMinPriceFilterChange}
                      className="w-full h-2 bg-[#0f172a] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-white/80">Máximo: ${maxPriceFilter}</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="10"
                      value={maxPriceFilter}
                      onChange={handleMaxPriceFilterChange}
                      className="w-full h-2 bg-[#0f172a] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-[#9AF241]">Ordenar por</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className={`px-3 py-1 rounded-md ${sortField === 'createdAt' ? 'bg-[#9AF241] text-gray-900' : 'bg-[#334155]'}`}
                  >
                    Fecha Creación {sortField === 'createdAt' && (sortDirection === 'asc' ? <ArrowUp size={16} className="inline" /> : <ArrowDown size={16} className="inline" />)}
                  </button>
                  <button
                    onClick={() => handleSort('updatedAt')}
                    className={`px-3 py-1 rounded-md ${sortField === 'updatedAt' ? 'bg-[#9AF241] text-gray-900' : 'bg-[#334155]'}`}
                  >
                    Fecha Actualización {sortField === 'updatedAt' && (sortDirection === 'asc' ? <ArrowUp size={16} className="inline" /> : <ArrowDown size={16} className="inline" />)}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="overflow-x-auto rounded-2xl shadow-inner">
              <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                  <tr>
                    <th className="px-4 py-2 text-left">Imagen</th>
                    <th 
                      className="px-4 py-2 text-left cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('nombre')}
                    >
                      Nombre {sortField === 'nombre' && (sortDirection === 'asc' ? <ArrowUp size={14} className="inline" /> : <ArrowDown size={14} className="inline" />)}
                    </th>
                    <th className="px-4 py-2 text-left">Descripción</th>
                    <th 
                      className="px-4 py-2 text-left cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('precio')}
                    >
                      Precio {sortField === 'precio' && (sortDirection === 'asc' ? <ArrowUp size={14} className="inline" /> : <ArrowDown size={14} className="inline" />)}
                    </th>
                    <th className="px-4 py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5">
                        <LoadingSpinner />
                      </td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((producto) => (
                      <tr
                        key={producto._id || producto.id}
                        className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg"
                      >
                        <td className="px-4 py-3 rounded-l-xl">
                          <div 
                            className="w-12 h-12 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleImagePreview(producto)}
                          >
                            {producto.imageUrl ? (
                              <img 
                                src={producto.imageUrl} 
                                alt={producto.nombre} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <ImageIcon size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{producto.nombre}</td>
                        <td className="px-4 py-3 max-w-xs truncate">{producto.descripcion}</td>
                        <td className="px-4 py-3">Q{producto.precio?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center rounded-r-xl">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(producto)}
                              className="bg-blue-500 hover:bg-blue-600 transition-all p-2 rounded-md text-white"
                              title="Editar"
                              disabled={isUpdating}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdateImage(producto)}
                              className="bg-purple-500 hover:bg-purple-600 transition-all p-2 rounded-md text-white"
                              title="Cambiar imagen"
                              disabled={isUpdatingImage}
                            >
                              <ImageIcon size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(producto)}
                              className="bg-red-500 hover:bg-red-600 transition-all p-2 rounded-md text-white"
                              title="Eliminar"
                              disabled={isDeleting}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-white/70">
                        No se encontraron productos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((producto) => (
                  <div
                    key={producto._id || producto.id}
                    className="bg-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]"
                  >
                    <div 
                      className="h-48 overflow-hidden cursor-pointer"
                      onClick={() => handleImagePreview(producto)}
                    >
                      {producto.imageUrl ? (
                        <img 
                          src={producto.imageUrl} 
                          alt={producto.nombre} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <ImageIcon size={40} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold truncate">{producto.nombre}</h3>
                        <span className="bg-[#9AF241] text-gray-900 text-xs px-2 py-1 rounded-full">
                          Q{producto.precio?.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 mb-3 line-clamp-2">{producto.descripcion}</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Editar"
                          disabled={isUpdating}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateImage(producto)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                          title="Cambiar imagen"
                          disabled={isUpdatingImage}
                        >
                          <ImageIcon size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(producto)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Eliminar"
                          disabled={isDeleting}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-white/70">
                  No se encontraron productos.
                </div>
              )}
            </div>
          )}
        </div>

        {imageModalOpen && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[#1e293b] border-2 border-[#9AF241] rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#9AF241]">{selectedProduct.nombre}</h3>
                <button
                  onClick={closeImageModal}
                  className="text-gray-300 hover:text-white text-2xl focus:outline-none"
                >
                  &times;
                </button>
              </div>
              <div className="overflow-auto max-h-[70vh] flex justify-center">
                {selectedProduct.imageUrl ? (
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.nombre} 
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded-lg">
                    <ImageIcon size={60} className="text-gray-400" />
                    <span className="ml-2 text-gray-400">No hay imagen</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeImageModal}
                  className="px-4 py-2 bg-[#334155] border border-[#9AF241] text-[#9AF241] rounded-lg hover:bg-[#3c4b63] transition-colors focus:outline-none"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="relative max-w-2xl w-full bg-[#1e293b] rounded-xl overflow-hidden">
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-[#9AF241] transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#9AF241] mb-6">
                  Editar Producto
                </h3>
                
                <form onSubmit={handleUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium text-[#9AF241]">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={currentProduct.nombre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-[#0f172a] text-white border border-[#9AF241] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium text-[#9AF241]">Descripción</label>
                      <textarea
                        name="descripcion"
                        value={currentProduct.descripcion}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-[#0f172a] text-white border border-[#9AF241] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9AF241] min-h-[100px]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium text-[#9AF241]">Precio (Q)</label>
                      <input
                        type="number"
                        name="precio"
                        value={currentProduct.precio}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 bg-[#0f172a] text-white border border-[#9AF241] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-[#9AF241] hover:bg-[#baff63] text-gray-900 font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="relative max-w-md w-full bg-[#1e293b] rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#9AF241] mb-4">Confirmar Eliminación</h3>
                <p className="text-white/80 mb-6">
                  ¿Estás seguro que deseas eliminar el producto <span className="font-semibold text-white">{currentProduct.nombre}</span>? Esta acción no se puede deshacer.
                </p>
                
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {imageUpdateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="relative max-w-md w-full bg-[#1e293b] rounded-xl overflow-hidden">
              <button
                onClick={() => {
                  setImageUpdateModalOpen(false);
                  setSelectedImage(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-[#9AF241] transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#9AF241] mb-6">
                  Actualizar Imagen para {currentProduct.nombre}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium text-[#9AF241]">
                      Seleccionar nueva imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                      className="block w-full text-sm text-white/80
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#9AF241] file:text-gray-900
                        hover:file:bg-[#baff63]
                        cursor-pointer"
                    />
                  </div>
                  
                  {selectedImage && (
                    <div className="mt-4">
                      <p className="text-sm text-white/80 mb-2">Vista previa:</p>
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Vista previa"
                        className="max-h-40 mx-auto rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setImageUpdateModalOpen(false);
                        setSelectedImage(null);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmUpdateImage}
                      className="bg-[#9AF241] hover:bg-[#baff63] text-gray-900 font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                      disabled={!selectedImage || isUpdatingImage}
                    >
                      {isUpdatingImage ? 'Actualizando...' : 'Actualizar Imagen'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};