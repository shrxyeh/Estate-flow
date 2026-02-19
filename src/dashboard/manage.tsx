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
import { Progress } from "@/components/ui/progress";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-assetholder";
import { useRequests } from "@/contexts/RequestsContext";
import { getPropertyImage, getFallbackImage } from "@/utils/imageUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Simulated role ("AH" or "PB")
type Role = "AH" | "PB";
const userRole: Role = "AH"; // change to "PB" to see the other view

export default function ManagementConsole() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [yieldAvailable, setYieldAvailable] = useState(3200);
  const [released, setReleased] = useState(3000);
  const [loanRemaining, setLoanRemaining] = useState(150000 - released);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { requests } = useRequests();

  // Fetch property data when component mounts
  useEffect(() => {
    if (id && requests.length > 0) {
      const property = requests.find(req => req.id === id);
      if (property) {
        setPropertyData(property);
        setLoanRemaining(property.loanAmount - released);
      }
      setLoading(false);
    }
  }, [id, requests, released]);

  const handleReleaseYield = () => {
    const amount = Math.min(yieldAvailable, loanRemaining);
    setReleased(released + amount);
    setYieldAvailable(yieldAvailable - amount);
    setLoanRemaining(loanRemaining - amount);
  };

  const chartData = {
    labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5"],
    datasets: [
      {
        label: "Monthly Paybacks",
        data: [1000, 1200, 800, 1100, 900],
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      title: { 
        display: false 
      },
    },
    scales: {
      x: {
        grid: { 
          color: '#374151',
          drawBorder: false,
        },
        ticks: { 
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      },
      y: { 
        beginAtZero: true,
        grid: { 
          color: '#374151',
          drawBorder: false,
        },
        ticks: { 
          color: '#9CA3AF',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return '$' + value;
          }
        }
      },
    },
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
          userId={id || ""}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="p-4 md:p-6 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
                My Credit Swap for {propertyData?.property || 'Loading...'}
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Manage your loan engagement and track progress.
              </p>
            </div>

            {/* Property Image */}
            {loading ? (
              <div className="w-full h-64 md:h-80 relative rounded-lg overflow-hidden bg-gray-800 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400">Loading property details...</div>
                </div>
              </div>
            ) : propertyData ? (
              <div className="w-full h-64 md:h-80 relative rounded-lg overflow-hidden">
                <img
                  src={getPropertyImage(propertyData.property, propertyData.image)}
                  alt={`${propertyData.property} property image`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Use fallback image if the main image fails
                    const fallbackImage = getFallbackImage(propertyData.property);
                    if (e.currentTarget.src !== fallbackImage) {
                      e.currentTarget.src = fallbackImage;
                    } else {
                      // If fallback also fails, use a generic placeholder
                      e.currentTarget.src = "https://placehold.co/600x400/1f2937/ffffff?text=Property+Image";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-2xl font-bold text-white">{propertyData.property}</h2>
                  <p className="text-white/80">Investment Property</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 md:h-80 relative rounded-lg overflow-hidden bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400">Property not found</div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="secondary"
                asChild
                className="bg-gradient-to-r  text-white  transition-all duration-300 hover:shadow-lg hover:border-purple-500/20 border border-transparent text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 h-12 px-6 font-medium rounded-xl"
              >
                <a href={`/dashboard/requests/${id}`}>
                  📋 View Credit Swap Request & Proposals
                </a>
              </Button>
              <Button
                variant="secondary"
                asChild
                className="bg-gradient-to-r  text-white  transition-all duration-300 hover:shadow-lg hover:border-purple-500/20 border border-transparent text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 h-12 px-6 font-medium rounded-xl"
              >
                <a href={`/dashboard/proofs/${id}`}>🏠 View Proof of Property</a>
              </Button>
            </div>

            {/* Property Details Cards */}
            {propertyData && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-100 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Interest Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">{propertyData.rate}%</div>
                    <p className="text-sm text-gray-400">Annual interest rate</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-100 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Loan Amount
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400">${propertyData.loanAmount.toLocaleString()}</div>
                    <p className="text-sm text-gray-400">Total loan amount</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-100 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Repayment Term
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-400">{propertyData.months} months</div>
                    <p className="text-sm text-gray-400">Loan duration</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Yield Available
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Available for release
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-4">
                    ${yieldAvailable.toLocaleString()}
                  </div>
                  {userRole === "AH" && (
                    <Button
                      onClick={handleReleaseYield}
                      disabled={yieldAvailable === 0 || loanRemaining === 0}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 w-full h-12 font-medium rounded-xl"
                    >
                      💰 Release Yield to Nominee purchaser
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Payments Released to Nominee purchaser
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Total released amount
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">
                    ${released.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Remaining Credit Swap Loan
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Outstanding balance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400 mb-4">
                    ${loanRemaining.toLocaleString()}
                  </div>
                                      <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Progress</span>
                        <span>{Math.round((released / (propertyData?.loanAmount || 150000)) * 100)}%</span>
                      </div>
                      <Progress
                        value={(released / (propertyData?.loanAmount || 150000)) * 100}
                        className="h-2"
                      />
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* Property Description */}
            {propertyData && (
              <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200 mb-6">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-100 mb-2">{propertyData.property}</h4>
                      <p className="text-gray-400">{propertyData.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Collateral Type:</span>
                        <span className="text-gray-200 ml-2 capitalize">{propertyData.collateralType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Yield Preference:</span>
                        <span className="text-gray-200 ml-2">{propertyData.yieldPreference}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Proofs Submitted:</span>
                        <span className="text-gray-200 ml-2">{propertyData.proofSubmitted}/{propertyData.totalProofs}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Created:</span>
                        <span className="text-gray-200 ml-2">{propertyData.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chart */}
            <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Payback History
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Monthly payment tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Proof Timeline Section */}
            <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-900 transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Proof Timeline
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Payment verification status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <span className="mr-3 text-green-500">✔</span> 
                    <div>
                      <div className="text-green-400 font-medium">Loan Accepted</div>
                      <div className="text-sm text-gray-400">Month 0</div>
                    </div>
                  </li>
                  <li className="flex items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <span className="mr-3 text-green-500">✔</span> 
                    <div>
                      <div className="text-green-400 font-medium">Payment Received</div>
                      <div className="text-sm text-gray-400">Month 1</div>
                    </div>
                  </li>
                  <li className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <span className="mr-3 text-gray-400">⬜</span> 
                    <div>
                      <div className="text-gray-300 font-medium">Payment Pending</div>
                      <div className="text-sm text-gray-400">Month 2</div>
                    </div>
                  </li>
                </ul>
                {userRole === "PB" && (
                  <Button
                    variant="outline"
                    className="border-purple-500/50 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 h-12 px-6 font-medium rounded-xl"
                  >
                    📤 Upload Month 2 Proof
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
