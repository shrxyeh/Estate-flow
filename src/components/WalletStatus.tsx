import { useMetaMask } from "@/hooks/useMetaMask";
import { Wallet, Copy, CheckCircle } from "lucide-react";
import { useState, useCallback } from "react";

export default function WalletStatus() {
  const { account, isConnected } = useMetaMask();
  const [copied, setCopied] = useState(false);

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

  if (!isConnected || !account) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-2 rounded-lg">
      <Wallet className="w-4 h-4" />
      <span className="text-sm font-medium">Connected</span>
      <span className="text-xs text-green-300">•</span>
      <span className="text-sm font-mono">{formatAddress(account)}</span>
      <button
        onClick={copyAddress}
        className="text-green-300 hover:text-green-200 transition-colors"
        title="Copy address"
      >
        {copied ? (
          <CheckCircle className="w-3 h-3" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    </div>
  );
}
