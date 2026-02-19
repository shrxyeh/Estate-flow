import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface EstateFlowRequest {
  id: string;
  property: string;
  rate: number;
  months: number;
  status: "Open" | "Pending" | "Completed" | "Rejected";
  proofSubmitted: number;
  totalProofs: number;
  loanAmount: number;
  image: string;
  description?: string;
  collateralType?: string;
  yieldPreference?: number;
  createdAt: Date;
  creator?: string; // Blockchain address of creator
  txHash?: string; // Transaction hash for blockchain verification
  blockchainId?: string; // ID from blockchain
}

interface RequestsContextType {
  requests: EstateFlowRequest[];
  addRequest: (request: Omit<EstateFlowRequest, "id" | "createdAt" | "status" | "proofSubmitted">) => void;
  updateRequest: (id: string, updates: Partial<EstateFlowRequest>) => void;
  deleteRequest: (id: string) => void;
  syncWithBlockchain: () => Promise<void>;
  isLoading: boolean;
  resetToInitialData: () => void;
  clearLocalStorage: () => void;
  inspectLocalStorage: () => void;
  refreshData: () => void;
  getRequestsByStatus: (status: string) => EstateFlowRequest[];
  getOpenRequests: () => EstateFlowRequest[];
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

// Storage key for localStorage
const STORAGE_KEY = 'estate-flow-requests';

// Function to load requests from localStorage
const loadRequestsFromStorage = (): EstateFlowRequest[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      console.log('📦 Loading requests from localStorage:', stored);
      const parsed = JSON.parse(stored);
      // Convert string dates back to Date objects
      const requests = parsed.map((req: any) => ({
        ...req,
        createdAt: new Date(req.createdAt)
      }));
      console.log('✅ Loaded requests from localStorage:', requests);
      return requests;
    }
  } catch (error) {
    console.error('❌ Error loading requests from localStorage:', error);
  }
  console.log('📦 No stored requests found, using initial data');
  return [];
};

// Function to save requests to localStorage
const saveRequestsToStorage = (requests: EstateFlowRequest[]) => {
  try {
    console.log('💾 Saving requests to localStorage:', requests);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    console.log('✅ Requests saved to localStorage successfully');
  } catch (error) {
    console.error('❌ Error saving requests to localStorage:', error);
  }
};

