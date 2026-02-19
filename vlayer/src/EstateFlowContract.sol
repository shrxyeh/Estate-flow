// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract EstateFlowContract is Ownable, ReentrancyGuard {
    uint256 private _requestIds;
    
    struct EstateFlowRequest {
        uint256 id;
        address creator;
        string propertyName;
        uint256 loanAmount;
        string description;
        string collateralType;
        uint256 loanTerm; // in months
        uint256 yieldPreference; // percentage * 100 (e.g., 590 = 5.9%)
        string imageHash; // IPFS hash or URL
        uint256 createdAt;
        RequestStatus status;
    }
    
    enum RequestStatus {
        Open,
        Pending,
        Completed,
        Cancelled
    }
    
    // Mappings
    mapping(uint256 => EstateFlowRequest) public requests;
    mapping(address => uint256[]) public userRequests;
    
    // Events
    event EstateFlowRequestCreated(
        uint256 indexed requestId,
        address indexed creator,
        string propertyName,
        uint256 loanAmount,
        uint256 timestamp
    );
    
    event RequestStatusUpdated(
        uint256 indexed requestId,
        RequestStatus oldStatus,
        RequestStatus newStatus,
        uint256 timestamp
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Create a new EstateFlow request
     */
    function createEstateFlowRequest(
        string memory propertyName,
        uint256 loanAmount,
        string memory description,
        string memory collateralType,
        uint256 loanTerm,
        uint256 yieldPreference,
        string memory imageHash
    ) external returns (uint256) {
        require(bytes(propertyName).length > 0, "Property name cannot be empty");
        require(loanAmount > 0, "Loan amount must be greater than 0");
        require(loanTerm > 0, "Loan term must be greater than 0");
        require(yieldPreference > 0, "Yield preference must be greater than 0");
        
        _requestIds++;
        uint256 requestId = _requestIds;
        
        EstateFlowRequest memory newRequest = EstateFlowRequest({
            id: requestId,
            creator: msg.sender,
            propertyName: propertyName,
            loanAmount: loanAmount,
            description: description,
            collateralType: collateralType,
            loanTerm: loanTerm,
            yieldPreference: yieldPreference,
            imageHash: imageHash,
            createdAt: block.timestamp,
            status: RequestStatus.Open
        });
        
        requests[requestId] = newRequest;
        userRequests[msg.sender].push(requestId);
        
        emit EstateFlowRequestCreated(
            requestId,
            msg.sender,
            propertyName,
            loanAmount,
            block.timestamp
        );
        
        return requestId;
    }
    
    /**
     * @dev Update request status (only creator or owner)
     */
    function updateRequestStatus(uint256 requestId, RequestStatus newStatus) 
        external 
    {
        require(requestId <= _requestIds && requestId > 0, "Invalid request ID");
        EstateFlowRequest storage request = requests[requestId];
        require(
            msg.sender == request.creator || msg.sender == owner(),
            "Only creator or owner can update status"
        );
        
        RequestStatus oldStatus = request.status;
        request.status = newStatus;
        
        emit RequestStatusUpdated(requestId, oldStatus, newStatus, block.timestamp);
    }
    
    /**
     * @dev Get request details
     */
    function getRequest(uint256 requestId) 
        external 
        view 
        returns (EstateFlowRequest memory) 
    {
        require(requestId <= _requestIds && requestId > 0, "Invalid request ID");
        return requests[requestId];
    }
    
    /**
     * @dev Get all requests by a user
     */
    function getUserRequests(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userRequests[user];
    }
    
    /**
     * @dev Get total number of requests
     */
    function getTotalRequests() external view returns (uint256) {
        return _requestIds;
    }
    
    /**
     * @dev Get multiple requests (for pagination)
     */
    function getRequests(uint256 offset, uint256 limit) 
        external 
        view 
        returns (EstateFlowRequest[] memory) 
    {
        uint256 total = _requestIds;
        require(offset < total, "Offset exceeds total requests");
        
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        
        EstateFlowRequest[] memory result = new EstateFlowRequest[](end - offset);
        
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = requests[i + 1]; // Request IDs start from 1
        }
        
        return result;
    }
    
    /**
     * @dev Emergency functions (only owner)
     */
    function emergencyPause() external onlyOwner {
        // Add pause functionality if needed
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Fallback function to receive Ether
    receive() external payable {}
}
