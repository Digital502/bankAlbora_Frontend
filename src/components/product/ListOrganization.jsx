import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useProductUsers } from '../../shared/hooks/useProductUsers';
import toast from 'react-hot-toast';

export const ListOrganization = () => {
  const navigate = useNavigate();
  
  const {
    organizations,
    isLoading,
    addAffiliation: addAffiliationAPI,
    deleteAffiliation: deleteAffiliationAPI,
    fetchOrganizations: fetchOrganizationsWithStatus,
    hasLoaded
  } = useProductUsers();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  useEffect(() => {
    const bannerClosed = localStorage.getItem('orgInfoBannerClosed');
    if (bannerClosed !== 'true') {
      setShowInfoBanner(true);
    }

    if (!hasLoaded) {
      fetchOrganizationsWithStatus().catch(error => {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos');
      });
    }
  }, [hasLoaded, fetchOrganizationsWithStatus]);

  const handleAddAffiliation = async (orgUid, orgName, e) => {
    e.stopPropagation();
    try {
      const success = await addAffiliationAPI(orgUid);
      if (success) {
        toast.success(`Te afiliaste a ${orgName}`);
      }
    } catch (error) {
      console.error('Error adding affiliation:', error);
      toast.error('Ocurrió un error al afiliarse');
    }
  };

  const handleRemoveAffiliation = async (orgUid, orgName, e) => {
    e.stopPropagation();
    try {
      const success = await deleteAffiliationAPI(orgUid);
      if (success) {
        toast.success(`Te desafiliaste de ${orgName}`);
      }
    } catch (error) {
      console.error('Error removing affiliation:', error);
      toast.error('Ocurrió un error al desafiliarse');
    }
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? Math.ceil(organizations.length / 4) - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev === Math.ceil(organizations.length / 4) - 1 ? 0 : prev + 1));
  };

  const handleOrganizationClick = (orgUid) => {
    navigate(`/products/${orgUid}`);
  };

  const handleCloseBanner = () => {
    setShowInfoBanner(false);
    // Guardar en localStorage que el usuario cerró el banner
    localStorage.setItem('orgInfoBannerClosed', 'true');
  };

  if (!hasLoaded || isLoading) {
    return (
      <div className="max-w-6xl mx-auto mb-16 text-center py-8">
        <p className="text-[#CDE5DD]">Cargando organizaciones...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3 }}
    >
      <h2 className="text-xl font-semibold text-[#9AF241] mb-2 text-center">
        Organizaciones disponibles
      </h2>
      
      {/* Banner informativo mejorado */}
      {showInfoBanner && (
        <motion.div 
          className="relative bg-gradient-to-r from-[#9AF241]/10 to-[#1e293b]/70 backdrop-blur-md rounded-lg p-4 mb-6 mx-auto max-w-3xl text-center border border-[#9AF241]/50 shadow-lg shadow-[#9AF241]/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            onClick={handleCloseBanner}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-[#9AF241]/20 transition-colors"
            aria-label="Cerrar banner"
          >
            <X size={18} className="text-[#9AF241]" />
          </button>
          <p className="text-[#CDE5DD] font-medium">
            <span className="text-[#9AF241] font-bold">¡Beneficio exclusivo!</span> Afíliate a una organización y disfruta de descuentos especiales con Banco Albora
          </p>
        </motion.div>
      )}
      
      {organizations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#CDE5DD]">No hay organizaciones disponibles</p>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          {organizations.length > 4 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1e293b]/80 p-2 rounded-full hover:scale-110 transition"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1e293b]/80 p-2 rounded-full hover:scale-110 transition"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}

          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: Math.ceil(organizations.length / 4) }).map((_, groupIndex) => (
              <div 
                key={`group-${groupIndex}`} 
                className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-2"
              >
                {organizations.slice(groupIndex * 4, (groupIndex + 1) * 4).map((org) => (
                  <motion.div
                    key={`org-${org.uid}`}
                    className="bg-[#1e293b]/70 backdrop-blur-md rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleOrganizationClick(org.uid)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="p-4 rounded-full mb-4 inline-block bg-[#334155]">
                        <Globe size={28} className="text-[#9AF241]" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleRemoveAffiliation(org.uid, org.nombre, e)}
                          className={`p-2 rounded-lg transition-colors ${org.isAffiliated ? 
                            'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 
                            'bg-gray-700/30 text-gray-500 cursor-not-allowed'}`}
                          disabled={!org.isAffiliated}
                          aria-label="Desafiliar"
                        >
                          <Trash2 size={18} />
                        </button>
                        
                        <button
                          onClick={(e) => handleAddAffiliation(org.uid, org.nombre, e)}
                          className={`p-2 rounded-lg transition-colors ${!org.isAffiliated ? 
                            'bg-[#9AF241]/20 text-[#9AF241] hover:bg-[#9AF241]/30' : 
                            'bg-gray-700/30 text-gray-500 cursor-not-allowed'}`}
                          disabled={org.isAffiliated}
                          aria-label="Afiliar"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                      {org.nombre || "Organización"}
                    </h3>
                    <p className="text-sm text-[#CDE5DD] mb-2">
                      {org.descripcion || "Conoce más sobre esta organización"}
                    </p>
                    <span className={`text-xs ${org.isAffiliated ? 'text-[#9AF241]' : 'text-gray-400'}`}>
                      {org.isAffiliated ? '✓ Afiliado actualmente' : 'No afiliado'}
                    </span>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          {organizations.length > 4 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: Math.ceil(organizations.length / 4) }).map((_, index) => (
                <button
                  key={`indicator-${index}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-[#9AF241]' : 'bg-[#334155]'}`}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};