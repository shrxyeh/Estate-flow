import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-proxy";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

// Simulated role ("AH" or "PB")
type Role = "AH" | "PB";
const userRole: Role = "PB"; // Property Buyer role to show payment evidence button

type TimelineStep = {
  month: number;
  status: "completed" | "current" | "upcoming";
  title: string;
  description: string;
  amount: number;
  date: string;
};

export default function ManagementConsoleProxy() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");

  // Mock data - in a real app, this would come from an API call
  const mockLoans = {
    "1": "Jaipur Palace",
    "2": "Pune Residency",
  };

  // Mock timeline data with enhanced information
  const timelineSteps: TimelineStep[] = [
    {
      month: 1,
      status: "completed",
      title: "Initial Payment",
      description: "First monthly payment completed with blockchain verification",
      amount: 1000,
      date: "2024-01-15",
    },
    {
      month: 2,
      status: "completed",
      title: "Second Payment",
      description: "Second monthly payment completed and verified",
      amount: 1000,
      date: "2024-02-15",
    },
    {
      month: 3,
      status: "current",
      title: "Current Payment",
      description: "Payment due for March - action required",
      amount: 1000,
      date: "2024-03-15",
    },
    {
      month: 4,
      status: "upcoming",
      title: "Upcoming Payment",
      description: "Payment scheduled for April",
      amount: 1000,
      date: "2024-04-15",
    },
    {
      month: 5,
      status: "upcoming",
      title: "May Payment",
      description: "Payment scheduled for May",
      amount: 1000,
      date: "2024-05-15",
    },
  ];

  // Set property name when component mounts
  useEffect(() => {
    if (id) {
      setPropertyName(
        mockLoans[id as keyof typeof mockLoans] || "Unknown Property"
      );
    }
  }, [id]);

  const getStatusIcon = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "current":
        return <Circle className="h-6 w-6 text-blue-500 animate-pulse" />;
      case "upcoming":
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const completedPayments = timelineSteps.filter(step => step.status === "completed").length;
  const totalPayments = timelineSteps.length;
  const totalPaid = timelineSteps.filter(step => step.status === "completed")
    .reduce((sum, step) => sum + step.amount, 0);

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
          userId={id || ""}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white">📊</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
                  Loan Payment Tracker
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Track your loan repayment progress for {propertyName} and submit payment evidence.
                </p>
              </div>
            </div>

            {/* Property Image */}
            <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/properties/4.png"
                alt={`${propertyName} property image`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-bold text-white mb-2">{propertyName}</h2>
                <p className="text-white/90 text-lg">Investment Property</p>
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
                    {completedPayments}/{totalPayments}
                  </div>
                  <div className="text-sm text-gray-400">Payments Completed</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    ${totalPaid.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Paid</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800/50 shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {Math.round((completedPayments / totalPayments) * 100)}%
                  </div>
                  <div className="text-sm text-gray-400">Progress</div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card className="bg-gray-900/80 border-gray-800/50 shadow-2xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Payment Timeline
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Track your monthly payments and submit blockchain evidence for verification.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="space-y-8">
                  {timelineSteps.map((step, index) => (
                    <div key={step.month} className="relative">
                      {/* Timeline connector */}
                      {index < timelineSteps.length - 1 && (
                        <div className={`absolute left-6 top-12 h-16 w-1 rounded-full`} />
                      )}

                      <div className="flex items-start gap-6 p-6 rounded-2xl bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50">
                        <div className="flex-shrink-0 relative">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                            step.status === "completed"
                              ? "bg-green-500/20 border-green-500"
                              : step.status === "current"
                              ? "bg-blue-500/20 border-blue-500"
                              : "bg-gray-600/20 border-gray-600"
                          }`}>
                            {getStatusIcon(step.status)}
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-gray-100">
                                Month {step.month}: {step.title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Due: {new Date(step.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-gray-300">
                                {step.description}
                              </p>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-400">
                                  ${step.amount.toLocaleString()}
                                </p>
                              </div>
                              
                              {step.status === "current" && userRole === "PB" && (
                                <Button
                                  variant="outline"
                                  className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 px-6 py-3 rounded-xl"
                                  asChild
                                >
                                  <a href="" rel="noopener noreferrer">
                                    <img
                                      src="/vlayer.png"
                                      alt="vLayer Logo"
                                      className="h-6 w-auto"
                                    />
                                    <span className="font-medium">Submit Payment Proof</span>
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
