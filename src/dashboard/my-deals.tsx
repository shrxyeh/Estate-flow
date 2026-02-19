import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-proxy";

const mockDeals = [
  {
    id: 1,
    propertyName: "Kolkata Sunset",
    loanValue: 2500000,
    interestRate: 4.5,
    status: "accepted",
    image: "/properties/1.png",
    loanTerm: 36,
    submittedDate: "2024-01-15",
    description: "Luxury residential complex in Kolkata with modern amenities",
  },
  {
    id: 2,
    propertyName: "Delhi Central",
    loanValue: 5000000,
    interestRate: 5.2,
    status: "pending",
    image: "/properties/2.png",
    loanTerm: 24,
    submittedDate: "2024-02-10",
    description: "Prime commercial property in central Delhi business district",
  },
  {
    id: 3,
    propertyName: "Mumbai Heights",
    loanValue: 8000000,
    interestRate: 5.0,
    status: "completed",
    image: "/properties/3.png",
    loanTerm: 48,
    submittedDate: "2023-12-05",
    description: "High-rise residential development in Mumbai financial district",
  },
  {
    id: 4,
    propertyName: "Bangalore Tech Park",
    loanValue: 3750000,
    interestRate: 4.8,
    status: "accepted",
    image: "/properties/4.png",
    loanTerm: 30,
    submittedDate: "2024-01-28",
    description: "Modern tech park complex in Bangalore IT corridor",
  },
];

export default function MyDeals() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { userRole } = useUser();
  const userId = "123"; // This should come from your auth context/state

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      accepted: "bg-green-500 hover:bg-green-600 text-white",
      pending: "bg-yellow-500 hover:bg-yellow-600 text-black",
      rejected: "bg-red-500 hover:bg-red-600 text-white",
      completed: "bg-blue-500 hover:bg-blue-600 text-white",
    };

    return (
      <Badge className={`${statusStyles[status as keyof typeof statusStyles]} transition-colors px-3 py-1 font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const stats = {
    totalProposals: mockDeals.length,
    accepted: mockDeals.filter(d => d.status === "accepted").length,
    pending: mockDeals.filter(d => d.status === "pending").length,
    completed: mockDeals.filter(d => d.status === "completed").length,
    totalValue: mockDeals.reduce((sum, deal) => sum + deal.loanValue, 0)
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 w-screen flex flex-col">
      <Header userRole="PB" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

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
          <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white">📊</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
                  My Credit Swap Proposals
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Track and manage your Credit Swap proposals, monitor their status, and access detailed information.
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">📋</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-blue-400 mb-1">
                    {stats.totalProposals}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Total Proposals</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">✅</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-green-400 mb-1">
                    {stats.accepted + stats.completed}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Successful</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">⏳</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-yellow-400 mb-1">
                    {stats.pending}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Pending</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">💰</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1">
                    ${(stats.totalValue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Total Value</div>
                </CardContent>
              </Card>
            </div>

            {/* Proposals Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Your Proposals
                </h2>
                <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1">
                  {stats.totalProposals} Total
                </Badge>
              </div>
              
              <div className="grid gap-6">
                {mockDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 hover:border-gray-700/50 transition-all duration-300 cursor-pointer hover:transform hover:scale-[1.01]"
                    onClick={() => navigate(`/dashboard/manage-proxy/${deal.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Property Image */}
                        <div className="w-full lg:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={deal.image}
                            alt={deal.propertyName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/600x400/1f2937/ffffff?text=Property+Image";
                            }}
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-100 mb-2">
                                {deal.propertyName}
                              </CardTitle>
                              <p className="text-gray-400 text-sm">
                                {deal.description}
                              </p>
                            </div>
                            {getStatusBadge(deal.status)}
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-3 bg-gray-800/30 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Loan Value</p>
                              <p className="text-lg font-semibold text-green-400">
                                ${deal.loanValue.toLocaleString()}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-800/30 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Interest Rate</p>
                              <p className="text-lg font-semibold text-blue-400">
                                {deal.interestRate}%
                              </p>
                            </div>
                            <div className="p-3 bg-gray-800/30 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Term</p>
                              <p className="text-lg font-semibold text-purple-400">
                                {deal.loanTerm}m
                              </p>
                            </div>
                            <div className="p-3 bg-gray-800/30 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Submitted</p>
                              <p className="text-lg font-semibold text-yellow-400">
                                {new Date(deal.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </div>
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
