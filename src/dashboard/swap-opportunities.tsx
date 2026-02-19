import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-proxy";
import { useNavigate } from "react-router-dom";
import { getPropertyImage, getFallbackImage } from "@/utils/imageUtils";

const mockProposals = [
  {
    id: "p1",
    property: "Jaipur Palace",
    rate: 5.9,
    months: 24,
    status: "Open",
    proofSubmitted: 2,
    totalProofs: 6,
    loanAmount: 250000,
    image: "/properties/1.png",
  },
  {
    id: "p2",
    property: "Pune Residency",
    rate: 6.3,
    months: 36,
    status: "Pending",
    proofSubmitted: 0,
    totalProofs: 6,
    loanAmount: 320000,
    image: "/properties/2.png",
  },
  {
    id: "p3",
    property: "Goa Beach Villa",
    rate: 5.5,
    months: 48,
    status: "Open",
    proofSubmitted: 4,
    totalProofs: 6,
    loanAmount: 450000,
    image: "/properties/3.png",
  },
  {
    id: "p4",
    property: "Bangalore Tech Park",
    rate: 6.1,
    months: 30,
    status: "Open",
    proofSubmitted: 1,
    totalProofs: 6,
    loanAmount: 380000,
    image: "/properties/4.png",
  },
  {
    id: "p5",
    property: "Hyderabad Heights",
    rate: 5.7,
    months: 36,
    status: "Pending",
    proofSubmitted: 3,
    totalProofs: 6,
    loanAmount: 290000,
    image: "/properties/5.png",
  },
  {
    id: "p6",
    property: "Chennai Marina",
    rate: 6.0,
    months: 24,
    status: "Open",
    proofSubmitted: 5,
    totalProofs: 6,
    loanAmount: 275000,
    image: "/properties/6.png",
  },
];

export default function ProposalTracker() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = "PB"; // This should come from your auth system
  const userId = "123"; // This should come from your auth system
  const navigate = useNavigate();

  const stats = {
    totalOpportunities: mockProposals.length,
    openOpportunities: mockProposals.filter(p => p.status === "Open").length,
    averageRate: (mockProposals.reduce((sum, p) => sum + p.rate, 0) / mockProposals.length).toFixed(1),
    totalValue: mockProposals.reduce((sum, p) => sum + p.loanAmount, 0)
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
          <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white">💰</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
                  Credit Swap Opportunities
                </h1>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                  Explore high-yield investment opportunities to fund property loans and earn competitive returns through Credit Swap agreements.
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">📊</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-blue-400 mb-1">
                    {stats.totalOpportunities}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Total Opportunities</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">🟢</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-green-400 mb-1">
                    {stats.openOpportunities}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Available Now</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">📈</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-yellow-400 mb-1">
                    {stats.averageRate}%
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Avg. Interest Rate</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">💵</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1">
                    ${(stats.totalValue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Total Value</div>
                </CardContent>
              </Card>
            </div>

            {/* Opportunities Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Available Opportunities
                </h2>
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1">
                  {stats.openOpportunities} Active
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProposals.map((proposal) => (
                  <Card key={proposal.id} className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 hover:border-gray-700/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                    <CardContent className="p-6 space-y-4">
                      <div className="relative w-full h-48 rounded-xl overflow-hidden">
                        <img
                          src={getPropertyImage(proposal.property, proposal.image)}
                          alt={proposal.property}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Use fallback image if the main image fails
                            const fallbackImage = getFallbackImage(proposal.property);
                            if (e.currentTarget.src !== fallbackImage) {
                              e.currentTarget.src = fallbackImage;
                            } else {
                              // If fallback also fails, use a generic placeholder
                              e.currentTarget.src = "https://placehold.co/600x400/1f2937/ffffff?text=Property+Image";
                            }
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <Badge
                            className={`${
                              proposal.status === "Open"
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-yellow-500 hover:bg-yellow-600 text-black"
                            } transition-colors`}
                          >
                            {proposal.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <BriefcaseIcon className="text-yellow-500 h-5 w-5" />
                          <h3 className="text-lg font-semibold text-gray-100">
                            {proposal.property}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-gray-800/30 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Interest Rate</p>
                            <p className="text-lg font-semibold text-green-400">{proposal.rate}%</p>
                          </div>
                          <div className="p-3 bg-gray-800/30 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Term</p>
                            <p className="text-lg font-semibold text-blue-400">{proposal.months}m</p>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Loan Amount</p>
                          <p className="text-xl font-bold text-yellow-400">
                            ${proposal.loanAmount.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-gray-300 font-medium">
                            {proposal.proofSubmitted}/{proposal.totalProofs} proofs
                          </span>
                        </div>
                        
                        <Button
                          className="w-full h-12 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 rounded-xl font-medium hover:shadow-lg hover:shadow-yellow-500/25"
                          onClick={() =>
                            navigate(`/dashboard/deal-info-proxy/${proposal.id}`)
                          }
                        >
                          🔍 View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
