import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-assetholder";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const mockProposals = [
  {
    id: "p1",
    property: "Jaipur Palace",
    rate: 5.9,
    months: 24,
    status: "Accepted",
    proofSubmitted: 2,
    totalProofs: 6,
  },
  {
    id: "p2",
    property: "Pune Residency",
    rate: 6.3,
    months: 36,
    status: "Pending",
    proofSubmitted: 0,
    totalProofs: 6,
  },
];

const mockTimeline = [
  {
    id: 1,
    label: "Proposal Submitted",
    status: "Approved",
    date: "2024-03-01",
  },
  {
    id: 2,
    label: "Initial Review",
    status: "Approved",
    date: "2024-03-05",
  },
  {
    id: 3,
    label: "Due Diligence",
    status: "Pending",
    date: "2024-03-10",
  },
  {
    id: 4,
    label: "Final Approval",
    status: "Not Submitted",
    date: "2024-03-15",
  },
];

export default function ProposalTracker() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = "PB"; // This should come from your auth context/state
  const userId = "123"; // This should come from your auth context/state

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "Pending":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      default:
        return <Circle className="h-6 w-6 text-gray-500" />;
    }
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
        
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="p-4 md:p-6 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Proposals</h1>
              <p className="text-gray-400 text-sm md:text-base">
                Track and manage your property proposals.
              </p>
            </div>

            {/* Timeline Card */}
            <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Proposal Timeline
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track the progress of your proposals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockTimeline.map((step, index) => (
                    <div key={step.id} className="relative">
                      {/* Timeline line */}
                      {index !== mockTimeline.length - 1 && (
                        <div
                          className={`absolute left-3 top-8 h-full w-0.5 ${
                            step.status === "Approved"
                              ? "bg-green-500"
                              : step.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-gray-600"
                          }`}
                        />
                      )}

                      <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                        <div className="flex-shrink-0">
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="text-lg font-medium text-gray-100">
                              {step.label}
                            </h3>
                            <Badge
                              className={`${
                                step.status === "Approved"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : step.status === "Pending"
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-gray-500 hover:bg-gray-600"
                              } transition-colors`}
                            >
                              {step.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            Due: {step.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Proposals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {mockProposals.map((proposal) => (
                <Card key={proposal.id} className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200 group">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-100">
                        {proposal.property}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Offered Rate:</span>
                        <span className="text-purple-400 font-medium">{proposal.rate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Repayment:</span>
                        <span className="text-gray-300 font-medium">{proposal.months} months</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Status:</span>
                        <Badge
                          className={`${
                            proposal.status === "Accepted"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-yellow-500 hover:bg-yellow-600"
                          } transition-colors`}
                        >
                          {proposal.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Proofs submitted:</span>
                        <span className="text-blue-400 font-medium">
                          {proposal.proofSubmitted} / {proposal.totalProofs}
                        </span>
                      </div>
                    </div>
                    
                    {proposal.status === "Accepted" && (
                      <Button
                        variant="outline"
                        className="w-full bg-purple-600/10 border-purple-500/50 text-purple-400 hover:bg-purple-600/20 hover:border-purple-500 transition-all duration-200"
                      >
                        Upload Next Proof
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
