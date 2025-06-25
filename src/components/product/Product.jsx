import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useRegisterProduct } from "../../shared/hooks/useRegisterProduct";
import { validateNumber } from "../../shared/validators";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Footer } from "../footer/Footer";

const shootingStarColors = ["#145259", "#45858c"];
const particleColors = ["#145259", "#45858c"];

const shootingStarVariants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  visible: (custom) => ({
    opacity: [0, 0.8, 0],
    x: [0, 200 + custom * 80],
    y: [0, 60 * (custom % 2 === 0 ? 1 : -1), 0],
    transition: {
      duration: 2,
      delay: custom * 0.3,
      repeat: Infinity,
      repeatDelay: Math.random() * 5,
      ease: "easeInOut",
    },
  }),
};

const particleVariants = {
  animate: {
    opacity: [0.2, 0.6, 0.2],
    y: [0, -20, 0],
    x: [0, Math.random() * 20 - 10, 0],
    transition: {
      duration: 5 + Math.random() * 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const Product = ({ switchAuthHandler }) => {
  const { registerNewProduct, isLoading } = useRegisterProduct();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    nombre: { value: "", isValid: true, showError: false, isFocused: false },
    descripcion: { value: "", isValid: true, showError: false, isFocused: false },
    precio: { value: "", isValid: true, showError: false, isFocused: false },
    descuentoAfiliado: { value: "", isValid: true, showError: false, isFocused: false },
  });

  const particlesArray = Array(60).fill(0);

  useEffect(() => {
    if (showImageModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showImageModal]);

  const handleInputValueChange = (value, field) => {
    setFormState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        isValid: true,
        showError: false
      },
    }));
  };

  const validateField = (field, value) => {
    switch (field) {
      case "precio":
        return validateNumber(value) && parseFloat(value) > 0;
      case "descuentoAfiliado":
        return validateNumber(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100;
      case "nombre":
        return value.trim().length > 0;
      default:
        return true;
    }
  };

  const handleInputFocus = (field) => {
    setFormState((prev) => ({
      ...prev,
      [field]: { ...prev[field], isFocused: true },
    }));
  };

  const handleInputBlur = (field) => {
    setFormState((prev) => ({
      ...prev,
      [field]: { 
        ...prev[field], 
        isFocused: false,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFileName("");
  };

  const toggleImageModal = () => {
    setShowImageModal(!showImageModal);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const updatedState = { ...formState };
    let formIsValid = true;

    const requiredFields = ["nombre", "precio", "descuentoAfiliado"];
    requiredFields.forEach((field) => {
      const isValid = validateField(field, updatedState[field].value);
      updatedState[field] = {
        ...updatedState[field],
        isValid,
        showError: !isValid,
      };
      if (!isValid) formIsValid = false;
    });


    setFormState(updatedState);
    if (!formIsValid) return;

    try {
      const formData = new FormData();
      formData.append('nombre', formState.nombre.value);
      formData.append('descripcion', formState.descripcion.value);
      formData.append('precio', formState.precio.value);
      formData.append('descuentoAfiliado', formState.descuentoAfiliado.value);
      formData.append('imageProduct', imageFile);

      await registerNewProduct(formData);

      setFormState({
        nombre: { value: "", isValid: true, showError: false, isFocused: false },
        descripcion: { value: "", isValid: true, showError: false, isFocused: false },
        precio: { value: "", isValid: true, showError: false, isFocused: false },
        descuentoAfiliado: { value: "", isValid: true, showError: false, isFocused: false },
      });
      setImagePreview(null);
      setImageFile(null);
      setFileName("");

    } catch (error) {
      console.error("Error en el componente:", error);
    }
  };

  const allFieldsFilled = () => {
    const requiredFields = ["nombre", "precio", "descuentoAfiliado"];
    return requiredFields.every((field) => formState[field].value.trim() !== "") && imageFile;
  };

  const isSubmitDisabled = isLoading || !allFieldsFilled();

  const renderInputField = (field, label, type = "text", validationMessage) => {
    const fieldState = formState[field];
    return (
      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <input
          id={field}
          type={type}
          value={fieldState.value}
          onChange={(e) => handleInputValueChange(e.target.value, field)}
          onFocus={() => handleInputFocus(field)}
          onBlur={() => handleInputBlur(field)}
          className={`w-full bg-[#334155] border ${
            fieldState.showError ? "border-red-500" : "border-[#9AF241]"
          } rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 peer transition-all`}
        />
        <label
          htmlFor={field}
          className={`absolute left-4 ${
            fieldState.value || fieldState.isFocused
              ? "top-1 text-xs text-[#9AF241]"
              : "top-1/2 -translate-y-1/2 text-gray-400"
          } peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#9AF241] transition-all duration-200`}
        >
          {label}
        </label>
        {fieldState.showError && (
          <motion.p
            className="mt-1 text-sm text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {validationMessage || "Este campo es requerido"}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12 flex flex-col items-center justify-center space-y-4">
      {particlesArray.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const color = particleColors[i % particleColors.length];
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: color,
              filter: `drop-shadow(0 0 5px ${color})`,
            }}
            variants={particleVariants}
            animate="animate"
            initial={{ opacity: 0.3, y: 0 }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        );
      })}

      {[...Array(12)].map((_, i) => {
        const color = shootingStarColors[i % shootingStarColors.length];
        return (
          <motion.div
            key={`shooting-star-${i}`}
            custom={i}
            className="absolute rounded-lg blur-md"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 50}%`,
              width: 6 + Math.random() * 8,
              height: 1.5 + Math.random() * 2,
              rotate: 45,
              backgroundColor: color,
              opacity: 0,
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
            variants={shootingStarVariants}
            initial="hidden"
            animate="visible"
          />
        );
      })}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.5,
        }}
        className="relative z-10 w-full max-w-3xl bg-[#1e293b] border border-[#9AF241] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.h2
              className="text-4xl font-bold mb-2 text-[#9AF241] tracking-tight"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Banco Albora
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Registra nuevos productos rápidamente
            </motion.p>
          </div>

          <motion.h2
            className="text-2xl font-bold text-center mb-6 text-[#9AF241] tracking-tighter"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            >
            Registro de Producto
          </motion.h2>

          <motion.form
            onSubmit={handleRegister}
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {renderInputField("nombre", "Nombre del Producto", "text", "El nombre es obligatorio")}
            {renderInputField("descripcion", "Descripción", "text")}
            {renderInputField("precio", "Precio (Q)", "number", "El precio debe ser mayor a 0")}
            {renderInputField("descuentoAfiliado", "Descuento para Afiliados (%)", "number", "El descuento debe ser entre 0 y 100")}

            <motion.div 
              className="col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen del Producto (Obligatoria)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3 cursor-pointer hover:bg-[#3c4b63] transition-colors">
                  {fileName ? (
                    <span className="text-[#9AF241] truncate block w-full">{fileName}</span>
                  ) : (
                    <span className="text-gray-300">Seleccionar archivo</span>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-16 h-16 rounded-md overflow-hidden border border-[#9AF241] cursor-pointer"
                      onClick={toggleImageModal}
                    >
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitDisabled}
              whileHover={!isSubmitDisabled ? {
                scale: 1.03,
                boxShadow: "0 0 15px #06b6d4"
              } : {}}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`mt-6 py-3 px-6 rounded-xl font-medium tracking-wide shadow-lg transition-all w-full col-span-2 ${
                isSubmitDisabled
                  ? "bg-gray-500/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:shadow-[0_0_15px_#06b6d4]"
              }`}
            >
              {isLoading ? (
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Registrando producto...
                </motion.span>
              ) : "Registrar Producto"}
            </motion.button>

            <motion.div 
              className="col-span-2 flex justify-center mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-white">
                Mira tu lista de productos{" "}
                <button 
                  onClick={() => navigate('/product-list')}
                  className="text-[#9AF241] underline cursor-pointer hover:text-[#7acc29] transition-colors"
                >
                  aquí
                </button>
              </p>
            </motion.div>
          </motion.form>
          <motion.p
            className="text-xs mt-6 text-center text-gray-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            ©Copyright 2024. Banco Albora.
          </motion.p>
        </div>
      </motion.div>

      {/* Modal para la imagen */}
      {showImageModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative bg-[#1e293b] border-2 border-[#9AF241] rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#9AF241]">Vista previa de la imagen</h3>
              <button
                onClick={toggleImageModal}
                className="text-gray-300 hover:text-white text-2xl focus:outline-none"
              >
                &times;
              </button>
            </div>
            <div className="overflow-auto max-h-[70vh] flex justify-center">
              <img 
                src={imagePreview} 
                alt="Vista previa completa" 
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={toggleImageModal}
                className="px-4 py-2 bg-[#334155] border border-[#9AF241] text-[#9AF241] rounded-lg hover:bg-[#3c4b63] transition-colors focus:outline-none"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <br /><br />
      <Footer/>
    </div>
  );
}

Product.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
};