// Initial mock data with correct image paths
const initialRequests: EstateFlowRequest[] = [
  {
    id: "sitamarhi",
    property: "Sitamarhi",
    rate: 4.0,
    months: 12,
    status: "Open",
    proofSubmitted: 0,
    totalProofs: 6,
    loanAmount: 150000,
    image: "/properties/1.png", // Use existing image
    description: "Beautiful property in Sitamarhi with traditional architecture",
    collateralType: "yield",
    yieldPreference: 4.5,
    createdAt: new Date("2024-01-05"),
    creator: "0x1234567890123456789012345678901234567890",
    blockchainId: "sitamarhi_001"
  },
  {
    id: "kanchipuram",
    property: "Kanchipuram",
    rate: 4.8,
    months: 12,
    status: "Open",
    proofSubmitted: 0,
    totalProofs: 6,
    loanAmount: 199995,
    image: "/properties/2.png", // Use existing image
    description: "Sacred city property in Kanchipuram",
    collateralType: "yield",
    yieldPreference: 4.8,
    createdAt: new Date("2024-01-15"),
    creator: "0x1234567890123456789012345678901234567890",
    blockchainId: "kanchipuram_001"
  },
  {
    id: "indore",
    property: "Indore",
    rate: 5.3,
    months: 12,
    status: "Open",
    proofSubmitted: 0,
    totalProofs: 6,
    loanAmount: 200000,
    image: "/properties/3.png", // Use existing image
    description: "Commercial property in Indore",
    collateralType: "direct",
    yieldPreference: 5.3,
    createdAt: new Date("2024-01-20"),
    creator: "0x1234567890123456789012345678901234567890",
    blockchainId: "indore_001"
  },
  {
    id: "goa",
    property: "Goa",
    rate: 6.0,
    months: 12,
    status: "Open",
    proofSubmitted: 0,
    totalProofs: 6,
    loanAmount: 150000,
    image: "/properties/4.png", // Use existing image
    description: "Beachfront property in Goa",
    collateralType: "yield",
    yieldPreference: 6.0,
    createdAt: new Date("2024-01-10"),
    creator: "0x1234567890123456789012345678901234567890",
    blockchainId: "goa_001"
  },
  {
    id: "p4",
    property: "Bangalore Tech Park",
    rate: 6.1,
    months: 30,
    status: "Open",
    proofSubmitted: 1,
    totalProofs: 6,
    loanAmount: 380000,
    image: "/properties/5.png", // Use existing image
    description: "Commercial tech park in Bangalore",
    collateralType: "direct",
    yieldPreference: 6.0,
    createdAt: new Date("2024-01-25"),
    creator: "0x1234567890123456789012345678901234567890",
    blockchainId: "bangalore_001"
  },
  {
    id: "p5",
    property: "Hyderabad Heights",
    rate: 5.7,
    months: 36,
    status: "Pending",
    proofSubmitted: 3,
    totalProofs: 6,
    loanAmount: 290000,
    image: "/properties/6.png", // Use existing image
    description: "High-rise residential building in Hyderabad",
    collateralType: "yield",
    yieldPreference: 6.8,
    createdAt: new Date("2024-01-18"),
    creator: "0x1234567890123456789012345678901234567890",
    blockchainId: "hyderabad_001"
  },
  {
    id: "p6",
    property: "Chennai Marina",
    rate: 6.0,
    months: 24,
    status: "Open",
    proofSubmitted: 5,
    totalProofs: 6,
    loanAmount: 275000,
    image: "/properties/1.png", // Use existing image
    description: "Marina-front property in Chennai",
    collateralType: "direct",
    yieldPreference: 5.5,
    createdAt: new Date("2024-01-12"),
    creator: "0x1234567890123456789012345678901234567890",
    blockchainId: "chennai_001"
  },
];

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<EstateFlowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load requests from localStorage on component mount
  useEffect(() => {
    console.log('🔄 RequestsProvider mounting...');
    const storedRequests = loadRequestsFromStorage();
    if (storedRequests.length > 0) {
      console.log('📥 Using stored requests:', storedRequests);
      setRequests(storedRequests);
    } else {
      // If no stored requests, use initial data
      console.log('📥 Using initial requests:', initialRequests);
      setRequests(initialRequests);
      saveRequestsToStorage(initialRequests);
    }
    setIsLoading(false);
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      console.log('💾 Requests changed, saving to localStorage:', requests);
      saveRequestsToStorage(requests);
    }
  }, [requests, isLoading]);

  const addRequest = (requestData: Omit<EstateFlowRequest, "id" | "createdAt" | "status" | "proofSubmitted">) => {
    const newRequest: EstateFlowRequest = {
      ...requestData,
      id: `p${Date.now()}`, // Generate unique ID
      status: "Open",
      proofSubmitted: 0,
      createdAt: new Date(),
      blockchainId: requestData.blockchainId || `blockchain_${Date.now()}`,
    };
    
    console.log('🆕 Adding new request to context:', newRequest);
    
    // Add to the beginning of the list for immediate visibility
    setRequests(prev => {
      const updated = [newRequest, ...prev];
      console.log('📊 Updated requests list:', updated);
      return updated;
    });
    
    // Immediately save to localStorage
    const updatedRequests = [newRequest, ...requests];
    saveRequestsToStorage(updatedRequests);
    
    console.log('✅ New request added and saved to localStorage');
    
    return newRequest;
  };

  const updateRequest = (id: string, updates: Partial<EstateFlowRequest>) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(request => request.id !== id));
  };

  // Sync with blockchain data (placeholder for future implementation)
  const syncWithBlockchain = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual blockchain sync logic
      // This would fetch the latest data from smart contracts
      console.log('Syncing with blockchain...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error syncing with blockchain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug function to reset localStorage and use initial data
  const resetToInitialData = () => {
    console.log('🔄 Resetting to initial data...');
    localStorage.removeItem(STORAGE_KEY);
    setRequests(initialRequests);
    saveRequestsToStorage(initialRequests);
  };

  // Debug function to clear localStorage
  const clearLocalStorage = () => {
    console.log('🗑️ Clearing localStorage...');
    localStorage.removeItem(STORAGE_KEY);
    setRequests([]);
  };

  // Debug function to inspect localStorage
  const inspectLocalStorage = () => {
    console.log('🔍 Inspecting localStorage...');
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      console.log('📦 Raw localStorage data:', stored);
      try {
        const parsed = JSON.parse(stored);
        console.log('📦 Parsed localStorage data:', parsed);
        console.log('🖼️ Image paths in localStorage:', parsed.map((req: any) => ({ property: req.property, image: req.image })));
      } catch (error) {
        console.error('❌ Error parsing localStorage data:', error);
      }
    } else {
      console.log('📦 No data in localStorage');
    }
  };

  // Function to refresh data from localStorage
  const refreshData = () => {
    console.log('🔄 Refreshing data from localStorage...');
    const storedRequests = loadRequestsFromStorage();
    if (storedRequests.length > 0) {
      console.log('📥 Refreshed requests from localStorage:', storedRequests);
      setRequests(storedRequests);
    } else {
      console.log('📥 No stored requests, using initial data');
      setRequests(initialRequests);
      saveRequestsToStorage(initialRequests);
    }
  };

  // Function to get requests by status
  const getRequestsByStatus = (status: string) => {
    return requests.filter(request => request.status === status);
  };

  // Function to get open requests (for nominee buyer profile)
  const getOpenRequests = () => {
    return requests.filter(request => request.status === "Open");
  };

  return (
    <RequestsContext.Provider value={{ 
      requests, 
      addRequest, 
      updateRequest, 
      deleteRequest, 
      syncWithBlockchain,
      isLoading,
      resetToInitialData,
      clearLocalStorage,
      inspectLocalStorage,
      refreshData,
      getRequestsByStatus,
      getOpenRequests
    }}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
}

