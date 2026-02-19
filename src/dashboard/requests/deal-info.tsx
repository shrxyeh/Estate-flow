import { useParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-assetholder";

export default function RequestDetail() {
  const { id } = useParams();
  const [acceptedProposal, setAcceptedProposal] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mockRequest = {
    propertyName: "Jaipur Palace",
    description: "3BR eco-friendly house in southern Goa.",
    loanAmount: 150000,
    yieldPreference: 6.5,
    collateralType: "Yield-Based",
    image: "/properties/1.png",
  };

  const mockProposals = [
    { id: "p1", from: "proxybuyer.eth", rate: 5.8, months: 24 },
    { id: "p2", from: "builderdao.eth", rate: 6.2, months: 30 },
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-950 text-gray-100 overflow-x-hidden flex flex-col">
      <Header userRole="AH" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <Sidebar sidebarOpen={sidebarOpen} userRole="AH" userId={id || "1"} />

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto lg:ml-0">
          <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white">📋</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
                  Request Details
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Review and manage loan request #{id} with detailed information and proposals.
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
                <p className="text-white/90 text-lg">Investment Property</p>
              </div>
            </div>

            {/* Request Info */}
            <Card className="bg-gray-900/80 border-gray-800/50 shadow-2xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Property Information
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
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 md:col-span-2">
                    <p className="text-sm text-gray-400 mb-2">Description</p>
                    <p className="font-medium text-gray-100">
                      {mockRequest.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proposals Section */}
            <Card className="bg-gray-900/80 border-gray-800/50 shadow-2xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Active Proposals
                  </h3>
                  <p className="text-gray-400">
                    {mockProposals.length} proposal(s) received for this request
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {mockProposals.map((proposal) => (
                    <Card
                      key={proposal.id}
                      className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">From</p>
                            <p className="font-semibold text-gray-100 text-lg">
                              {proposal.from}
                            </p>
                          </div>
                          {acceptedProposal === proposal.id && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm">
                              Accepted
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                            <p className="text-sm text-gray-400 mb-1">Interest Rate</p>
                            <p className="font-semibold text-gray-100 text-xl">
                              {proposal.rate}%
                            </p>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                            <p className="text-sm text-gray-400 mb-1">Term</p>
                            <p className="font-semibold text-gray-100 text-xl">
                              {proposal.months}m
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          disabled={!!acceptedProposal}
                          onClick={() => setAcceptedProposal(proposal.id)}
                          className={`w-full h-12 transition-all duration-300 ${
                            acceptedProposal === proposal.id
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-lg hover:shadow-purple-500/25"
                          }`}
                        >
                          {acceptedProposal === proposal.id ? (
                            <div className="flex items-center gap-2">
                              <CheckCircleIcon className="h-5 w-5" />
                              Accepted
                            </div>
                          ) : (
                            "Accept Proposal"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {mockProposals.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-300 mb-2">No proposals yet</h4>
                    <p className="text-gray-400">Proposals will appear here once investors respond to your request.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
