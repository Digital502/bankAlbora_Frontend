import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';

export const MyAccounts = ({ account = [], loading, conversionData = {} }) => {
  const [accountsWithUid, setAccountsWithUid] = useState([]);
  const [showBalanceMap, setShowBalanceMap] = useState({});

  useEffect(() => {
    const accounts = account.map(acc => ({
      ...acc,
      uid: acc.uid || `acc_${acc.numeroCuenta}`
    }));
    
    setAccountsWithUid(accounts);
    
    const initialMap = accounts.reduce((acc, curr) => {
      acc[curr.uid] = false;
      return acc;
    }, {});
    setShowBalanceMap(initialMap);
  }, [account]);

  const toggleBalance = (uid) => {
    setShowBalanceMap((prev) => ({
      ...prev,
      [uid]: !prev[uid],
    }));
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (!accountsWithUid || accountsWithUid.length === 0) {
    return <p className="text-white text-center mt-6">No tienes cuentas registradas.</p>;
  }

  return (
    <div className="grid gap-6 max-w-6xl mx-auto">
      {accountsWithUid.map((account) => {
        const hasConversion = conversionData[account.numeroCuenta];
        const saldoMostrado = hasConversion 
          ? conversionData[account.numeroCuenta].conversionAmount
          : account.saldoCuenta;
        
        const currencySymbol = hasConversion 
          ? conversionData[account.numeroCuenta]?.currencySymbol || '' 
          : 'Q';

        return (
          <motion.div
            key={account.uid}
            className="bg-[#1e293b]/70 backdrop-blur-md rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#9AF241]">
                Saldo disponible ({account.tipoCuenta})
              </h2>
              <Wallet size={24} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-white">
                  {showBalanceMap[account.uid]
                    ? `${currencySymbol}${saldoMostrado.toFixed(2)}`
                    : '******'}
                </p>
                {hasConversion && (
                  <p className="text-sm text-[#9AF241] mt-1">
                    (Conversión aplicada)
                  </p>
                )}
              </div>
              <button
                onClick={() => toggleBalance(account.uid)}
                aria-label="Mostrar/Ocultar saldo"
                className="text-white hover:text-[#9AF241] transition"
              >
                {showBalanceMap[account.uid] ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>

            <p className="text-sm text-[#CDE5DD] mt-2">
              Número de cuenta: {account.numeroCuenta}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};