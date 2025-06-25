import { useState } from 'react';
import { motion } from 'framer-motion';
import { useListProductAdmin } from '../../shared/hooks/useListProductAdmin';
import { Footer } from '../footer/Footer';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { NavbarDashboardUser } from '../navs/NavbarDashboardUser'; 
import { List, Grid, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';

export const ListProductService = () => {
  const {
    products,
    isLoading,
    fetchProducts
  } = useListProductAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  
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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'cards' : 'table');
  };

  return (
    <div>
      <NavbarDashboardUser />
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
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4">
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
                          <div className="w-12 h-12 rounded-md overflow-hidden">
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
                        <td className="px-4 py-3 rounded-r-xl">Q{producto.precio?.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-white/70">
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
                    <div className="h-48 overflow-hidden">
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

        <Footer />
      </div>
    </div>
  );
};