import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CheckCircle2, Clock, Circle } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-assetholder";

const mockProofs = [
  {
    id: 1,
    label: "Loan Accepted",
    status: "Approved",
    uploadedBy: "proxybuyer.eth",
    date: "2024-03-01",
    proofLink: "https://www.flowscan.io/block/114923177",
  },
  {
    id: 2,
    label: "Month 1 Repayment",
    status: "Approved",
    uploadedBy: "proxybuyer.eth",
    date: "2024-04-01",
    proofLink: "https://www.flowscan.io/block/11492317",
  },
  {
    id: 3,
    label: "Month 2 Repayment",
    status: "Not Submitted",
    uploadedBy: null,
    date: "2024-05-01",
    proofLink: null,
  },
];

const TOTAL_MONTHS = 32;
const COMPLETED_MONTHS = 2; // Month 1 and 2 are shown explicitly
const FUTURE_MONTHS = TOTAL_MONTHS - COMPLETED_MONTHS;

export default function ProofTimeline() {
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

  // Remove unused filter variables

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
          <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white">🏠</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
                  Proof of Property
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Explore activity that your Nominee purchaser has been making on their Institutional Loan.
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {mockProofs.filter(p => p.status === "Approved").length}
                  </div>
                  <div className="text-sm text-gray-400">Completed Payments</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {mockProofs.filter(p => p.status === "Not Submitted").length}
                  </div>
                  <div className="text-sm text-gray-400">Pending Verification</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {FUTURE_MONTHS}
                  </div>
                  <div className="text-sm text-gray-400">Remaining Payments</div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Card */}
            <Card className="bg-gray-900/80 border-gray-800/50 shadow-2xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Payment Timeline
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Track payment history and upcoming milestones for this property investment.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="space-y-8">
                  {mockProofs.map((proof, index) => (
                    <div key={proof.id} className="relative">
                      {/* Timeline line */}
                      {index !== mockProofs.length - 1 && (
                        <div
                          className={`absolute left-6 top-12 h-16 w-1 rounded-full`}
                        />
                      )}

                      <div className="flex items-start gap-6 p-6 rounded-2xl bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50">
                        <div className="flex-shrink-0 relative">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                            proof.status === "Approved"
                              ? "bg-green-500/20 border-green-500"
                              : proof.status === "Pending"
                              ? "bg-yellow-500/20 border-yellow-500"
                              : "bg-gray-600/20 border-gray-600"
                          }`}>
                            {getStatusIcon(proof.status)}
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-gray-100">
                                {proof.label}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Due: {new Date(proof.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <Badge
                              className={`${
                                proof.status === "Approved"
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : proof.status === "Pending"
                                  ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                                  : "bg-gray-500 hover:bg-gray-600 text-white"
                              } transition-colors px-4 py-2 text-sm font-medium`}
                            >
                              {proof.status}
                            </Badge>
                          </div>
                          
                          {proof.uploadedBy && (
                            <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-semibold text-purple-400">👤</span>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Uploaded by</p>
                                <p className="text-purple-400 font-medium">{proof.uploadedBy}</p>
                              </div>
                            </div>
                          )}
                          
                          {proof.proofLink && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-sm font-bold text-white">V</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-400 mb-1">Blockchain Verification</p>
                                <a
                                  href={proof.proofLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-purple-300 transition-colors hover:underline font-medium"
                                >
                                  View Payment Proof on Flowscan →
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Future Payments Section */}
                  <div className="relative">
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-600/50 rounded-xl flex items-center justify-center">
                              <span className="text-lg">📅</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-300">Future Payments</h4>
                              <p className="text-sm text-gray-400">
                                <span className="font-medium text-gray-300">{FUTURE_MONTHS}</span> monthly payments remaining
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-10 sm:grid-cols-15 gap-2">
                            {Array.from({ length: Math.min(FUTURE_MONTHS, 30) }).map(
                              (_, i) => (
                                <div
                                  key={i}
                                  className="h-3 w-3 rounded-full bg-gray-600/50 hover:bg-gray-500 transition-colors cursor-pointer"
                                  title={`Month ${COMPLETED_MONTHS + i + 1}`}
                                />
                              )
                            )}
                          </div>
                          
                          {FUTURE_MONTHS > 30 && (
                            <p className="text-xs text-gray-500 mt-3">
                              +{FUTURE_MONTHS - 30} additional payments not shown
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
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
