import { useState, useEffect, useCallback, useRef } from 'react';

interface MetaMaskState {
  isInstalled: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  error: string | null;
}

interface MetaMaskActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
}

export function useMetaMask(): MetaMaskState & MetaMaskActions {
  const [state, setState] = useState<MetaMaskState>({
    isInstalled: false,
    isConnected: false,
    isConnecting: false,
    account: null,
    error: null,
  });

  const isInitialized = useRef(false);

  // Check if MetaMask is installed on mount (only once)
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const checkMetaMask = async () => {
      const isInstalled = typeof window !== 'undefined' && !!window.ethereum;
      console.log('🔍 Checking MetaMask installation:', isInstalled);
      setState(prev => ({ ...prev, isInstalled }));
      
      // If MetaMask is installed, check if already connected
      if (isInstalled && window.ethereum) {
        console.log('🔍 MetaMask detected, checking existing connection...');
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          console.log('📋 Initial accounts check:', accounts);
          if (accounts.length > 0) {
            console.log('✅ Setting initial connected state with account:', accounts[0]);
            setState(prev => ({
              ...prev,
              isInstalled,
              isConnected: true,
              account: accounts[0],
            }));
          } else {
            console.log('📋 No initial accounts found');
            setState(prev => ({
              ...prev,
              isInstalled,
              isConnected: false,
              account: null,
            }));
          }
        } catch (error) {
          console.error('❌ Error checking initial connection:', error);
          setState(prev => ({ ...prev, isInstalled }));
        }
      }
    };

    checkMetaMask();
  }, []);

  // Listen for account changes (only when MetaMask is installed)
  useEffect(() => {
    if (!state.isInstalled) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('🔄 Accounts changed:', accounts);
      if (accounts.length === 0) {
        // User disconnected
        setState(prev => ({
          ...prev,
          isConnected: false,
          account: null,
        }));
      } else {
        // Account changed
        setState(prev => ({
          ...prev,
          isConnected: true,
          account: accounts[0],
        }));
      }
    };

    const handleChainChanged = () => {
      console.log('🔗 Chain changed, reloading page...');
      // Reload page on chain change for simplicity
      window.location.reload();
    };

    const handleDisconnect = () => {
      console.log('❌ MetaMask disconnected');
      setState(prev => ({
        ...prev,
        isConnected: false,
        account: null,
      }));
    };

    // Add event listeners
    if (window.ethereum) {
      const ethereum = window.ethereum;
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('disconnect', handleDisconnect);

      // Cleanup
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
        ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [state.isInstalled]);

  const connect = useCallback(async () => {
    if (!state.isInstalled || !window.ethereum) {
      console.log('❌ MetaMask not installed');
      setState(prev => ({ ...prev, error: 'MetaMask not detected. Please install it.' }));
      return;
    }

    console.log('🔌 Initiating MetaMask connection...');
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('📋 Received accounts:', accounts);

      if (accounts.length > 0) {
        setState(prev => ({
          ...prev,
          isConnected: true,
          account: accounts[0],
          isConnecting: false,
        }));
        console.log('✅ Successfully connected to account:', accounts[0]);
      } else {
        setState(prev => ({
          ...prev,
          error: 'No accounts found',
          isConnecting: false,
        }));
        console.log('⚠️ No accounts found');
      }
    } catch (error: any) {
      console.error('❌ Connection error:', error);
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user';
        console.log('❌ User rejected connection');
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
        console.log('⚠️ Connection request already pending');
      } else if (error.message) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isConnecting: false,
      }));
    }
  }, [state.isInstalled]);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting wallet...');
    setState(prev => ({
      ...prev,
      isConnected: false,
      account: null,
      error: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    console.log('🧹 Clearing error...');
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    clearError,
  };
}
