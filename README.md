# SEAL + Walrus Demo

A comprehensive demonstration of file encryption, storage, and retrieval concepts using encryption protocols and decentralized storage principles.

## 🚀 Overview

This project demonstrates a complete end-to-end workflow for:

- **File Encryption**: Using AES-256 encryption (simulating SEAL protocol)
- **Decentralized Storage**: Simulating upload/download to Walrus protocol
- **File Retrieval**: Downloading and decrypting files
- **Blockchain Integration**: Simulating gas sponsorship and allowlist management
- **Verification**: Hash-based verification of encryption/decryption integrity

## ✨ Features

- 🔐 **AES-256 Encryption**: Strong encryption using industry-standard algorithms
- 🌊 **Walrus Simulation**: Simulated decentralized file storage and retrieval
- ⛽ **Gas Sponsorship Simulation**: Mock blockchain transaction handling
- 📝 **Allowlist Management**: Simulated user access control
- 🔍 **Verification**: Hash-based verification of encryption/decryption integrity
- 📊 **Comprehensive Logging**: Detailed operation logging with timestamps
- 🧹 **Auto-cleanup**: Automatic removal of temporary files

## 🏗️ Architecture

The demo follows this workflow:

1. **Test File Creation** → Create a test file with user input content
2. **Allowlist Simulation** → Simulate adding user to allowlist
3. **File Encryption** → Encrypt file using AES-256 (simulating SEAL)
4. **Walrus Upload Simulation** → Simulate upload to decentralized storage
5. **File Download Simulation** → Simulate download from storage
6. **File Decryption** → Decrypt file using encryption keys
7. **Verification** → Verify decryption integrity
8. **Cleanup** → Remove temporary files

## 📋 Prerequisites

- Node.js 18+
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd seal-walrus-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Optional: Configure environment variables**
   Create a `.env` file in the project root for custom wallet configurations:

   ```env
   ALLOWLIST_WALLET_PRIVATE_KEY=your_private_key_here
   ALLOWLIST_WALLET_ADDRESS=your_wallet_address_here
   GAS_SPONSOR_WALLET_PRIVATE_KEY=sponsor_private_key_here
   GAS_SPONSOR_WALLET_ADDRESS=sponsor_wallet_address_here
   ```

## ⚙️ Configuration

The project uses the following default configuration:

- **Network**: Base Sepolia testnet (for demonstration purposes)
- **Encryption**: AES-256-CBC with secure key derivation
- **File Paths**:
  - Test file: `./test-file.txt`
  - Encrypted file: `./encrypted-file.bin`
  - Decrypted file: `./decrypted-file.txt`

## 🚀 Usage

### Run the Demo

```bash
npm start
```

Or directly with Node:

```bash
node index.js
```

### What Happens

1. **Test File Creation**: A test file is created with your custom content input
2. **Allowlist Simulation**: Mock blockchain transaction for user allowlist addition
3. **Encryption**: File is encrypted using AES-256 with generated document ID
4. **Storage Simulation**: Simulated upload to Walrus with metadata
5. **Retrieval Simulation**: Simulated download from Walrus
6. **Decryption**: File is decrypted using encryption keys
7. **Verification**: Original and decrypted files are compared for integrity
8. **Cleanup**: Temporary files are automatically removed

## 📦 Dependencies

- **ethers**: Ethereum library for blockchain interaction concepts
- **Node.js Built-ins**:
  - `crypto`: Cryptographic functions for encryption/decryption
  - `fs`: File system operations
  - `path`: Path manipulation utilities

## 🔐 Security Features

- **AES-256 Encryption**: Industry-standard encryption algorithm
- **Secure Key Derivation**: Using scrypt for key generation
- **Random IV Generation**: Unique initialization vectors for each encryption
- **Hash Verification**: SHA-256 integrity checking
- **Document IDs**: Unique identifiers for encrypted files

## 📊 Output

The demo provides comprehensive logging including:

- Timestamped operation logs
- Mock transaction hashes and block numbers
- File sizes and metadata
- Success/failure status
- Encryption algorithm details

## 🧪 Testing

The project includes a basic test script:

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Important Notes

**This is a simulation demo** that demonstrates the core concepts:

- Uses AES-256 encryption instead of SEAL protocol
- Simulates blockchain operations instead of real transactions
- Simulates Walrus storage instead of actual decentralized storage
- For production use, integrate with actual SEAL and Walrus SDKs

## 🔗 Links

- [SEAL Protocol](https://seal.xyz) - For production integration
- [Walrus Protocol](https://walrus.xyz) - For production integration
- [Base Sepolia Testnet](https://sepolia.base.org)
- [Ethers.js Documentation](https://docs.ethers.org)

## 📞 Support

For issues and questions:

- Check the logs for detailed error information
- Verify your Node.js version is 18+
- Check that all dependencies are properly installed
- Review the console output for operation details
