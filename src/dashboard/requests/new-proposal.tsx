import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/sidebar-proxy";
import { Header } from "@/components/header";

export default function RequestNew() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    propertyName: "",
    description: "",
    loanAmount: "",
    interestRate: "",
    loanTerm: "",
    collateralType: "",
    yieldPreference: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.propertyName || !form.description || !form.loanAmount || !form.interestRate || !form.loanTerm) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form or navigate away
        setForm({
          propertyName: "",
          description: "",
          loanAmount: "",
          interestRate: "",
          loanTerm: "",
          collateralType: "",
          yieldPreference: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Error submitting proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        
        <Sidebar sidebarOpen={sidebarOpen} userRole="PB" userId="123" />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            {showSuccess && (
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-xl shadow-lg border border-green-500/20 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                  <span className="font-medium">Proposal submitted successfully! 🎉</span>
                </div>
              </div>
            )}
            
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white">📝</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
                  Create New Proposal
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Submit a competitive proposal for this Credit Swap Request and showcase your investment terms.
                </p>
              </div>
            </div>

            <Card className="bg-gray-900/80 border-gray-800/50 shadow-2xl backdrop-blur-sm hover:bg-gray-900 transition-all duration-300">
              <CardHeader className="pb-8">
                <CardTitle className="text-xl font-semibold text-gray-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Proposal Details
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Provide comprehensive details for your investment proposal to attract asset holders.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Two-column layout for desktop */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="propertyName" className="text-gray-100 font-medium">
                        Property Name *
                      </Label>
                      <Input
                        name="propertyName"
                        value={form.propertyName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Jaipur Palace"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount" className="text-gray-100 font-medium">
                        Loan Amount (USD) *
                      </Label>
                      <Input
                        name="loanAmount"
                        type="number"
                        value={form.loanAmount}
                        onChange={handleChange}
                        required
                        placeholder="150000"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-100 font-medium">
                      Proposal Description *
                    </Label>
                    <Textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Describe your investment approach, experience, and why you're the ideal partner for this property..."
                      className="bg-gray-800/50 border-gray-700/50 text-gray-100 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="interestRate" className="text-gray-100 font-medium">
                        Interest Rate (%) *
                      </Label>
                      <Input
                        name="interestRate"
                        type="number"
                        step="0.1"
                        value={form.interestRate}
                        onChange={handleChange}
                        required
                        placeholder="5.8"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loanTerm" className="text-gray-100 font-medium">
                        Loan Term (months) *
                      </Label>
                      <Input
                        name="loanTerm"
                        type="number"
                        value={form.loanTerm}
                        onChange={handleChange}
                        required
                        placeholder="24"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="collateralType" className="text-gray-100 font-medium">
                        Collateral Type *
                      </Label>
                      <Input
                        name="collateralType"
                        value={form.collateralType}
                        onChange={handleChange}
                        required
                        placeholder="e.g., yield, direct"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="yieldPreference" className="text-gray-100 font-medium">
                        Yield Preference %
                      </Label>
                      <Input
                        name="yieldPreference"
                        type="number"
                        step="0.1"
                        value={form.yieldPreference}
                        onChange={handleChange}
                        placeholder="6.5"
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 h-12 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg font-semibold rounded-xl shadow-lg hover:shadow-green-500/25"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Submitting Proposal...
                        </div>
                      ) : (
                        "🚀 Submit Proposal"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
