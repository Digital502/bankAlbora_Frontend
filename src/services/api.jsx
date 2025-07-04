import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://bank-albora.vercel.app/bankingSystemAlbora/v1/",
    timeout: 3000,
    httpsAgent: false
});

apiClient.interceptors.request.use(
    (config) => {
        const userDetails = localStorage.getItem("user");

        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (err) {
                console.warn("Error al leer el token:", err);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const register = async (data) => {
    try {
        return await apiClient.post('/auth/register', data)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const login = async (data) => {
    return await apiClient.post('/auth/login', data);
};

export const registerAccount = async (data) => {
    try {
        return await apiClient.post('/account/registerAccount', data)

    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUsers = async () => {
    try {
        const response = await apiClient.get(`/user/listAdmins/`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getUserById = async (id) => {
    try {
        const response = await apiClient.get(`/user/getUser/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getAccountById = async (id) => {
    try {
        const response = await apiClient.get(`/account/getAccountUser/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getAccountByOrganization = async (id) => {
    try {
        const response = await apiClient.get(`/account/getAccountOrganization/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updateUser = async (id, data) => {
    try {
        const response = await apiClient.put(`/user/updateAdmin/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteUser = async (id) => {
    try {
        return await apiClient.delete(`/user/deleteAdmin/${id}`);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getMyUser = async () => {
    try {
        const response = await apiClient.get('/user/myUser');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const updateUseruser = async (userId, data) => {
    try {
        const response = await apiClient.put(`/user/updateUser/${userId}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const updatePassword = async (data) => {
    try {
        const response = await apiClient.put('/user/updatePassword', data);
        return response.data;
    } catch (error) {
        const message =
            error?.response?.data?.message || "Error desconocido del servidor";
        throw new Error(message);
    }
};

export const myAccount = async () => {
    try {
        const response = await apiClient.get('/account/getMyAccount');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const addDeposit = async (data) => {
    try {
        const response = await apiClient.post('/transaction/createDeposit', data);
        return response.data;       
    } catch (e) {
        return {
            error: true,
            message: e.message
        };
    }
};

export const getAccounts = async () => {
    try {
      const response = await apiClient.get(`/account/getAccounts/`);
      return response.data;
    } catch (e) {
      return {
        error: true,
        e
      };
    }
  }

export const latestMovementsAccount = async (id) => {
    try {  
        const response = await apiClient.get(`/transaction/latestMovements/${id}`);
        return response.data;
    }catch (e) {
        return{
            error: true,
            e
        }
    }
}

export const registerOrganization = async (data) => {
    try {
        return await apiClient.post('/organization/registerOrganization', data)

    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const reverseDeposit = async (id, data) => {
    try {
        const response = await apiClient.put(`transaction/reverseDeposit/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const addFavoriteAccount = async (data) => {
    try {
        const response = await apiClient.post(`/user/addFavoriteAccount`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getFavoriteAccounts = async () => {
    try {
        const response = await apiClient.get(`/user/getFavoriteAccount`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const deleteFavoriteAccount = async (numeroCuenta) => {
    try {
        const response = await apiClient.delete(`/user/deleteFavoriteAccount/${numeroCuenta}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const updateFavoriteAccount = async (numeroCuenta, data) => {
    try {
        const response = await apiClient.put(`/user/updateFavoriteAlias/${numeroCuenta}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getIngresosByNumeroCuenta = async (numeroCuenta) => {
  try {
    const response = await apiClient.get(`/transaction/ingresos/${numeroCuenta}`);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const getNotifications = async () => {
  try {
    const response = await apiClient.get('/notification/getNotifications');
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
}

export const markAsRead = async (id, data) => {
    try {
        const response = await apiClient.patch(`/notification/readNotification/${id}`, data);
        return response.data;
    } catch (e) {
        return { error: true, e }
    }
}

export const getOrganization = async () => {
    try {
        const response = await apiClient.get(`/organization/getOrganizations`)
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updateOrganization = async (id, data) => {
    try {
        const response = await apiClient.put(`/organization/updateOrganization/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}


export const deleteOrganization = async (id) => {
    try {
        return await apiClient.delete(`/organization/deleteOrganization/${id}`);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}


export const getOrganizationUid = async (id) => {
    try {
        const response = await apiClient.get(`organization/getOrganizationUid/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const addEmitirTarjeta = async (data) => {
    try {
        const response = await apiClient.post('/card/emitirTarjeta', data);
        return response.data
    }catch(e) {
        return {
            error: true,
            e
        }
    }
}

export const listCardDebito = async () =>{
    try{
        const response = await apiClient.get('/card/pendientes/debito')
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const listCardCredito = async () =>{
    try{
        const response = await apiClient.get('/card/pendientes/credito')
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const aprobarTarjeta = async (id, value) => {
    try{
        const response = await apiClient.put(`/card/aprobar/${id}`, { value })
        return response.data
    }catch(e){
        return{
            error: true,
            e
        }
    }
}

export const desactivarTarjeta = async (id, value) => {
    try{
        const response = await apiClient.put(`/card/desactivarCard/${id}`, { value })
        return response.data
    }catch(e){
        return{
            error: true,
            e
        }
    }
}

export const getCardsAdmin = async (estado) => {
    try{
        const response = await apiClient.get(`/card/getCard/${estado}`)
        return response.data
    }catch(e){
        return{
            error: true,
            e
        }
    }
}

export const getMyCard = async () =>{
    try{
        const response = await apiClient.get('/card/getCardUser')
        return response.data
    }catch(e){
        return{
            error: true,
            e
        }
    }
}

export const getTransactions = async (numeroCuenta) => {
    try {
        const res = await apiClient.get(`/transaction/getTransacciones/${numeroCuenta}`);
        return res.data;
    } catch (e) {
        return {
            error: true,
            message: e?.response?.data?.message || e.message || "Error desconocido",
        };
    }
};



export const manageLoan = async (data) => {
    try {
        const response = await apiClient.put('/transaction/manageLoan', data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};

export const getPendingLoans = async (status) => {
    try {
        const response = await apiClient.post('/transaction/pendingLoans', { listar: status });
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};

export const requestLoan = async (data) => {
  try {
    const response = await apiClient.post('/transaction/requestLoan', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLoanPaymentDetails = async (cuentaDestino) => {
  try {
    const response = await apiClient.get(`/transaction/loanPaymentDetails/${cuentaDestino}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const payLoanAPI = async (data) => {
  try {
    const response = await apiClient.post('/transaction/payLoan', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerInvestmentPolicy = async (data) => {
  try {
    const response = await apiClient.post('/investmentPolicy/registerInvestmentPolicy', data);
    return response.data;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const updateInvestmentPolicy = async (id, data) => {
  try {
    const response = await apiClient.put(`/investmentPolicy/updateInvestmentPolicy/${id}`, data);
    return response.data;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const deleteInvestmentPolicy = async (id) => {
  try {
    const response = await apiClient.delete(`/investmentPolicy/deleteInvestmentPolicy/${id}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const approveInvestment = async (id, value) => {
  try {
    const response = await apiClient.put(`investment/approveInvestment/${id}`, {
      value
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getInvestmentWaitingList = async () => {
  try {
    const response = await apiClient.get('investment/getWaitingList');
    return response.data.investment;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const getInvestmentPolicies = async () => {
  try {
    const response = await apiClient.get('/investmentPolicy/');
    return response.data;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const simulateInvestment = async (data) => {
    try {
        const response = await apiClient.post('/investment/SimulateInvestment', data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e,
        };
    }
};

export const getInvestments = async () => {
    try {
        const response = await apiClient.get('/investment/getInvestment');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e,
        };
    }
};

export const createInvestment = async (data) => {
    try {
        const response = await apiClient.post('/investment/createInvestment', data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e,
        };
    }
};

export const convertidorDivisas = async (data) => {
    try{
        const response = await apiClient.post('/convetidor/', data)
        return response.data
    }catch(e){
        return{
            error: true,
            message: e?.response?.data?.message || e.message || "Error desconocido",
        }
    }
}

export const registerProduct = async (formData) => {
    try {
        return await apiClient.post('/service/registerService', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const registerInsurance = async (data) => {
    try {
        const response = await apiClient.post('/service/registerServiceBanco', data);
        console.log("Response from API:", response);
        return response.data
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const listInsurance = async () => {
    try{
        const response = await apiClient.get('/service/listarSegurosExcluyendoOtros')
        return response.data
    }catch(e){
        return{
            error: true,
            e
        }
    }
}

export const updateInsurance = async (id, data) => {
    try {
        const response = await apiClient.put(`/service/updateService/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const deleteInsurance = async (id) => {
    try {
        const response = await apiClient.delete(`/service/deleteService/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getListRequestInsurance = async () => {
    try {
        const response = await apiClient.get('/insurance/obtenerSolicitudes');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const approveInsuranceRequest = async (id, estado) => {
    try {
        const response = await apiClient.put(`/insurance/solicitudesInsurance/${id}`, { estado });
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const listarSegurosExcluyendoOtros = async () => {
    try {
        const response = await apiClient.get('/service/listarSegurosExcluyendoOtros');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};

export const crearSolicitudSeguro = async (data) => {
    try {
        const response = await apiClient.post('/insurance/crearSolicitudSeguro', data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};

export const obtenerSolicitudesSeguroUsuario = async () => {
    try {
        const response = await apiClient.get('/insurance/usuarioSolicitud');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};

export const getMyAccountOrganization = async () => {
    try {
        const response = await apiClient.get('/organization/obtenerOrganizacionCuenta');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getDepositsOrganization = async () => {
    try {
        const response = await apiClient.get('/organization/obtenerDepositosOrganizacion');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getMyOrganization = async () => {
    try {
        const response = await apiClient.get('/organization/getMyOrganization');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};


export const getOrganizations = async () => {
    try {
        const response = await apiClient.get(`/organization/getOrganizations/`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const addAffiliation = async (data) => {
    try {
        const response = await apiClient.post('/user/addAffiliation', data);
        return response.data
    }catch(e) {
        return {
            error: true,
            e
        }
    }
}

export const getAffiliations = async () => {
    try {
        const response = await apiClient.get(`/user/getAffiliations/`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const deleteAffiliation = async (id) => {
    try {
      const response = await apiClient.delete(`/user/deleteAffiliation/${id}`);
      return response.data;
    } catch (e) {
      return {
        error: true,
        e,
      };
    }
  };

  export const getProductosConDescuento = async (id) => {
    try {
        const response = await apiClient.get(`/service/getProductosConDescuento/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const generateCodigo = async (data) => {
    try {
        const response = await apiClient.post('/auth/recuperacion', data)
        return response.data
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updatePasswordNew = async (data) => {
    try {
        const response = await apiClient.put('/user/updatePasswordNew', data);
        return response.data;
    } catch (error) {
        const message =
            error?.response?.data?.message || "Error desconocido del servidor";
        throw new Error(message);
    }
};

export const transferencia = async (data) => {
    try {
        const response = await apiClient.post('/transaction/transferencia', data);
        return response.data
    }catch(e) {
        return {
            error: true,
            e
        }
    }
}

export const pagoTarjeta = async (data) => {
    try {
        const response = await apiClient.post('/transaction/pagoTarjetaController', data);
        return response.data
    }catch(e) {
        return {
            error: true,
            e
        }
    }
}

export const getAffiliationStatus = async () => {
    try {
        const response = await apiClient.get(`/user/getAffiliationStatus/`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getProducts = async () => {
    try {
        const response = await apiClient.get(`/service/getServices/`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getProductsAdmin = async () => {
    try {
        const response = await apiClient.get(`/service/getServicesAdmin/`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const deleteProduct = async (id) => {
    try {
      const response = await apiClient.delete(`/service/deleteService/${id}`);
      return response.data;
    } catch (e) {
      return {
        error: true,
        e,
      };
    }
  };

export const updateProduct = async (id, data) => {
    try {
      const response = await apiClient.put(`/service/updateService/${id}`, data);
      return response.data;
    } catch (e) {
      return {
        error: true,
        e,
      };
    }
};

export const updateProductImage = async (id, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('imageProduct', imageFile);
      
      const response = await apiClient.patch(`/service/updateServiceImage/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (e) {
      return {
        error: true,
        e,
      };
    }
};