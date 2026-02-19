import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequestNew from "./dashboard/requests/new-request";
import ProposalNew from "./dashboard/requests/new-proposal";
import Proposals from "./dashboard/proposals";
import ProofTimeline from "./dashboard/proofs/proof-timeline";
import RequestDetail from "./dashboard/requests/deal-info";
import DealInfoProxy from "./dashboard/deal-info-proxy";
import ManagementConsole from "./dashboard/manage";
import ManagementConsoleProxy from "./dashboard/manage-proxy";
import SwapOpportunities from "./dashboard/swap-opportunities";
import MyRequests from "./dashboard/my-requests";
import NomineeBuyerProfile from "./dashboard/nominee-buyer-profile";
import { UserProvider } from "./contexts/UserContext";
import { RequestsProvider } from "./contexts/RequestsContext";

import Home from "./dashboard/home";
import MyDeals from "./dashboard/my-deals";

function App() {
  return (
    <UserProvider>
      <RequestsProvider>
        <Router>
          <Routes>
            {/* LANDING */}
            <Route path="/" element={<Home />} />
            
            {/* PROXY BUYER */}
            <Route path="/dashboard/my-deals" element={<MyDeals />} />
            <Route path="/dashboard/deal-info-proxy/:id" element={<DealInfoProxy />} />
            <Route path="/dashboard/swap-opportunities" element={<SwapOpportunities />} />
            <Route path="/dashboard/manage-proxy/:id" element={<ManagementConsoleProxy />} />
            <Route path="/dashboard/new-proposal" element={<ProposalNew />} />
            <Route path="/dashboard/nominee-buyer-profile" element={<NomineeBuyerProfile />} />
            
            {/* ASSET HOLDER*/}
            <Route path="/dashboard/my-requests" element={<MyRequests />} />
            <Route path="/dashboard/requests/new" element={<RequestNew />} />
            <Route path="/dashboard/requests/request-detail/:id" element={<RequestDetail />} />
            <Route path="/dashboard/requests/:id" element={<RequestDetail />} />
            <Route path="/dashboard/proofs/:id" element={<ProofTimeline />} />
            <Route path="/dashboard/proposals" element={<Proposals />} />
            <Route path="/dashboard/manage/:id" element={<ManagementConsole />} />
            <Route path="/dashboard/proofs/prooftimeline/:id" element={<ProofTimeline />} />
          </Routes>
        </Router>
      </RequestsProvider>
    </UserProvider>
  );
}

export default App;
