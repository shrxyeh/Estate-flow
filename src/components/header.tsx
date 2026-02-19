import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, Bell, Search, ChevronDown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick?: () => void;
  userRole?: "AH" | "PB";
}

export function Header({ onMenuClick, userRole: propUserRole }: HeaderProps) {
  const { userRole: contextUserRole, setUserRole } = useUser();
  const userRole = propUserRole || contextUserRole;
  const navigate = useNavigate();

  const users = {
    AH: {
      name: "Priya Patel",
      role: "Asset Holder",
      image: "/users/sally.png",
      path: "/dashboard/my-requests",
    },
    PB: {
      name: "Arjun Sharma",
      role: "Nominee purchaser",
      image: "/users/john.png",
      path: "/dashboard/my-deals",
    },
  };

  const currentUser = users[userRole];

  const handleUserSwitch = (role: "AH" | "PB") => {
    setUserRole(role);
    navigate(users[role].path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-gray-950/95 backdrop-blur-sm supports-[backdrop-filter]:bg-gray-950/60">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 transition-colors"
            onClick={onMenuClick}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full relative">
                <div className="absolute inset-0 border border-green-500 rounded-full"></div>
                <div className="absolute inset-0.5 border border-green-500 rounded-full"></div>
              </div>
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-100">
              EstateFlow
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all hover:bg-gray-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full text-xs"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-100 hover:bg-gray-800/50 transition-colors"
              >
                <img
                  src={currentUser.image}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-500/20"
                />
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{currentUser.name}</div>
                  <div className="text-xs text-gray-400">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-gray-900/95 backdrop-blur-sm border-gray-800/50 fixed right-4 top-16"
            >
              <DropdownMenuItem
                className="flex items-center gap-2 text-gray-100 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => handleUserSwitch("AH")}
              >
                <img
                  src="/users/sally.png"
                  alt="Priya Patel"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-500/20"
                />
                <div>
                  <div className="text-sm font-medium">Priya Patel</div>
                  <div className="text-xs text-gray-400">Asset Holder</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-gray-100 hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => handleUserSwitch("PB")}
              >
                <img
                  src="/users/john.png"
                  alt="Arjun Sharma"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-green-500/20"
                />
                <div>
                  <div className="text-sm font-medium">Arjun Sharma</div>
                  <div className="text-xs text-gray-400">Nominee purchaser</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
