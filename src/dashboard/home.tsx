import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Users, TrendingUp, Star, CheckCircle, Globe, Lock, Coins, Home, DollarSign } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "@/hooks/useMetaMask";
import MetaMaskButton from "@/components/MetaMaskButton";
import WalletStatus from "@/components/WalletStatus";

export default function Landing() {
  const navigate = useNavigate();
  const { isConnected, account, disconnect } = useMetaMask();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Debug wallet state
  useEffect(() => {
    console.log('🏠 Landing component state:', { isConnected, account });
    console.log('🏠 Button should be:', !isConnected ? 'DISABLED' : 'ENABLED');
  }, [isConnected, account]);

  // Mouse position tracking for particle system
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const createParticles = () => {
      const particles = [];
      for (let i = 0; i < 150; i++) { // Increased from 100 to 150
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3, // Reduced from 0.5 to 0.3
          vy: (Math.random() - 0.5) * 0.3, // Reduced from 0.5 to 0.3
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.2, // Reduced opacity for subtlety
        });
      }
      return particles;
    };

    particlesRef.current = createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Mouse interaction
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          // Force gets stronger the closer the particle is to the mouse
          const force = (150 - distance) / 150;

          // Apply weaker force (slower movement)
          particle.vx -= dx * force * 0.0001; 
          particle.vy -= dy * force * 0.0001; 
        }

        // --- Add damping so particles slow down naturally ---
        particle.vx *= 0.95;  // closer to 1 = less friction, closer to 0 = more friction
        particle.vy *= 0.95;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx2 = particle.x - otherParticle.x;
            const dy2 = particle.y - otherParticle.y;
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (distance2 < 80) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance2 / 80)})`;
              ctx.stroke();
            }
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Transactions",
      description: "Military-grade encryption and blockchain security ensure your transactions are protected"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Complete real estate transactions in minutes, not months with our automated flow system"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "P2P Network",
      description: "Direct connection between crypto holders and nominee purchasers for transparent deals"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Opportunities",
      description: "Leverage your crypto assets to access real estate investment opportunities"
    }
  ];

  const stats = [
    { number: "500+", label: "Properties Listed", icon: <Home className="w-6 h-6" /> },
    { number: "$50M+", label: "Total Volume", icon: <DollarSign className="w-6 h-6" /> },
    { number: "1000+", label: "Happy Users", icon: <Users className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Shield className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Crypto Investor",
      image: "/users/sally.png",
      content: "EstateFlow made it incredibly easy to diversify my crypto portfolio into real estate. The process was seamless!"
    },
    {
      name: "Mike Chen",
      role: "Property Developer",
      image: "/users/john.png",
      content: "As a nominee purchaser, I've found amazing opportunities through EstateFlow. The platform is intuitive and secure."
    }
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-950 text-white overflow-x-hidden relative">
      {/* Interactive Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />
      
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-green-900/10 pointer-events-none z-0"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse z-0"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none animate-pulse z-0"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl pointer-events-none animate-ping z-0" style={{ animationDuration: '4s' }}></div>
      
      {/* Additional Background Elements */}
      <div className="fixed top-10 left-1/3 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none animate-pulse z-0" style={{ animationDelay: '1s' }}></div>
      <div className="fixed bottom-10 left-1/4 w-40 h-40 bg-pink-500/5 rounded-full blur-2xl pointer-events-none animate-pulse z-0" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/3 right-1/5 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none animate-pulse z-0" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-4 h-4 bg-purple-400/20 rounded-full animate-bounce z-0" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      <div className="fixed top-40 right-20 w-3 h-3 bg-green-400/20 rounded-full animate-bounce z-0" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      <div className="fixed bottom-32 left-20 w-5 h-5 bg-blue-400/20 rounded-full animate-bounce z-0" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      <div className="fixed bottom-20 right-40 w-2 h-2 bg-yellow-400/20 rounded-full animate-bounce z-0" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
      <div className="fixed top-1/2 left-10 w-3 h-3 bg-red-400/20 rounded-full animate-bounce z-0" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
      <div className="fixed top-60 right-10 w-4 h-4 bg-indigo-400/20 rounded-full animate-bounce z-0" style={{ animationDelay: '0.8s', animationDuration: '3.8s' }}></div>
      <div className="fixed bottom-60 right-20 w-2 h-2 bg-orange-400/20 rounded-full animate-bounce z-0" style={{ animationDelay: '2.2s', animationDuration: '4.2s' }}></div>
      
      {/* Geometric Shapes */}
      <div className="fixed top-1/4 left-1/6 w-6 h-6 border border-purple-400/10 rotate-45 animate-spin z-0" style={{ animationDuration: '20s' }}></div>
      <div className="fixed bottom-1/3 right-1/6 w-8 h-8 border border-green-400/10 rotate-12 animate-spin z-0" style={{ animationDuration: '25s' }}></div>
      <div className="fixed top-2/3 left-1/12 w-4 h-4 border border-blue-400/10 animate-spin z-0" style={{ animationDuration: '15s' }}></div>
      <div className="fixed bottom-1/6 left-1/3 w-5 h-5 border border-yellow-400/10 rotate-45 animate-spin z-0" style={{ animationDuration: '18s' }}></div>
      
      {/* Gradient Lines */}
      <div className="fixed top-1/5 left-0 w-32 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent z-0"></div>
      <div className="fixed bottom-1/5 right-0 w-32 h-px bg-gradient-to-l from-transparent via-green-400/20 to-transparent z-0"></div>
      <div className="fixed top-1/2 left-0 w-20 h-px bg-gradient-to-r from-transparent via-blue-400/15 to-transparent z-0"></div>
      <div className="fixed bottom-1/3 right-0 w-28 h-px bg-gradient-to-l from-transparent via-pink-400/15 to-transparent z-0"></div>
      
      {/* Header */}
      <header className="relative z-50 flex items-center justify-between p-4 md:p-6 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <div className="w-6 h-6 bg-white rounded-full relative">
              <div className="absolute inset-0 border-2 border-green-500 rounded-full"></div>
              <div className="absolute inset-1 border-2 border-green-500 rounded-full"></div>
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">EstateFlow</span>
        </div>
          
        <div className="flex gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <WalletStatus />
                <Button
                  onClick={() => {
                    // This will trigger disconnect through the useMetaMask hook
                    console.log('🔌 Disconnecting wallet');
                    disconnect();
                  }}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <MetaMaskButton />
            )}
            <Button 
              onClick={() => {
                console.log('🔍 Header Button clicked. Connected:', isConnected, 'Account:', account);
                navigate("/dashboard/my-deals");
              }}
              variant="outline"
              disabled={!isConnected}
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300"
            >
              Buy A House
            </Button>
            <Button 
              onClick={() => {
                console.log('🔍 Header Button clicked. Connected:', isConnected, 'Account:', account);
                navigate("/dashboard/requests/new");
              }}
              disabled={!isConnected}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            >
              Offer an EstateFlow
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 md:px-6 py-20 md:py-32 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 px-6 py-3 rounded-full mb-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-purple-500/30 hover:shadow-lg hover:shadow-purple-500/25 group cursor-default">
            <Star className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-sm font-medium">Introducing EstateFlow</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight transform transition-all duration-700 hover:scale-105">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent inline-block transform transition-all duration-500 hover:scale-110 hover:rotate-1">Use crypto to buy homes</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent inline-block transform transition-all duration-500 hover:scale-110 hover:-rotate-1">with p2p</span>{" "}
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent inline-block transform transition-all duration-500 hover:scale-110 hover:rotate-1">estate flows</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto transform transition-all duration-500 hover:scale-105">
            EstateFlow connects crypto holders with nominee purchasers to facilitate secure, 
            transparent real estate transactions through our innovative P2P platform.
          </p>

          {/* Welcome Message - Clean and simple */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  console.log('🔍 Hero Button clicked. Connected:', isConnected, 'Account:', account);
                  navigate("/dashboard/my-deals");
                }}
                size="lg"
                disabled={!isConnected}
                className={isConnected 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50 px-8 py-4 text-lg font-semibold'
                }
              >
                <Home className="w-5 h-5 mr-2" />
                Buy A House
              </Button>
              <Button 
                onClick={() => {
                  console.log('🔍 Hero Button clicked. Connected:', isConnected, 'Account:', account);
                  navigate("/dashboard/requests/new");
                }}
                size="lg"
                disabled={!isConnected}
                variant="outline"
                className={isConnected
                  ? 'border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 px-8 py-4 text-lg' 
                  : 'border-gray-600 text-gray-400 opacity-50 cursor-not-allowed px-8 py-4 text-lg'
                }
              >
                <Coins className="w-5 h-5 mr-2" />
                Offer an EstateFlow
              </Button>
            </div>
            <div className="text-center mt-4">
              {!isConnected ? (
                <p className="text-gray-400">
                  Connect your wallet to access these features
                </p>
              ) : (
                <p className="text-green-400">
                  ✅ Wallet connected! Buttons should be enabled.
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Debug: isConnected={isConnected ? 'true' : 'false'}, account={account ? 'exists' : 'null'}
              </p>
            </div>
          </div>



          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl group cursor-default">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3 text-green-400 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 transform transition-all duration-300 group-hover:scale-110">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 opacity-60">
            <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-105 hover:opacity-100">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-gray-400 font-medium">Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-105 hover:opacity-100">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              <span className="text-gray-400 font-medium">Fully Audited</span>
            </div>
            <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-105 hover:opacity-100">
              <Lock className="w-6 h-6 text-purple-400" />
              <span className="text-gray-400 font-medium">Zero-Knowledge Proofs</span>
            </div>
            <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-105 hover:opacity-100">
              <Globe className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400 font-medium">Global Network</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 md:px-6 py-20 bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 transform transition-all duration-500 hover:scale-105">
              Why Choose EstateFlow?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-500 hover:scale-105">
              Revolutionary features that make real estate investment accessible through cryptocurrency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/80 hover:border-gray-700/50 transition-all duration-500 group transform hover:scale-110 hover:-translate-y-4 hover:rotate-1 hover:shadow-2xl cursor-default">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-green-500/20 rounded-2xl mb-4 text-green-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-purple-500/40 group-hover:to-green-500/40">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 transform transition-all duration-300 group-hover:scale-105">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed transform transition-all duration-300 group-hover:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technology Stack */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-8">Built on Cutting-Edge Technology</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-110 hover:opacity-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                  <span className="text-orange-400 font-bold text-lg">₿</span>
                </div>
                <span className="text-gray-300 font-medium">Bitcoin</span>
              </div>
              <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-110 hover:opacity-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">Ξ</span>
                </div>
                <span className="text-gray-300 font-medium">Ethereum</span>
              </div>
              <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-110 hover:opacity-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-lg">◎</span>
                </div>
                <span className="text-gray-300 font-medium">Solana</span>
              </div>
              <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-110 hover:opacity-100">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                  <span className="text-green-400 font-bold text-lg">⚡</span>
                </div>
                <span className="text-gray-300 font-medium">Lightning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-4 md:px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 transform transition-all duration-500 hover:scale-105">
              How EstateFlow Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-500 hover:scale-105">
              Simple, secure, and transparent process from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center group cursor-default">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 text-white text-2xl font-bold shadow-lg shadow-purple-500/25 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/50 transform perspective-1000 group-hover:rotate-y-12">
                <span className="transform transition-all duration-300 group-hover:scale-110">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 transform transition-all duration-300 group-hover:scale-105 group-hover:text-purple-300">Connect</h3>
              <p className="text-gray-400 transform transition-all duration-300 group-hover:text-gray-300 group-hover:scale-105">Crypto holders and nominee purchasers connect through our secure platform</p>
            </div>
            <div className="text-center group cursor-default">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 text-white text-2xl font-bold shadow-lg shadow-green-500/25 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-green-500/50 transform perspective-1000 group-hover:rotate-y-12">
                <span className="transform transition-all duration-300 group-hover:scale-110">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 transform transition-all duration-300 group-hover:scale-105 group-hover:text-green-300">Transact</h3>
              <p className="text-gray-400 transform transition-all duration-300 group-hover:text-gray-300 group-hover:scale-105">Smart contracts facilitate secure, transparent transactions with escrow protection</p>
            </div>
            <div className="text-center group cursor-default">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 text-white text-2xl font-bold shadow-lg shadow-blue-500/25 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/50 transform perspective-1000 group-hover:rotate-y-12">
                <span className="transform transition-all duration-300 group-hover:scale-110">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 transform transition-all duration-300 group-hover:scale-105 group-hover:text-blue-300">Complete</h3>
              <p className="text-gray-400 transform transition-all duration-300 group-hover:text-gray-300 group-hover:scale-105">Property ownership transfers smoothly with all parties protected throughout</p>
            </div>
          </div>

          {/* Security & Compliance Section */}
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-gray-700/50">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Security & Compliance First</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Built with enterprise-grade security and full regulatory compliance to protect your investments
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Multi-Layer Security</h4>
                <p className="text-gray-400 text-sm">Advanced encryption and multi-signature wallets protect every transaction</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Regulatory Compliant</h4>
                <p className="text-gray-400 text-sm">Full compliance with financial regulations and real estate laws</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Smart Contracts</h4>
                <p className="text-gray-400 text-sm">Automated escrow and transparent transaction execution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-4 md:px-6 py-20 bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 transform transition-all duration-500 hover:scale-105">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 transform transition-all duration-500 hover:scale-105">
              Join thousands of satisfied users who trust EstateFlow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-500 group transform hover:scale-105 hover:-translate-y-2 hover:rotate-1 hover:shadow-2xl cursor-default">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4 transition-all duration-300 group-hover:rotate-3"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/48x48/4ade80/ffffff?text=" + testimonial.name.charAt(0);
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="transform transition-all duration-300 group-hover:scale-105">
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed italic mb-4 transform transition-all duration-300 group-hover:text-white group-hover:scale-105">
                    "{testimonial.content}"
                  </p>
                  <div className="flex text-yellow-400 transform transition-all duration-300 group-hover:scale-110">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current transition-all duration-300 hover:scale-125 hover:rotate-12" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 md:px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 transform transition-all duration-500 hover:scale-105">
            {isConnected ? "Ready to Start Your Journey?" : "Ready to Get Started?"}
          </h2>
          <p className="text-xl text-gray-300 mb-10 transform transition-all duration-500 hover:scale-105">
            {isConnected 
              ? "Your wallet is connected! You can now access all EstateFlow features."
              : "Join EstateFlow today and revolutionize your real estate investment journey"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isConnected ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => {
                    // This will trigger the MetaMask connection
                    console.log('🔗 Prompting wallet connection from CTA');
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 hover:shadow-3xl hover:shadow-blue-500/40"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Connect Wallet
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
                >
                  Learn More
                </Button>
              </div>
            ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
                  onClick={() => {
                    console.log('🚀 Navigating to main dashboard from CTA');
                    window.location.href = "/dashboard/my-requests";
                  }}
              size="lg"
                  className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 hover:shadow-3xl hover:shadow-purple-500/40"
            >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Start Your Journey
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
            >
              Contact Sales
            </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <div className="w-6 h-6 bg-white rounded-full relative">
                    <div className="absolute inset-0 border-2 border-green-500 rounded-full"></div>
                    <div className="absolute inset-1 border-2 border-green-500 rounded-full"></div>
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent transform transition-all duration-300 group-hover:scale-105">EstateFlow</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md transform transition-all duration-300 hover:text-gray-300 hover:scale-105">
                Revolutionizing real estate investment through secure, transparent cryptocurrency transactions. 
                Join the future of property ownership today.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg group">
                  <Globe className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg group">
                  <Lock className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg group">
                  <Coins className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="transform transition-all duration-300 hover:scale-105">
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-2 inline-block">How it Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-2 inline-block">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-2 inline-block">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-2 inline-block">API</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="transform transition-all duration-300 hover:scale-105">
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-2 inline-block">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-2 inline-block">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-2 inline-block">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-2 inline-block">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm transform transition-all duration-300 hover:text-gray-300 hover:scale-105">
              © 2024 EstateFlow. All rights reserved. Built with security and transparency in mind.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2 transform transition-all duration-300 hover:scale-105 hover:text-green-400 cursor-default">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 transform transition-all duration-300 hover:scale-105 hover:text-blue-400 cursor-default">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Bank-Level Security</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
