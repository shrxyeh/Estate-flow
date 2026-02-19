import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BriefcaseIcon, PlusIcon, Home } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-assetholder";
import { useNavigate } from "react-router-dom";
import { useRequests } from "@/contexts/RequestsContext";
import { getPropertyImage, getFallbackImage } from "@/utils/imageUtils";

export default function MyRequests() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = "AH"; // This should come from your auth system
  const userId = "123"; // This should come from your auth system
  const navigate = useNavigate();
  const { requests } = useRequests();

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
                  Credit Swap Requests
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  Manage your requests for Credit Swaps and ongoing loans.
                </p>
              </div>
              <Button
                onClick={() => navigate("/dashboard/requests/new")}
                className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 w-full sm:w-auto"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create New Request
              </Button>
            </div>

            {/* Stats Overview */}
            {requests.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gray-900/50 border-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Requests</p>
                        <p className="text-2xl font-bold text-gray-100">{requests.length}</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <BriefcaseIcon className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/50 border-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Open Requests</p>
                        <p className="text-2xl font-bold text-green-400">
                          {requests.filter(r => r.status === "Open").length}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/50 border-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-yellow-400">
                          {requests.filter(r => r.status === "Pending").length}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/50 border-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Value</p>
                        <p className="text-2xl font-bold text-blue-400">
                          ${requests.reduce((sum, r) => sum + r.loanAmount, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-500 font-bold text-lg">$</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {requests.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No EstateFlow Requests</h3>
                <div className="text-gray-400 text-base mb-6 max-w-md mx-auto">
                  Start your journey by creating your first EstateFlow request to connect with crypto holders.
                </div>
                <Button
                  onClick={() => navigate("/dashboard/requests/new")}
                  className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New Request
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full">
                {requests.map((proposal) => {
                  console.log(`🖼️ Rendering proposal:`, { 
                    id: proposal.id, 
                    property: proposal.property, 
                    image: proposal.image,
                    resolvedImage: getPropertyImage(proposal.property, proposal.image)
                  });
                  
                  return (
                <Card key={proposal.id} className="bg-gray-900/80 border-gray-800 hover:bg-gray-900 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 group">
                  <CardContent className="p-0">
                    <div className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden">
                      <img
                        src={getPropertyImage(proposal.property, proposal.image)}
                        alt={proposal.property}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.log(`❌ Image failed to load: ${e.currentTarget.src}`);
                          // Use fallback image if the main image fails
                          const fallbackImage = getFallbackImage(proposal.property);
                          if (e.currentTarget.src !== fallbackImage) {
                            e.currentTarget.src = fallbackImage;
                          } else {
                            // If fallback also fails, use a generic placeholder
                            e.currentTarget.src = "https://placehold.co/600x400/1f2937/ffffff?text=Property+Image";
                          }
                        }}
                        onLoad={() => {
                          console.log(`✅ Image loaded successfully: ${proposal.property}`);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <Badge
                        className={`absolute top-3 right-3 ${
                          proposal.status === "Open"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        } text-white border-0`}
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon className="text-purple-500 h-5 w-5 flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-gray-100 truncate">
                          {proposal.property}
                        </h3>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Interest Rate:</span>
                          <span className="text-purple-400 font-medium">{proposal.rate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Loan Amount:</span>
                          <span className="text-green-400 font-medium">${proposal.loanAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Repayment:</span>
                          <span className="text-gray-300 font-medium">{proposal.months} months</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Proofs:</span>
                          <span className="text-blue-400 font-medium">
                            {proposal.proofSubmitted}/{proposal.totalProofs}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <Progress 
                            value={(proposal.proofSubmitted / proposal.totalProofs) * 100} 
                            className="h-2 bg-gray-800"
                          />
                        </div>
                      </div>
                      
                      <Button
                        className="w-full mt-4 bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
                        onClick={() =>
                          navigate(`/dashboard/manage/${proposal.id}`)
                        }
                      >
                        View More Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )})}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
