import { useNavigate } from "react-router-dom";
import { useMetaMask } from "@/hooks/useMetaMask";
import MetaMaskButton from "./MetaMaskButton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

// This is an example of how to integrate MetaMask into your existing landing page
// You can copy this pattern and adapt it to your current home.tsx
export default function MetaMaskIntegration() {
  const navigate = useNavigate();
  const { isConnected, account } = useMetaMask();

  const handleGetStarted = () => {
    if (isConnected && account) {
      // User is authenticated, navigate to dashboard
      navigate("/dashboard/my-requests");
    } else {
      // User needs to connect wallet first
      alert("Please connect your MetaMask wallet first!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* MetaMask Connection Status */}
      <div className="w-full max-w-md">
        <MetaMaskButton 
          onConnect={(account) => {
            if (account) {
              console.log("Wallet connected:", account);
              // You can add any additional logic here when wallet connects
            }
          }}
        />
      </div>

      {/* Get Started Button - Only enabled when connected */}
      <Button
        onClick={handleGetStarted}
        disabled={!isConnected}
        size="lg"
        className={`px-8 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 transform group relative overflow-hidden ${
          isConnected 
            ? "bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white hover:scale-110 hover:-translate-y-2 hover:shadow-3xl hover:shadow-purple-500/40" 
            : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <span className="relative z-10">
          {isConnected ? "Get Started" : "Connect Wallet First"}
        </span>
        <ArrowRight className="w-5 h-5 ml-2 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>

      {/* Connection Status Info */}
      {!isConnected && (
        <div className="text-center p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg max-w-md">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">Secure Access Required</span>
          </div>
          <p className="text-blue-200 text-sm">
            Connect your MetaMask wallet to access the EstateFlow platform and start your real estate investment journey.
          </p>
        </div>
      )}

      {/* Connected Status */}
      {isConnected && account && (
        <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg max-w-md">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">Wallet Connected</span>
          </div>
          <p className="text-green-200 text-sm">
            You're all set! Click "Get Started" to access the platform.
          </p>
        </div>
      )}
    </div>
  );
}
