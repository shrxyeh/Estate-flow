import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { useEstateFlowContract } from "@/hooks/useEstateFlowContract";
import { useRequests } from "@/contexts/RequestsContext";
import { useMetaMask } from "@/hooks/useMetaMask";
import { getPropertyImage } from "@/utils/imageUtils";

interface EstateFlowFormData {
  propertyName: string;
  loanAmount: string;
  description: string;
  collateralType: string;
  loanTerm: string;
  yieldPreference: string;
  propertyImage?: File;
}

interface EstateFlowSubmitHandlerProps {
  formData: EstateFlowFormData;
  onSuccess: (newRequest: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function EstateFlowSubmitHandler({
  formData,
  onSuccess,
  onError,
  disabled = false,
  className = ""
}: EstateFlowSubmitHandlerProps) {
  const { isSubmitting, error, txHash, submitEstateFlowRequest, clearError } = useEstateFlowContract();
  const { addRequest } = useRequests();
  const { account } = useMetaMask();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = useCallback(async () => {
    console.log('🎯 Submit button clicked');
    
    // Clear any previous errors
    clearError();
    setShowSuccess(false);

    // Validate required fields
    if (!formData.propertyName || !formData.loanAmount || !formData.description) {
      const errorMsg = 'Please fill in all required fields';
      if (onError) onError(errorMsg);
      return;
    }

    try {
      const newRequest = await submitEstateFlowRequest(formData);
      
      if (newRequest) {
        console.log('✅ Request submitted successfully');
        
        // Create a properly formatted request for the context
        const formattedRequest = {
          property: formData.propertyName,
          rate: parseFloat(formData.yieldPreference),
          months: parseInt(formData.loanTerm),
          loanAmount: parseFloat(formData.loanAmount),
          image: newRequest.imageUrl || getPropertyImage(formData.propertyName),
          description: formData.description,
          collateralType: formData.collateralType,
          yieldPreference: parseFloat(formData.yieldPreference),
          totalProofs: 6, // Default value for new requests
          creator: account || "Unknown",
          blockchainId: newRequest.id
        };

        // Add to local context (this will also save to localStorage)
        addRequest(formattedRequest);
        
        setShowSuccess(true);
        
        // Call success callback to update the dashboard
        onSuccess(newRequest);
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error('❌ Submit handler error:', err);
      if (onError) onError('Unexpected error during submission');
    }
  }, [formData, submitEstateFlowRequest, clearError, onSuccess, onError, addRequest, account, txHash]);

  // Show transaction status
  const renderTransactionStatus = () => {
    if (showSuccess) {
      return (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Request created successfully!</span>
          {txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              View transaction
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-red-300 hover:text-red-200 ml-2"
          >
            ×
          </button>
        </div>
      );
    }

    if (isSubmitting && txHash) {
      return (
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Transaction pending...</span>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
          >
            View on Etherscan
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      );
    }

    if (isSubmitting) {
      return (
        <div className="flex items-center gap-2 text-yellow-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Preparing transaction...</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        onClick={handleSubmit}
        disabled={disabled || isSubmitting}
        className={`w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-6 text-lg shadow-lg transition-all duration-300 ${
          isSubmitting ? 'opacity-75' : 'hover:scale-105 hover:shadow-xl'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {txHash ? 'Confirming Transaction...' : 'Preparing Transaction...'}
          </>
        ) : (
          'Submit Request'
        )}
      </Button>

      {/* Transaction Status Display */}
      {renderTransactionStatus()}

      {/* Network Check Helper */}
      {!isSubmitting && !error && !showSuccess && (
        <p className="text-xs text-gray-500 text-center">
          Ensure you're connected to Sepolia testnet before submitting
        </p>
      )}
    </div>
  );
}

