// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {EstateFlowContract} from "../src/EstateFlowContract.sol";

contract DeployScript is Script {
    EstateFlowContract public estateFlowContract;
    
    function setUp() public {}
    
    function run() public {
        console.log("Deploying EstateFlowContract...");
        
        // Start broadcasting transactions (private key passed via command line)
        vm.startBroadcast();
        
        // Deploy the contract
        estateFlowContract = new EstateFlowContract();
        
        console.log("EstateFlowContract deployed to:", address(estateFlowContract));
        console.log("Owner:", estateFlowContract.owner());
        
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Verify deployment
        console.log("Deployment successful!");
        console.log("Contract address:", address(estateFlowContract));
        console.log("Total requests:", estateFlowContract.getTotalRequests());
    }
}
