import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from './useMetaMask';

export function useWalletNavigation() {
  const navigate = useNavigate();
  const { isConnected, account } = useMetaMask();

  const handleBuyHouse = useCallback(() => {
    if (!isConnected || !account) {
      alert("Please connect your MetaMask wallet first!");
      return false;
    }
    
    console.log('🏠 Navigating to Buy House page');
    navigate("/dashboard/my-deals");
    return true;
  }, [isConnected, account, navigate]);

  const handleOfferEstateFlow = useCallback(() => {
    if (!isConnected || !account) {
      alert("Please connect your MetaMask wallet first!");
      return false;
    }
    
    console.log('💼 Navigating to Offer EstateFlow page');
    navigate("/dashboard/requests/new");
    return true;
  }, [isConnected, account, navigate]);

  const handleGetStarted = useCallback(() => {
    if (!isConnected || !account) {
      alert("Please connect your MetaMask wallet first!");
      return false;
    }
    
    console.log('🚀 Navigating to main dashboard');
    navigate("/dashboard/my-requests");
    return true;
  }, [isConnected, account, navigate]);

  return {
    isConnected,
    account,
    handleBuyHouse,
    handleOfferEstateFlow,
    handleGetStarted,
  };
}
