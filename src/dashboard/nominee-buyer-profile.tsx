import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BriefcaseIcon, PlusIcon, Home, DollarSign, TrendingUp, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-proxy";
import { useNavigate } from "react-router-dom";
import { useRequests } from "@/contexts/RequestsContext";
import { getFallbackImage } from "@/utils/imageUtils";
import { getPropertyImage } from "@/utils/imageUtils";

export default function NomineeBuyerProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = "PB"; // Nominee Buyer
  const userId = "123";
  const navigate = useNavigate();
  const { 
    requests, 
    isLoading, 
    syncWithBlockchain, 
    resetToInitialData, 
    inspectLocalStorage,
    refreshData,
    getOpenRequests
  } = useRequests();

  // Filter only open requests for investment opportunities
  const availableProperties = getOpenRequests();
  
  // Refresh data when component mounts to ensure latest data
  useEffect(() => {
    console.log('🔄 NomineeBuyerProfile mounted, refreshing data...');
    refreshData();
  }, [refreshData]);

  // Log when available properties change
  useEffect(() => {
    console.log('📊 Available properties updated:', availableProperties);
  }, [availableProperties]);

  const stats = {
    totalProperties: availableProperties.length,
    totalValue: availableProperties.reduce((sum, prop) => sum + prop.loanAmount, 0),
    averageRate: availableProperties.length > 0 
      ? (availableProperties.reduce((sum, prop) => sum + prop.rate, 0) / availableProperties.length).toFixed(1)
      : "0.0",
    totalRequests: requests.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Completed':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 w-screen flex flex-col">
      <Header
        userRole={userRole}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 relative">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <Sidebar
          sidebarOpen={sidebarOpen}
          userRole={userRole}
          userId={userId}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
                  Nominee Buyer Profile
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  Discover and invest in real estate opportunities through EstateFlow.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={syncWithBlockchain}
                  disabled={isLoading}
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  🔄 Sync Blockchain
                </Button>
                <Button
                  onClick={refreshData}
                  className="bg-green-600 text-white hover:bg-green-700 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
                >
                  🔄 Refresh Data
                </Button>
                <Button
                  onClick={inspectLocalStorage}
                  className="bg-yellow-600 text-white hover:bg-yellow-700 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/25"
                >
                  🔍 Inspect Data
                </Button>
                <Button
                  onClick={resetToInitialData}
                  className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
                >
                  🔄 Reset Data
                </Button>
                <Button
                  onClick={() => navigate("/dashboard/swap-opportunities")}
                  className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  View All Opportunities
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Available Properties</p>
                      <p className="text-2xl font-bold text-gray-100">{stats.totalProperties}</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Investment Value</p>
                      <p className="text-2xl font-bold text-green-400">
                        {formatCurrency(stats.totalValue)}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Average Interest Rate</p>
                      <p className="text-2xl font-bold text-blue-400">{stats.averageRate}%</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Requests</p>
                      <p className="text-2xl font-bold text-yellow-400">{stats.totalRequests}</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <BriefcaseIcon className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Properties Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Available Investment Properties
                </h2>
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1">
                  {availableProperties.length} Active
                </Badge>
              </div>
              
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Syncing with Blockchain</h3>
                  <p className="text-gray-400">Loading latest property data...</p>
                </div>
              ) : availableProperties.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Home className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Available Properties</h3>
                  <p className="text-gray-400 text-base mb-6 max-w-md mx-auto">
                    There are currently no properties available for investment. Check back later or sync with the blockchain.
                  </p>
                  <Button
                    onClick={syncWithBlockchain}
                    className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    🔄 Sync Blockchain
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {availableProperties.map((property) => (
                    <Card key={property.id} className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 hover:border-gray-700/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                      <CardContent className="p-6 space-y-4">
                        <div className="relative w-full h-48 rounded-xl overflow-hidden">
                          <img
                            src={getPropertyImage(property.property, property.image)}
                            alt={property.property}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Use fallback image if the main image fails
                              const fallbackImage = getFallbackImage(property.property);
                              if (e.currentTarget.src !== fallbackImage) {
                                e.currentTarget.src = fallbackImage;
                              } else {
                                // If fallback also fails, use a generic placeholder
                                e.currentTarget.src = "https://placehold.co/600x400/1f2937/ffffff?text=Property+Image";
                              }
                            }}
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className={getStatusColor(property.status)}>
                              {property.status}
                            </Badge>
                          </div>
                          {property.blockchainId && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-blue-500/80 text-white text-xs">
                                {property.blockchainId}
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <BriefcaseIcon className="text-purple-500 h-5 w-5" />
                            <h3 className="text-lg font-semibold text-gray-100">
                              {property.property}
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-800/30 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Interest Rate</p>
                              <p className="text-lg font-semibold text-green-400">{property.rate}%</p>
                            </div>
                            <div className="p-3 bg-gray-800/30 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Term</p>
                              <p className="text-lg font-semibold text-blue-400">{property.months}m</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-800/30 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Investment Amount</p>
                            <p className="text-xl font-bold text-yellow-400">
                              {formatCurrency(property.loanAmount)}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Proofs:</span>
                              <span className="text-gray-300 font-medium">
                                {property.proofSubmitted}/{property.totalProofs}
                              </span>
                            </div>
                            <Progress 
                              value={(property.proofSubmitted / property.totalProofs) * 100} 
                              className="h-2 bg-gray-800"
                            />
                          </div>

                          {property.creator && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <User className="w-3 h-3" />
                              <span>Creator: {property.creator.slice(0, 6)}...{property.creator.slice(-4)}</span>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <Button
                              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25"
                              onClick={() => navigate(`/dashboard/deal-info-proxy/${property.id}`)}
                            >
                              💼 View Investment Details
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full h-10 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
                              onClick={() => navigate(`/dashboard/requests/new-proposal?propertyId=${property.id}`)}
                            >
                              📝 Submit Proposal
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
