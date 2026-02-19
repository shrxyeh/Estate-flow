import { Button } from "@/components/ui/button";
import { useMetaMask } from "@/hooks/useMetaMask";
import { Wallet, Download, ExternalLink, AlertCircle, CheckCircle, Copy } from "lucide-react";
import { useState, useCallback } from "react";

interface MetaMaskButtonProps {
  onConnect?: (account: string) => void;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function MetaMaskButton({ 
  onConnect, 
  className = "",
  size = "default",
  variant = "default"
}: MetaMaskButtonProps) {
  const { isInstalled, isConnected, isConnecting, account, error, connect, disconnect, clearError } = useMetaMask();
  const [copied, setCopied] = useState(false);

  const handleConnect = useCallback(async () => {
    await connect();
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    if (onConnect) {
      onConnect("");
    }
  }, [disconnect, onConnect]);

  const copyAddress = useCallback(async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  }, [account]);

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const openMetaMaskWebsite = useCallback(() => {
    window.open("https://metamask.io/download/", "_blank");
  }, []);

  // If MetaMask is not installed, show install prompt
  if (!isInstalled) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-300">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">MetaMask not detected</span>
        </div>
        <p className="text-yellow-200 text-sm text-center">
          Please install MetaMask to use this app
        </p>
        <Button
          onClick={openMetaMaskWebsite}
          size={size}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Install MetaMask
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // If connected, show account info and disconnect button
  if (isConnected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-2 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Connected</span>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 text-gray-300 px-3 py-2 rounded-lg">
          <Wallet className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-mono">{formatAddress(account)}</span>
          <button
            onClick={copyAddress}
            className="text-gray-400 hover:text-white transition-colors"
            title="Copy address"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size={size}
          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  // Show connect button with error handling
  return (
    <div className="flex flex-col items-center gap-3">
      {error && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
          <button
            onClick={clearError}
            className="text-red-300 hover:text-red-200 ml-2"
          >
            ×
          </button>
        </div>
      )}
      
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        size={size}
        variant={variant}
        className={className}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect MetaMask"}
      </Button>
    </div>
  );
}
