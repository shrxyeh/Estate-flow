import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';

// Sepolia testnet configuration
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
const SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';

// Contract configuration - will be updated by deployment script
const CONTRACT_ADDRESS = '0x4e37558d4DFA9c8526724C4c37a5461Ee3720f04';
const CONTRACT_ABI = [
  "function createEstateFlowRequest(string memory propertyName, uint256 loanAmount, string memory description, string memory collateralType, uint256 loanTerm, uint256 yieldPreference, string memory imageHash) external returns (uint256)",
  "function getRequest(uint256 requestId) external view returns (tuple(uint256 id, address creator, string propertyName, uint256 loanAmount, string description, string collateralType, uint256 loanTerm, uint256 yieldPreference, string imageHash, uint256 createdAt, uint8 status))",
  "function getUserRequests(address user) external view returns (uint256[] memory)",
  "function getTotalRequests() external view returns (uint256)",
  "function updateRequestStatus(uint256 requestId, uint8 newStatus) external",
  "function owner() external view returns (address)",
  "event EstateFlowRequestCreated(uint256 indexed requestId, address indexed creator, string propertyName, uint256 loanAmount, uint256 timestamp)",
  "event RequestStatusUpdated(uint256 indexed requestId, uint8 oldStatus, uint8 newStatus, uint256 timestamp)"
];

interface EstateFlowRequest {
  id: string;
  propertyName: string;
  loanAmount: string;
  description: string;
  collateralType: string;
  loanTerm: string;
  yieldPreference: string;
  imageUrl: string;
  status: 'Open' | 'Pending' | 'Completed';
  interestRate: string;
  creator: string;
  createdAt: Date;
}

interface ContractState {
  isSubmitting: boolean;
  error: string | null;
  txHash: string | null;
}

export function useEstateFlowContract() {
  const { isConnected, account } = useMetaMask();
  const [state, setState] = useState<ContractState>({
    isSubmitting: false,
    error: null,
    txHash: null
  });

  const checkNetwork = useCallback(async (): Promise<boolean> => {
    if (!window.ethereum) {
      setState(prev => ({ ...prev, error: 'MetaMask not detected' }));
      return false;
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Current chain ID:', chainId);
      
      if (chainId !== SEPOLIA_CHAIN_ID) {
        console.log('Wrong network, switching to Sepolia...');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
          return true;
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Network not added, add it
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: [SEPOLIA_RPC_URL],
                  blockExplorerUrls: ['https://sepolia.etherscan.io/']
                }]
              });
              return true;
            } catch (addError) {
              setState(prev => ({ ...prev, error: 'Failed to add Sepolia network' }));
              return false;
            }
          } else {
            setState(prev => ({ ...prev, error: 'Failed to switch to Sepolia network' }));
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Network check error:', error);
      setState(prev => ({ ...prev, error: 'Failed to check network' }));
      return false;
    }
  }, []);

  const submitEstateFlowRequest = useCallback(async (
    formData: {
      propertyName: string;
      loanAmount: string;
      description: string;
      collateralType: string;
      loanTerm: string;
      yieldPreference: string;
      propertyImage?: File;
    }
  ): Promise<EstateFlowRequest | null> => {
    console.log('🏠 Starting EstateFlow request submission...');
    
    // Reset state
    setState({
      isSubmitting: false,
      error: null,
      txHash: null
    });

    // Check wallet connection
    if (!isConnected || !account) {
      setState(prev => ({ ...prev, error: 'Please connect your MetaMask wallet first' }));
      return null;
    }

    // Check/switch network
    const isCorrectNetwork = await checkNetwork();
    if (!isCorrectNetwork) {
      return null;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Handle image upload simulation
      let imageUrl = '/placeholder-property.jpg'; // Default placeholder
      if (formData.propertyImage) {
        // For demo purposes, create a local URL for the uploaded image
        imageUrl = URL.createObjectURL(formData.propertyImage);
        console.log('🖼️ Using uploaded image preview:', imageUrl);
      }

      // Create contract instance
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log('📝 Preparing transaction data...');
      
      // Convert form data for contract
      const loanAmountWei = ethers.parseEther(formData.loanAmount);
      const imageHash = formData.propertyImage ? 
        `ipfs://demo-hash-${Date.now()}` : // Demo hash
        'ipfs://placeholder-hash';

      console.log('💰 Loan amount (Wei):', loanAmountWei.toString());
      console.log('📋 Contract parameters:', {
        propertyName: formData.propertyName,
        loanAmount: loanAmountWei.toString(),
        description: formData.description,
        collateralType: formData.collateralType,
        loanTerm: formData.loanTerm,
        yieldPreference: formData.yieldPreference,
        imageHash
      });

      // Execute contract transaction
      console.log('🚀 Sending transaction to contract...');
      const tx = await contract.createEstateFlowRequest(
        formData.propertyName,
        loanAmountWei,
        formData.description,
        formData.collateralType,
        parseInt(formData.loanTerm),
        parseInt(formData.yieldPreference),
        imageHash
      );

      console.log('⏳ Transaction sent:', tx.hash);
      setState(prev => ({ ...prev, txHash: tx.hash }));

      // Wait for transaction confirmation
      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt);

      // Parse events to get request ID
      let requestId = Date.now().toString(); // Fallback ID
      if (receipt.logs && receipt.logs.length > 0) {
        try {
          const parsedLog = contract.interface.parseLog(receipt.logs[0]);
          if (parsedLog && parsedLog.args[0]) {
            requestId = parsedLog.args[0].toString();
          }
        } catch (parseError) {
          console.warn('Could not parse log for request ID, using fallback');
        }
      }

      // Create new request object for immediate UI update
      const newRequest: EstateFlowRequest = {
        id: requestId,
        propertyName: formData.propertyName,
        loanAmount: formData.loanAmount,
        description: formData.description,
        collateralType: formData.collateralType,
        loanTerm: formData.loanTerm,
        yieldPreference: formData.yieldPreference,
        imageUrl,
        status: 'Open',
        interestRate: '0.0', // Will be determined by proposals
        creator: account,
        createdAt: new Date()
      };

      setState(prev => ({ ...prev, isSubmitting: false }));
      console.log('✅ EstateFlow request created successfully:', newRequest);
      
      return newRequest;

    } catch (error: any) {
      console.error('❌ Transaction failed:', error);
      
      let errorMessage = 'Transaction failed';
      if (error.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.code === -32603) {
        errorMessage = 'Internal JSON-RPC error';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: errorMessage
      }));
      
      return null;
    }
  }, [isConnected, account, checkNetwork]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    submitEstateFlowRequest,
    clearError,
    checkNetwork
  };
}
