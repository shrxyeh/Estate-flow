import { useState, useCallback } from 'react';

interface EstateFlowRequest {
  id: string;
  propertyName: string;
  loanAmount: string;
  description: string;
  collateralType: string;
  loanTerm: string;
  yieldPreference: string;
  imageUrl: string;
  status: 'Open' | 'Pending' | 'Completed';
  interestRate: string;
  creator: string;
  createdAt: Date;
  proofs?: string;
}

// Demo data for testing - remove this when integrating with real data
const DEMO_REQUESTS: EstateFlowRequest[] = [
  {
    id: '1',
    propertyName: 'Jaipur Palace',
    loanAmount: '250000',
    description: 'Luxury property in prime location',
    collateralType: 'yield, direct',
    loanTerm: '24',
    yieldPreference: '5.9',
    imageUrl: '/placeholder-property.jpg',
    status: 'Open',
    interestRate: '5.9',
    creator: '0x123...',
    createdAt: new Date('2024-01-15'),
    proofs: '2/6'
  },
  {
    id: '2',
    propertyName: 'Pune Residency',
    loanAmount: '320000',
    description: 'Modern apartment complex',
    collateralType: 'direct',
    loanTerm: '36',
    yieldPreference: '6.3',
    imageUrl: '/placeholder-property.jpg',
    status: 'Pending',
    interestRate: '6.3',
    creator: '0x456...',
    createdAt: new Date('2024-01-10'),
    proofs: '0/6'
  }
];

export function useEstateFlowDashboard() {
  // Initialize with demo data - replace with your actual data source
  const [requests, setRequests] = useState<EstateFlowRequest[]>(DEMO_REQUESTS);

  const addNewRequest = useCallback((newRequest: EstateFlowRequest) => {
    console.log('📊 Adding new request to dashboard:', newRequest);
    
    setRequests(prevRequests => {
      // Add the new request at the beginning of the list
      const updatedRequests = [newRequest, ...prevRequests];
      console.log('📊 Updated requests list:', updatedRequests);
      return updatedRequests;
    });
  }, []);

  const updateRequestStatus = useCallback((requestId: string, status: EstateFlowRequest['status']) => {
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status }
          : request
      )
    );
  }, []);

  const removeRequest = useCallback((requestId: string) => {
    setRequests(prevRequests => 
      prevRequests.filter(request => request.id !== requestId)
    );
  }, []);

  // Calculate dashboard stats
  const stats = {
    totalRequests: requests.length,
    openRequests: requests.filter(r => r.status === 'Open').length,
    pendingRequests: requests.filter(r => r.status === 'Pending').length,
    totalValue: requests.reduce((sum, r) => sum + parseFloat(r.loanAmount), 0)
  };

  return {
    requests,
    stats,
    addNewRequest,
    updateRequestStatus,
    removeRequest
  };
}

