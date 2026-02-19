type Role = "AH" | "PB";

interface SidebarProps {
  sidebarOpen: boolean;
  userRole: Role;
  userId: string;
}

export function Sidebar({ sidebarOpen }: SidebarProps) {
  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-800/50 bg-gray-950/95 backdrop-blur-sm transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex h-full flex-col">
        <div className="p-6 border-b border-gray-800/50">
          <h2 className="text-lg font-semibold text-green-400 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Nominee Purchaser Dashboard
          </h2>
          <p className="text-sm text-gray-400">
            Manage your EstateFlow proposals
          </p>
        </div>
        
        <nav className="flex-1 space-y-2 p-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">
              MY ESTATEFLOWS
            </h3>
            <a
              href="/dashboard/my-deals"
              className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-xl px-4 py-3 transition-all duration-200 border border-transparent hover:border-gray-700/50"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              My EstateFlow Proposals
            </a>
            <a
              href="/dashboard/manage-proxy/1"
              className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-xl px-4 py-3 transition-all duration-200 ml-4 border border-transparent hover:border-gray-700/50"
            >
              Proposal Details
            </a>
          </div>

          <div className="space-y-1 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">
              OPPORTUNITIES
            </h3>
            <a
              href="/dashboard/nominee-buyer-profile"
              className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-xl px-4 py-3 transition-all duration-200 border border-transparent hover:border-gray-700/50"
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              My Investment Profile
            </a>
            <a
              href="/dashboard/swap-opportunities"
              className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-xl px-4 py-3 transition-all duration-200 border border-transparent hover:border-gray-700/50"
            >
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              View Credit Swap Opportunities
            </a>
            <a
              href="/dashboard/deal-info-proxy/p1"
              className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-xl px-4 py-3 transition-all duration-200 ml-4 border border-transparent hover:border-gray-700/50"
            >
              View Property Details
            </a>
            <a
              href="/dashboard/new-proposal"
              className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-xl px-4 py-3 transition-all duration-200 ml-4 border border-transparent hover:border-gray-700/50"
            >
              Submit Proposal
            </a>
          </div>
        </nav>
      </div>
    </aside>
  );
}
