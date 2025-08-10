import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Configuration
const CONFIG = {
    // RPC endpoints
    rpcUrl: 'https://sepolia.base.org', // Base Sepolia testnet

    // Wallet configurations
    allowlistWallet: {
        privateKey: process.env.ALLOWLIST_WALLET_PRIVATE_KEY || '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        address: process.env.ALLOWLIST_WALLET_ADDRESS || '0x1234567890123456789012345678901234567890'
    },

    gasSponsorWallet: {
        privateKey: process.env.GAS_SPONSOR_WALLET_PRIVATE_KEY || '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        address: process.env.GAS_SPONSOR_WALLET_ADDRESS || '0xabcdef123456789012345678901234567890abcdef'
    },

    // File configuration
    testFilePath: './test-file.txt',
    encryptedFilePath: './encrypted-file.bin',
    decryptedFilePath: './decrypted-file.txt',

    // Demo encryption key (in production, this would come from SEAL)
    demoEncryptionKey: 'demo-secret-key-32-chars-long!!'
};

class EncryptionDemo {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
        this.allowlistWallet = new ethers.Wallet(CONFIG.allowlistWallet.privateKey, this.provider);
        this.gasSponsorWallet = new ethers.Wallet(CONFIG.gasSponsorWallet.privateKey, this.provider);
    }

    async log(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
        if (data) {
            console.log(JSON.stringify(data, null, 2));
        }
        console.log('---');
    }

    async createTestFile() {
        try {
            // Get user input for file content
            const readline = await import('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const question = (prompt) => {
                return new Promise((resolve) => {
                    rl.question(prompt, resolve);
                });
            };

            console.log('\n📝 Please enter the content for your test file:');
            console.log('💡 (Press Enter twice to finish, or type "default" to use sample content)');

            let lines = [];
            let lineCount = 0;

            while (true) {
                const line = await question(`📝 Line ${lineCount + 1}: `);
                if (line === '' && lines.length > 0) {
                    break; // End input on empty line
                }
                if (line === 'default') {
                    lines = [`This is a test file created at ${new Date().toISOString()}`,
                        '',
                        'This file will be encrypted using AES-256, stored locally, and then decrypted.',
                        '',
                        'You can now input your own content instead of random data!'];
                    break;
                }
                lines.push(line);
                lineCount++;
            }

            rl.close();

            const content = lines.join('\n');

            if (content.trim() === '') {
                throw new Error('File content cannot be empty');
            }

            fs.writeFileSync(CONFIG.testFilePath, content);
            await this.log('📄 Test file created successfully', { path: CONFIG.testFilePath, size: content.length });
            return content;
        } catch (error) {
            await this.log('❌ Error creating test file', { error: error.message });
            throw error;
        }
    }

    async simulateAllowlistAddition() {
        try {
            await this.log('📝 Simulating adding user to allowlist...');

            // Generate a mock transaction hash
            const mockTxHash = '0x' + crypto.randomBytes(32).toString('hex');
            const mockBlockNumber = Math.floor(Math.random() * 1000000) + 1000000;

            await this.log('✅ Mock allowlist transaction completed', {
                transactionHash: mockTxHash,
                blockNumber: mockBlockNumber,
                note: 'This is a simulation - no actual blockchain transaction occurred'
            });

            return { hash: mockTxHash, blockNumber: mockBlockNumber };
        } catch (error) {
            await this.log('❌ Error in allowlist simulation', { error: error.message });
            throw error;
        }
    }

    async encryptFile() {
        try {
            await this.log('🔐 Encrypting file using AES-256...');

            // Read the test file
            const fileContent = fs.readFileSync(CONFIG.testFilePath);

            // Generate document ID (simulating SEAL document ID)
            const documentId = crypto.createHash('sha256')
                .update(CONFIG.allowlistWallet.address + Date.now().toString())
                .digest('hex');

            await this.log('🆔 Document ID generated', { documentId });

            // Encrypt the file using AES-256 (simulating SEAL encryption)
            const algorithm = 'aes-256-cbc';
            const key = crypto.scryptSync(CONFIG.demoEncryptionKey, 'salt', 32);
            const iv = crypto.randomBytes(16);

            const cipher = crypto.createCipher(algorithm, key);
            let encrypted = cipher.update(fileContent, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            // Combine IV and encrypted data
            const encryptedData = iv.toString('hex') + ':' + encrypted;

            // Save encrypted file
            fs.writeFileSync(CONFIG.encryptedFilePath, encryptedData);

            await this.log('🔐 File encrypted successfully', {
                originalSize: fileContent.length,
                encryptedSize: encryptedData.length,
                documentId: documentId,
                algorithm: algorithm
            });

            return { encryptedData, documentId, iv: iv.toString('hex') };
        } catch (error) {
            await this.log('❌ Error encrypting file', { error: error.message });
            throw error;
        }
    }

    async simulateWalrusUpload(encryptedData, documentId) {
        try {
            await this.log('🌊 Simulating upload to Walrus storage...');

            // Generate mock blob ID
            const blobId = 'blob_' + crypto.randomBytes(16).toString('hex');

            await this.log('✅ File uploaded to Walrus successfully (simulation)', {
                blobId: blobId,
                documentId: documentId,
                size: encryptedData.length,
                note: 'This is a simulation - no actual upload occurred'
            });

            return blobId;
        } catch (error) {
            await this.log('❌ Error in Walrus upload simulation', { error: error.message });
            throw error;
        }
    }

    async simulateWalrusDownload(blobId) {
        try {
            await this.log('📥 Simulating download from Walrus storage...');

            // Read the encrypted file we saved locally
            const downloadedData = fs.readFileSync(CONFIG.encryptedFilePath, 'utf8');

            await this.log('✅ File downloaded from Walrus successfully (simulation)', {
                blobId: blobId,
                size: downloadedData.length,
                note: 'This is a simulation - file was read from local storage'
            });

            return downloadedData;
        } catch (error) {
            await this.log('❌ Error in Walrus download simulation', { error: error.message });
            throw error;
        }
    }

    async decryptFile(encryptedData, documentId) {
        try {
            await this.log('🔓 Decrypting file using AES-256...');

            // Parse IV and encrypted data
            const parts = encryptedData.split(':');
            const iv = Buffer.from(parts[0], 'hex');
            const encrypted = parts[1];

            // Decrypt the file
            const algorithm = 'aes-256-cbc';
            const key = crypto.scryptSync(CONFIG.demoEncryptionKey, 'salt', 32);

            const decipher = crypto.createDecipher(algorithm, key);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            // Save decrypted file
            fs.writeFileSync(CONFIG.decryptedFilePath, decrypted);

            await this.log('✅ File decrypted successfully', {
                encryptedSize: encryptedData.length,
                decryptedSize: decrypted.length,
                path: CONFIG.decryptedFilePath,
                algorithm: algorithm
            });

            return decrypted;
        } catch (error) {
            await this.log('❌ Error decrypting file', { error: error.message });
            throw error;
        }
    }

    async verifyDecryption(originalContent, decryptedContent) {
        try {
            const originalHash = crypto.createHash('sha256').update(originalContent).digest('hex');
            const decryptedHash = crypto.createHash('sha256').update(decryptedContent).digest('hex');

            const isMatch = originalHash === decryptedHash;

            await this.log('🔍 Decryption verification', {
                originalHash: originalHash.substring(0, 16) + '...',
                decryptedHash: decryptedHash.substring(0, 16) + '...',
                isMatch: isMatch
            });

            return isMatch;
        } catch (error) {
            await this.log('❌ Error verifying decryption', { error: error.message });
            throw error;
        }
    }

    async cleanup() {
        try {
            // Remove temporary files
            if (fs.existsSync(CONFIG.testFilePath)) {
                fs.unlinkSync(CONFIG.testFilePath);
            }
            if (fs.existsSync(CONFIG.encryptedFilePath)) {
                fs.unlinkSync(CONFIG.encryptedFilePath);
            }
            if (fs.existsSync(CONFIG.decryptedFilePath)) {
                fs.unlinkSync(CONFIG.decryptedFilePath);
            }

            await this.log('🧹 Cleanup completed - temporary files removed');
        } catch (error) {
            await this.log('❌ Error during cleanup', { error: error.message });
        }
    }

    async run() {
        try {
            await this.log('🚀 Starting Encryption Demo (SEAL + Walrus Simulation)...');
            await this.log('⚙️ Configuration', CONFIG);
            await this.log('ℹ️ Note: This is a simulation using local encryption and mock blockchain operations');

            // Step 1: Create test file
            const originalContent = await this.createTestFile();

            // Step 2: Simulate adding user to allowlist
            await this.simulateAllowlistAddition();

            // Step 3: Encrypt file using AES-256 (simulating SEAL)
            const { encryptedData, documentId } = await this.encryptFile();

            // Step 4: Simulate upload to Walrus
            const blobId = await this.simulateWalrusUpload(encryptedData, documentId);

            // Step 5: Simulate download from Walrus
            const downloadedData = await this.simulateWalrusDownload(blobId);

            // Step 6: Decrypt file
            const decryptedContent = await this.decryptFile(downloadedData, documentId);

            // Step 7: Verify decryption
            const isDecryptionValid = await this.verifyDecryption(originalContent, decryptedContent);

            if (isDecryptionValid) {
                await this.log('🎉 SUCCESS: Complete encryption/decryption flow completed successfully!');
                await this.log('📊 Summary', {
                    originalFileSize: originalContent.length,
                    encryptedFileSize: encryptedData.length,
                    decryptedFileSize: decryptedContent.length,
                    documentId: documentId,
                    blobId: blobId,
                    verification: 'PASSED',
                    note: 'This demonstrates the core concepts of the SEAL + Walrus workflow'
                });
            } else {
                await this.log('❌ FAILURE: Decryption verification failed!');
            }

        } catch (error) {
            await this.log('💥 Demo failed with error', { error: error.message, stack: error.stack });
        } finally {
            // Cleanup temporary files
            await this.cleanup();
        }
    }
}

// Main execution
async function main() {
    const demo = new EncryptionDemo();
    await demo.run();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the demo
main().catch((error) => {
    console.error('💥 Fatal error:', error);
});
