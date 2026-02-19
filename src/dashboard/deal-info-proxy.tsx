import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-proxy";

export default function DealInfoProxy() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mockRequest = {
    propertyName: "Jaipur Palace",
    description: "3BR eco-friendly house in southern Goa with modern amenities and sustainable features.",
    loanAmount: 150000,
    yieldPreference: 6.5,
    collateralType: "Yield-Based",
    image: "/properties/1.png",
    requestedBy: "assetholder.eth",
    loanTerm: 24,
    status: "Active",
  };

  return (
    <div className="min-h-screen w-screen bg-gray-950 text-gray-100 overflow-x-hidden flex flex-col">
      <Header userRole="PB" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <Sidebar sidebarOpen={sidebarOpen} userRole="PB" userId={id || "1"} />

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto lg:ml-0">
          <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white">🏢</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
                  Credit Swap Opportunity
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Review detailed information about this investment opportunity and submit your proposal.
                </p>
              </div>
            </div>

            {/* Property Image */}
            <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={mockRequest.image}
                alt={mockRequest.propertyName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/600x400/1f2937/ffffff?text=Property+Image";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-bold text-white mb-2">{mockRequest.propertyName}</h2>
                <p className="text-white/90 text-lg">Investment Opportunity #{id}</p>
              </div>
            </div>

            {/* Request Info */}
            <Card className="bg-gray-900/80 border-gray-800/50 shadow-2xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Investment Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400 mb-2">Property</p>
                    <p className="font-semibold text-gray-100 text-lg">
                      {mockRequest.propertyName}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400 mb-2">Loan Amount</p>
                    <p className="font-semibold text-gray-100 text-lg">
                      ${mockRequest.loanAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400 mb-2">Yield Preference</p>
                    <p className="font-semibold text-gray-100 text-lg">
                      {mockRequest.yieldPreference}%
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400 mb-2">Collateral Type</p>
                    <p className="font-semibold text-gray-100 text-lg">
                      {mockRequest.collateralType}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400 mb-2">Loan Term</p>
                    <p className="font-semibold text-gray-100 text-lg">
                      {mockRequest.loanTerm} months
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400 mb-2">Requested By</p>
                    <p className="font-semibold text-gray-100 text-lg">
                      {mockRequest.requestedBy}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 md:col-span-2 lg:col-span-3">
                    <p className="text-sm text-gray-400 mb-2">Description</p>
                    <p className="font-medium text-gray-100">
                      {mockRequest.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Section */}
            <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">Ready to Invest?</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                      Submit your competitive proposal for this investment opportunity and become a funding partner.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-green-500/25"
                      onClick={() => {
                        navigate("/dashboard/new-proposal");
                      }}
                    >
                      🚀 Submit Proposal
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg font-medium border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 rounded-xl"
                      onClick={() => {
                        navigate("/dashboard/swap-opportunities");
                      }}
                    >
                      ← Back to Opportunities
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
