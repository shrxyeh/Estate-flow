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
        <div className="p-4 border-b border-gray-800/50">
          <h2 className="text-lg font-medium text-purple-400 mb-1">
            Asset Holder Dashboard
          </h2>
          <p className="text-xs text-gray-500">
            Manage your EstateFlow requests
          </p>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          <div className="space-y-3">
            <div>
              <h3 className="mb-3 px-3 text-sm font-semibold tracking-tight text-purple-400 uppercase">
                My EstateFlows
              </h3>
              <a
                href="/dashboard/my-requests"
                className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 hover:border-purple-500/20 border border-transparent"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                My EstateFlows
              </a>
            </div>
            
            <div>
              <h3 className="mb-3 px-3 text-sm font-semibold tracking-tight text-purple-400 uppercase">
                Management
              </h3>
              <div className="space-y-1">
                <a
                  href="/dashboard/manage/p1"
                  className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 hover:border-purple-500/20 border border-transparent"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Manage Ongoing EstateFlow
                </a>
                <a
                  href="/dashboard/requests/p1"
                  className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 hover:border-purple-500/20 border border-transparent"
                >
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Manage Pending EstateFlow & Proposals
                </a>
                <a
                  href="/dashboard/proofs/p1"
                  className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 hover:border-purple-500/20 border border-transparent"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  View Proof of Loan Repayment
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-800/50">
            <a
              href="/dashboard/requests/new"
              className="text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 group flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 hover:shadow-lg hover:border-purple-500/20 border border-transparent"
            >
              <span className="text-lg mr-3">+</span>
              Create EstateFlow Request
            </a>
          </div>
        </nav>

        <div className="border-t border-gray-800/50 p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2025 EstateFlow
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
