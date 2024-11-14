# Pera Algorand Challenge

A decentralized application (dApp) for managing Algorand assets and facilitating peer-to-peer trading on the Algorand blockchain.

![Pera Challenge](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2232&ixlib=rb-4.0.3)

## Features

### 🔐 Wallet Integration
- Seamless connection with Pera Wallet
- Multi-account support with account selector
- Real-time balance updates
- Network switching between MainNet and TestNet

### 💎 Asset Management
- View and manage verified Algorand Standard Assets (ASAs)
- Filter assets by type (All/Collectibles/Tokens)
- Search functionality for quick asset discovery
- One-click asset opt-in
- Real-time USD value display for supported assets

### 💱 Asset Trading
- Create peer-to-peer trades
- Support for ALGO and ASA trading pairs
- Atomic transfers ensuring secure trades
- Active trade management
- Trade status tracking (Active/Completed/Cancelled)

### 🎨 User Interface
- Modern, responsive design
- Real-time transaction notifications
- Loading states and error handling
- Dark mode with beautiful gradients
- Mobile-friendly layout

## Getting Started

### Prerequisites
- Node.js 16+
- NPM or Yarn
- [Pera Wallet](https://perawallet.app/) mobile app

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pera-challenge.git
cd pera-challenge
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

### Connecting Your Wallet
1. Click "Connect with Pera" button
2. Scan the QR code with your Pera Wallet mobile app
3. Approve the connection

### Managing Assets
1. Navigate to the "Verified Assets" section
2. Use filters to find specific assets
3. Click "Opt In" to add an asset to your wallet

### Creating a Trade
1. Switch to "Asset Trading" view
2. Click "Create Trade"
3. Select assets and amounts for the trade
4. Submit the trade

### Accepting/Cancelling Trades
1. View active trades in the trading section
2. Click "Accept Trade" to complete a trade
3. Creators can cancel their trades using "Cancel Trade"

## Technical Details

### Built With
- React + TypeScript
- Tailwind CSS
- Algorand SDK
- Pera Wallet Connect
- Lucide React Icons

### Key Components
- `App.tsx`: Main application logic and state management
- `AssetList`: Displays and manages verified assets
- `TradingView`: Handles trade creation and management
- `Navigation`: App navigation and view switching
- `WalletConnect`: Wallet connection handling

### Security Features
- Atomic transfers for secure trading
- Transaction verification
- Balance validation
- Asset opt-in checks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Algorand Foundation](https://www.algorand.foundation/)
- [Pera Wallet](https://perawallet.app/)
- [Algorand Developer Portal](https://developer.algorand.org/)