import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Footer } from '../footer/Footer';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { ShoppingCart, ArrowLeft, CreditCard, Landmark, X, CheckCircle, Clock, Calendar } from 'lucide-react';
import { NavbarDashboardUser } from "../../components/navs/NavbarDashboardUser";
import { useListProductUser } from '../../shared/hooks/useListProductUser';
import { useDepositUsers } from "../../shared/hooks/useDepositUsers";
import toast from 'react-hot-toast';

export const ListProductUser = () => {
  const { organizacionId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(18000); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [searchTermAccount, setSearchTermAccount] = useState("");
  const [showSuggestionsAccount, setShowSuggestionsAccount] = useState(false);
  const [cardData, setCardData] = useState({
    numeroTarjeta: '',
    cvv: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);

  const {
    products,
    isLoading,
    maxPrice,
    filterProducts,
    makeTransfer,
    makeCardPayment,
    transferLoading,
    cardPaymentLoading
  } = useListProductUser(organizacionId);

  const {
    accounts,
    isLoading: isLoadingAccounts
  } = useDepositUsers();

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

  const filteredProducts = filterProducts(products, {
    searchTerm,
    minPriceFilter,
    maxPriceFilter
  });

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setSelectedAccount('');
    setCardData({
      numeroTarjeta: '',
      cvv: ''
    });
  };

  const handleCardDataChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmPurchase = async () => {
    if (!paymentMethod) {
      toast.error('Por favor selecciona un método de pago');
      return;
    }

    try {
      setIsProcessingPurchase(true);
            
      const amount = selectedProduct.descuentoAplicado > 0 
        ? selectedProduct.precioConDescuento 
        : selectedProduct.precioOriginal;

      if (paymentMethod === 'transferencia') {
        if (!selectedAccount) {
          toast.error('Por favor selecciona una cuenta para la transferencia');
          setIsProcessingPurchase(false);
          return;
        }

        await makeTransfer({
          cuentaOrigen: selectedAccount,
          organization: organizacionId,
          monto: amount
        });

        toast.success(
          `¡${selectedProduct.nombre} comprado por Q${amount.toFixed(2)}!`,
          { duration: 4000 }
        );
        
      } else if (paymentMethod === 'tarjeta') {
        if (!cardData.numeroTarjeta || !cardData.cvv) {
          toast.error('Por favor completa los datos de la tarjeta');
          setIsProcessingPurchase(false);
          return;
        }

        await makeCardPayment({
          numeroTarjeta: cardData.numeroTarjeta, 
          cvv: cardData.cvv,
          monto: amount,
          organization: organizacionId
        });

        toast.success(
          `¡${selectedProduct.nombre} comprado por Q${amount.toFixed(2)}!`,
          { duration: 4000 }
        );
      }

      setPurchaseDetails({
        product: selectedProduct,
        amount,
        paymentMethod,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });
      
      closeModal();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error al procesar la compra';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  const handleGoBack = () => {
    navigate('/bankAlbora');
  };

  const closeModal = () => {
    setShowModal(false);
    setPaymentMethod(null);
    setSelectedAccount('');
    setCardData({
      numeroTarjeta: '',
      cvv: ''
    });
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setPurchaseDetails(null);
  };

  const isLoadingAll = isLoadingAccounts || isLoading;
  const handleAccountSearchChange = (value) => {
    setSearchTermAccount(value);
    setSelectedAccount('');
    setShowSuggestionsAccount(value.trim() !== '');
  };

  const handleAccountSelect = (accountNumber) => {
    setSelectedAccount(accountNumber);
    const selectedAccount = accounts.find(acc => acc.numeroCuenta === accountNumber);
    setSearchTermAccount(selectedAccount ? `${accountNumber} - ${selectedAccount.tipoCuenta}` : accountNumber);
    setShowSuggestionsAccount(false);
  };

  const filteredAccounts = accounts.filter(account => 
    account.numeroCuenta.includes(searchTermAccount) ||
    account.tipoCuenta.toLowerCase().includes(searchTermAccount.toLowerCase())
  );
  return (
    <div>
      <NavbarDashboardUser/>
      <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">

          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={handleGoBack}
              className="flex items-center gap-2 text-[#9AF241] hover:text-[#7fd133] transition-colors"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
            <h2 className="text-3xl font-extrabold text-center text-[#9AF241] tracking-wide">
              Productos Disponibles
            </h2>
            <div className="w-10"></div>
          </div>
          
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
          </div>

          <div className="mb-6 p-4 bg-[#1e293b] rounded-lg">
            <h3 className="text-lg font-semibold text-[#9AF241] mb-3">Filtros</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-[#9AF241]">Rango de Precios</label>
                  <span className="text-white/80">${minPriceFilter} - ${maxPriceFilter}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoadingAll ? (
              <div className="col-span-full flex justify-center">
                <LoadingSpinner />
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((producto) => (
                <motion.div
                  key={producto.uid}
                  className="bg-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] flex flex-col"
                  whileHover={{ scale: 1.02 }}
                  style={{ minHeight: '400px', maxHeight: '480px' }}
                >
                  <div className="h-48 overflow-hidden relative flex-shrink-0">
                    {producto.imageUrl ? (
                      <img 
                        src={producto.imageUrl} 
                        alt={producto.nombre} 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <div className="text-gray-400 text-center p-4">
                          <p>No hay imagen</p>
                        </div>
                      </div>
                    )}
                    {producto.descuentoAplicado > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {producto.descuentoAplicado}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold mb-2 truncate">{producto.nombre}</h3>
                      <p className="text-sm text-white/80 mb-3 line-clamp-2">{producto.descripcion}</p>
                    </div>
                    
                    <div className="mb-4">
                      {producto.descuentoAplicado > 0 ? (
                        <div className="space-y-1">
                          <span className="text-gray-400 line-through text-sm">
                            Q{producto.precioOriginal?.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-[#9AF241]">
                              Q{producto.precioConDescuento?.toFixed(2)}
                            </span>
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                              -{producto.descuentoAplicado}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-[#9AF241]">
                          Q{producto.precioOriginal?.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleBuyClick(producto)}
                      className="w-full bg-[#9AF241] hover:bg-[#7fd133] text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingCart size={18} />
                      Comprar
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-white/70">
                No se encontraron productos.
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col md:flex-row gap-6 max-w-4xl w-full"
            >
              <div className="hidden md:block w-full md:w-1/2">
                <div className="h-full rounded-xl overflow-hidden bg-[#1e293b] border border-white/10 flex items-center justify-center">
                  {selectedProduct?.imageUrl ? (
                    <img 
                      src={selectedProduct.imageUrl} 
                      alt={selectedProduct.nombre} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <p>No hay imagen disponible</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative bg-[#1e293b] border border-white/10 rounded-xl w-full md:w-1/2 p-6 shadow-2xl">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-[#9AF241] mb-4">
                  Comprar: {selectedProduct?.nombre}
                </h2>
                
                <div className="mb-6">
                  <p className="text-white/80 mb-2">Precio:</p>
                  {selectedProduct?.descuentoAplicado > 0 ? (
                    <div className="flex items-center gap-4">
                      <span className="text-xl line-through text-gray-400">
                        Q{selectedProduct?.precioOriginal?.toFixed(2)}
                      </span>
                      <span className="text-2xl font-bold text-[#9AF241]">
                        Q{selectedProduct?.precioConDescuento?.toFixed(2)}
                      </span>
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-sm">
                        {selectedProduct?.descuentoAplicado}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-[#9AF241]">
                      Q{selectedProduct?.precioOriginal?.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-white/80 mb-3">Selecciona método de pago:</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      onClick={() => handlePaymentMethodSelect('tarjeta')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${paymentMethod === 'tarjeta' ? 'border-[#9AF241] bg-[#9AF241]/10' : 'border-white/20 hover:border-white/40'}`}
                    >
                      <CreditCard size={24} className="mb-2" />
                      <span>Tarjeta</span>
                    </button>
                    
                    <button
                      onClick={() => handlePaymentMethodSelect('transferencia')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${paymentMethod === 'transferencia' ? 'border-[#9AF241] bg-[#9AF241]/10' : 'border-white/20 hover:border-white/40'}`}
                    >
                      <Landmark size={24} className="mb-2" />
                      <span>Transferencia</span>
                    </button>
                  </div>

                  {paymentMethod === 'transferencia' && (
                    <div className="mt-4">
                      <label className="block text-white/80 mb-2">Selecciona cuenta origen:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTermAccount}
                        onChange={(e) => handleAccountSearchChange(e.target.value)}
                        onFocus={() => setShowSuggestionsAccount(true)}
                        onBlur={() => setTimeout(() => setShowSuggestionsAccount(false), 200)}
                        placeholder="Buscar cuenta por número o tipo"
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                        disabled={isLoadingAccounts}
                      />
                      <input type="hidden" name="cuentaOrigen" value={selectedAccount} />
                      
                      {showSuggestionsAccount && (
                        <ul className="absolute z-10 w-full bg-[#1e293b] border border-[#9AF241] mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                          {filteredAccounts.length > 0 ? (
                            filteredAccounts.map(account => (
                              <li
                                key={account.numeroCuenta}
                                onClick={() => handleAccountSelect(account.numeroCuenta)}
                                className={`px-4 py-2 hover:bg-[#334155] cursor-pointer text-white text-sm ${
                                  account.numeroCuenta === selectedAccount ? 'bg-[#334155]' : ''
                                }`}
                              >
                                {account.numeroCuenta} - {account.tipoCuenta} (Q{account.saldoCuenta?.toFixed(2) || '0.00'})
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-400 text-sm">No se encontraron coincidencias</li>
                          )}
                        </ul>
                      )}
                    </div>
                    </div>
                  )}

                  {paymentMethod === 'tarjeta' && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-white/80 mb-2">Número de tarjeta:</label>
                        <input
                          type="text"
                          name="numeroTarjeta"
                          value={cardData.numeroTarjeta}
                          onChange={handleCardDataChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">CVV:</label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardDataChange}
                          placeholder="123"
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                          maxLength="3"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                    disabled={isProcessingPurchase}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmPurchase}
                    className="px-4 py-2 rounded-lg bg-[#9AF241] hover:bg-[#7fd133] text-gray-900 font-medium flex items-center justify-center gap-2 transition-colors min-w-[150px]"
                    disabled={
                      isProcessingPurchase || 
                      !paymentMethod || 
                      (paymentMethod === 'transferencia' && !selectedAccount) ||
                      (paymentMethod === 'tarjeta' && (!cardData.numeroTarjeta || !cardData.cvv))
                    }

                  >
                    {isProcessingPurchase ? (
                      <>
                        Procesando...
                      </>
                    ) : (
                      'Confirmar compra'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showSuccessModal && purchaseDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative bg-[#1e293b] border border-white/10 rounded-xl w-full max-w-4xl p-6 shadow-2xl flex flex-col md:flex-row gap-6"
            >
              <button
                onClick={closeSuccessModal}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-1/2">
                <div className="h-64 md:h-full rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                  {purchaseDetails.product.imageUrl ? (
                    <img 
                      src={purchaseDetails.product.imageUrl} 
                      alt={purchaseDetails.product.nombre} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <p>No hay imagen disponible</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-[#9AF241] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-[#9AF241] mb-2">¡Compra exitosa!</h2>
                  <p className="text-white/80">Tu compra se ha realizado correctamente.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Producto:</span>
                    <span className="font-medium">{purchaseDetails.product.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Monto:</span>
                    <span className="font-bold text-[#9AF241]">Q{purchaseDetails.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Método de pago:</span>
                    <span className="font-medium">
                      {purchaseDetails.paymentMethod === 'tarjeta' ? 'Tarjeta' : 'Transferencia'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 flex items-center gap-1">
                      <Calendar size={14} />
                      Fecha:
                    </span>
                    <span className="font-medium">{purchaseDetails.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 flex items-center gap-1">
                      <Clock size={14} />
                      Hora:
                    </span>
                    <span className="font-medium">{purchaseDetails.time}</span>
                  </div>
                </div>

                <button
                  onClick={closeSuccessModal}
                  className="w-full mt-6 py-2 rounded-lg bg-[#9AF241] hover:bg-[#7fd133] text-gray-900 font-medium transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};