#!/bin/bash

# EstateFlow Contract Deployment Script for Sepolia Testnet
echo "🏠 EstateFlow Contract Deployment to Sepolia Testnet"
echo "=================================================="

# Load environment variables from parent directory .env file
if [ -f "../.env" ]; then
    source ../.env
    echo "✅ Loaded environment variables from .env"
else
    echo "❌ .env file not found in parent directory!"
    echo "Please create a .env file with PRIVATE_KEY and SEPOLIA_RPC_URL"
    exit 1
fi

# Validate required environment variables
if [ -z "$PRIVATE_KEY" ] || [ -z "$SEPOLIA_RPC_URL" ]; then
    echo "❌ Missing required environment variables!"
    echo "Please ensure .env file contains:"
    echo "- PRIVATE_KEY=your_private_key"
    echo "- SEPOLIA_RPC_URL=your_rpc_url"
    exit 1
fi

echo "🔧 Configuration:"
echo "- Network: Sepolia Testnet"
echo "- RPC URL: $SEPOLIA_RPC_URL"
echo "- Private Key: ${PRIVATE_KEY:0:10}..."

# Check if forge is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Forge not found. Please install Foundry first:"
    echo "curl -L https://foundry.paradigm.xyz | bash"
    echo "foundryup"
    exit 1
fi

echo "📦 Installing dependencies..."
# Dependencies already installed via setup

echo "🔨 Compiling contracts..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed!"
    exit 1
fi

echo "✅ Compilation successful!"

echo "🚀 Deploying EstateFlowContract to Sepolia..."

# Deploy contract
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url $SEPOLIA_RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvvv

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy the contract address from the output above"
    echo "2. Update CONTRACT_ADDRESS in src/hooks/useEstateFlowContract.ts"
    echo "3. Update the CONTRACT_ABI with the generated ABI"
    echo ""
    echo "📁 Find the contract ABI in: vlayer/out/EstateFlowContract.sol/EstateFlowContract.json"
else
    echo "❌ Deployment failed!"
    exit 1
fi
