# EstateFlow

A decentralized peer-to-peer real estate lending platform on Ethereum. EstateFlow lets crypto holders purchase real estate through a credit swap mechanism — connecting them directly with nominee purchasers who take loans on their behalf, removing traditional mortgage intermediaries from the equation.

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity_0.8.21-363636?style=flat&logo=solidity&logoColor=white)
![Ethereum](https://img.shields.io/badge/Sepolia_Testnet-627EEA?style=flat&logo=ethereum&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

## What It Does

Two types of users interact on the platform:

**Asset Holders** — Crypto holders who want to buy property. They post requests specifying the loan amount, term, and collateral preference (yield-based or direct). They then review competing proposals and accept the best one.

**Nominee Purchasers** — Individuals who take loans to buy properties on behalf of asset holders, earning a fee for the service. They browse open requests, submit proposals, and upon acceptance, fulfill the loan through a 6-step proof submission process.

Funds are unlocked incrementally at each verified milestone, keeping both parties accountable throughout the loan lifecycle.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Shadcn/ui, Radix UI primitives |
| Blockchain | ethers.js v6, MetaMask |
| Smart Contracts | Solidity 0.8.21, Foundry (Forge) |
| Libraries | OpenZeppelin (Ownable, ReentrancyGuard) |
| Deployment | Vercel (frontend), Ethereum Sepolia (contracts) |

## Smart Contracts

**`EstateFlowContract.sol`** — Handles property request creation and management. Stores loan terms, collateral type, IPFS image references, and request status on-chain.

**`DecentralizedCreditSwap.sol`** — Manages the full swap lifecycle: proposal submission, acceptance, proof-based milestone tracking, and reentrancy-protected fund release.

Deployed on **Ethereum Sepolia Testnet**

```
Contract Address: 0x4e37558d4DFA9c8526724C4c37a5461Ee3720f04
```

View on Etherscan: https://sepolia.etherscan.io/address/0x4e37558d4dfa9c8526724c4c37a5461ee3720f04

## Project Structure

```
estate-flow/
├── src/
│   ├── dashboard/          # Application views (requests, deals, proposals, proofs)
│   ├── components/         # Reusable UI components
│   ├── contexts/           # UserContext (role switching), RequestsContext (data layer)
│   ├── hooks/              # useMetaMask, useEstateFlowContract, useWalletNavigation
│   └── App.tsx             # Route definitions
└── vlayer/
    ├── src/                # Solidity smart contracts
    ├── script/             # Foundry deployment scripts
    └── lib/                # OpenZeppelin, forge-std
```

## Getting Started

**Prerequisites:** Node.js 18+, pnpm, MetaMask, Sepolia testnet ETH

```bash
git clone https://github.com/<your-username>/estate-flow.git
cd estate-flow
pnpm install
pnpm dev
```

The dev server starts at `http://localhost:3000`. Connect MetaMask to Sepolia testnet to interact with the deployed contract.

## Deploying Contracts

Create a `.env` file in the root:

```
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
ETHERSCAN_API_KEY=your_etherscan_key
```

Then deploy and verify:

```bash
cd vlayer
forge build
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
forge verify-contract <address> src/EstateFlowContract.sol:EstateFlowContract --chain sepolia --etherscan-api-key $ETHERSCAN_API_KEY
```

## License

MIT
