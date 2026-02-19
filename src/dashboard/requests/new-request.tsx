import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/sidebar-assetholder";
import { Header } from "@/components/header";
import { useRequests } from "@/contexts/RequestsContext";
import { useEstateFlowContract } from "@/hooks/useEstateFlowContract";
import { useMetaMask } from "@/hooks/useMetaMask";
import { Loader2, AlertCircle, CheckCircle, ExternalLink, Wallet } from "lucide-react";
import { storeDynamicPropertyImage, getPropertyImage } from "@/utils/imageUtils";

export default function RequestNew() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { addRequest } = useRequests();
  const { isConnected, connect } = useMetaMask();
  const { 
    isSubmitting, 
    error, 
    txHash: contractTxHash,
    submitEstateFlowRequest,
    clearError 
  } = useEstateFlowContract();
  const [form, setForm] = useState({
    propertyName: "",
    description: "",
    loanAmount: "",
    months: "",
    collateralType: "",
    yieldPreference: "",
    propertyPhoto: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, propertyPhoto: file });
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      console.log(`📸 Image selected: ${file.name} (${file.size} bytes)`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    clearError();
    setShowSuccess(false);

    // Validate required fields
    if (!form.propertyName || !form.description || !form.loanAmount || !form.months || !form.collateralType) {
      alert("Please fill in all required fields");
      return;
    }

    // Check wallet connection
    if (!isConnected) {
      try {
        await connect();
        return; // Let user try again after connecting
      } catch (err) {
        alert("Please connect your MetaMask wallet to submit a request");
        return;
      }
    }

    try {
      console.log('🚀 Starting MetaMask transaction...');
      
      // Prepare form data for the contract
      const formData = {
        propertyName: form.propertyName,
        loanAmount: form.loanAmount,
        description: form.description,
        collateralType: form.collateralType,
        loanTerm: form.months,
        yieldPreference: form.yieldPreference || "0",
        propertyImage: form.propertyPhoto || undefined
      };

      // Submit via the hook (this handles MetaMask, network checking, etc.)
      const newRequest = await submitEstateFlowRequest(formData);

      if (newRequest) {
        console.log('✅ Request created successfully:', newRequest);

        // Handle image storage
        let imageUrl = newRequest.imageUrl;
        if (form.propertyPhoto && previewImage) {
          // Store the uploaded image dynamically
          storeDynamicPropertyImage(form.propertyName, previewImage);
          imageUrl = previewImage;
          console.log(`💾 Stored dynamic image for "${form.propertyName}": ${previewImage}`);
        } else if (!imageUrl) {
          // Use fallback image if no custom image
          imageUrl = getPropertyImage(form.propertyName);
          console.log(`🖼️ Using fallback image for "${form.propertyName}": ${imageUrl}`);
        }

        // Add to local state for immediate UI update
        const newRequestData = {
          property: form.propertyName,
          rate: form.yieldPreference ? parseFloat(form.yieldPreference) : 6.0,
          months: parseInt(form.months),
          totalProofs: 6,
          loanAmount: parseFloat(form.loanAmount),
          image: imageUrl,
          description: form.description,
          collateralType: form.collateralType,
          yieldPreference: form.yieldPreference ? parseFloat(form.yieldPreference) : undefined,
          creator: "Current User", // Will be replaced with actual user info
          blockchainId: newRequest.id || `dynamic_${Date.now()}`,
          createdAt: new Date(),
          status: "Open",
          proofSubmitted: 0
        };

        console.log('📝 Adding new request to context:', newRequestData);
        addRequest(newRequestData);

        // Show success message
        setShowSuccess(true);
        
        // Navigate to requests page after a delay
        setTimeout(() => {
          navigate("/dashboard/my-requests");
        }, 2000);
      }
    } catch (error: any) {
      console.error("❌ Transaction failed:", error);
      // Error handling is done by the hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 w-screen flex flex-col">
      <Header userRole="AH" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <Sidebar sidebarOpen={sidebarOpen} userRole="AH" userId="123" />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            {/* Wallet Connection Status */}
            {!isConnected && (
              <div className="bg-gradient-to-r from-yellow-600 to-orange-500 text-white px-6 py-4 rounded-xl shadow-lg border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6" />
                  <div className="flex-1">
                    <span className="font-medium">Connect your wallet to submit requests</span>
                    <p className="text-sm text-yellow-100 mt-1">MetaMask connection required for blockchain transactions</p>
                  </div>
                  <Button 
                    onClick={connect}
                    size="sm"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </div>
            )}



            {/* Transaction Error */}
            {error && (
              <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 rounded-xl shadow-lg border border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6" />
                  <div className="flex-1">
                    <span className="font-medium">Transaction Error</span>
                    <p className="text-sm text-red-100 mt-1">{error}</p>
                  </div>
                  <Button 
                    onClick={clearError}
                    size="sm"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}

            {/* Success State */}
            {showSuccess && (
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-xl shadow-lg border border-green-500/20 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  <div className="flex-1">
                    <span className="font-medium">Request created successfully!</span>
                    <p className="text-sm text-green-100 mt-1">
                      {contractTxHash ? 'Transaction confirmed on blockchain' : 'Redirecting to requests page...'}
                    </p>
                    {contractTxHash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${contractTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-100 hover:text-white inline-flex items-center gap-1 mt-1 text-sm"
                      >
                        View on Etherscan
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white">+</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
                  Create New Asset Request
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Submit a new asset request for funding consideration and connect with potential investors.
                </p>
              </div>
            </div>

            <Card className="bg-gray-900/80 border-gray-800/50 shadow-2xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
              <CardHeader className="pb-8">
                <CardTitle className="text-xl font-semibold text-gray-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Request Details
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Fill in the details below to create your asset request and attract funding partners.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Two-column layout for desktop */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="propertyName" className="text-gray-100 font-medium">
                        Property Name *
                      </Label>
                      <Input
                        name="propertyName"
                        value={form.propertyName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Jaipur Palace"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount" className="text-gray-100 font-medium">
                        Loan Amount (USD) *
                      </Label>
                      <Input
                        name="loanAmount"
                        type="number"
                        value={form.loanAmount}
                        onChange={handleChange}
                        required
                        placeholder="150000"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyPhoto" className="text-gray-100 font-medium">
                      Property Photo
                    </Label>
                    <div className="relative">
                      <Input
                        name="propertyPhoto"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-blue-600 file:text-white hover:file:from-purple-700 hover:file:to-blue-700 transition-all duration-200"
                      />
                      {previewImage && (
                        <div className="mt-4 relative">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-purple-500/30">
                            <img 
                              src={previewImage} 
                              alt="Property Preview" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setPreviewImage(null);
                                  setForm({ ...form, propertyPhoto: null });
                                }}
                                className="w-8 h-8 p-0 rounded-full"
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-green-400 mt-2 text-center">
                            ✓ Image preview ready for upload
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Upload a clear photo of the property (max 5MB). 
                      {!previewImage && " Image will be stored dynamically and available across the app."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-100 font-medium">
                      Description *
                    </Label>
                    <Textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Describe your property, its features, location, and investment potential..."
                      className="bg-gray-800/50 border-gray-700/50 text-gray-100 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="collateralType" className="text-gray-100 font-medium">
                        Collateral Type *
                      </Label>
                      <Input
                        name="collateralType"
                        value={form.collateralType}
                        onChange={handleChange}
                        required
                        placeholder="e.g., yield, direct"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="months" className="text-gray-100 font-medium">
                        Loan Term (months) *
                      </Label>
                      <Input
                        name="months"
                        type="number"
                        value={form.months}
                        onChange={handleChange}
                        required
                        placeholder="24"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yieldPreference" className="text-gray-100 font-medium">
                      Yield Preference %
                    </Label>
                    <Input
                      name="yieldPreference"
                      type="number"
                      step="0.1"
                      value={form.yieldPreference}
                      onChange={handleChange}
                      placeholder="6.5"
                      className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 lg:w-1/2"
                    />
                    <p className="text-sm text-gray-400">
                      Optional: Specify your preferred yield percentage
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isConnected}
                      className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {contractTxHash ? 'Confirming Transaction...' : 'Preparing Transaction...'}
                        </div>
                      ) : !isConnected ? (
                        <div className="flex items-center gap-3">
                          <Wallet className="w-5 h-5" />
                          Connect Wallet First
                        </div>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                    
                    {/* Transaction Status */}
                    {isSubmitting && contractTxHash && (
                      <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transaction pending...</span>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${contractTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                        >
                          View on Etherscan
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    
                    {/* Helper Text */}
                    {isConnected && !isSubmitting && !error && (
                      <p className="text-xs text-gray-500 text-center">
                        This will create a transaction on Sepolia testnet
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
