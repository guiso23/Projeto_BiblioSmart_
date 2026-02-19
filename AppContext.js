import React, { useState, useEffect, useMemo, createContext } from 'react';
import {
  loadUser,
  setupAndLoadCatalog,
  loadUserLoanData,
  saveUser,
  saveCatalog,
  saveUserLoanData,
  clearUser,
} from '../services/storage';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loanData, setLoanData] = useState({ carrinho: [], emprestimos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const savedUser = await loadUser();
      const loadedCatalog = await setupAndLoadCatalog();
      setCatalog(loadedCatalog);
      if (savedUser) {
        setUser(savedUser);
        const userLoans = await loadUserLoanData(savedUser.email);
        setLoanData(userLoans);
      }
      setLoading(false);
    };
    initializeApp();
  }, []);

  const login = async (verifiedUser) => {
    await saveUser(verifiedUser);
    const userLoans = await loadUserLoanData(verifiedUser.email);
    setLoanData(userLoans);
    setUser(verifiedUser);
  };

  const logout = async () => {
    await clearUser();
    setUser(null);
    setLoanData({ carrinho: [], emprestimos: [] });
  };

  const updateAndSaveCatalog = async (newCatalog) => {
    setCatalog(newCatalog);
    await saveCatalog(newCatalog);
  };

  const updateAndSaveLoanData = async (newData) => {
    setLoanData(newData);
    if (user) {
      await saveUserLoanData(user.email, newData);
    }
  };

  const addToCart = (book) => {
    const newCatalog = catalog.map((b) =>
      b.id === book.id
        ? { ...b, quantidadeDisponivel: b.quantidadeDisponivel - 1 }
        : b
    );
    updateAndSaveCatalog(newCatalog);
    updateAndSaveLoanData({
      ...loanData,
      carrinho: [...loanData.carrinho, book],
    });
  };

  const value = useMemo(
    () => ({
      user,
      catalog,
      loanData,
      loading,
      login,
      logout,
      updateAndSaveCatalog,
      updateAndSaveLoanData,
      addToCart,
    }),
    [user, catalog, loanData, loading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
