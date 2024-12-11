// src/hooks/useCurrencyFormatter.js

import { useMemo } from 'react';

const useCurrencyFormatter = () => {
  const formatter = useMemo(() => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0, // No decimals
      maximumFractionDigits: 0, // No decimals
    });
  }, []);

  const formatCurrency = (amount) => {
    return formatter.format(amount);
  };

  return formatCurrency;
};

export default useCurrencyFormatter;
