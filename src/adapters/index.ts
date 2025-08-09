import 'dotenv/config';
import { Command } from 'commander';
import path from 'node:path';
import { ensureDirs, sha256Hex } from './lib/fs.js';
import { addUserToAllowlist } from './adapters/allowlistSelector.js';
import { getSeal } from './adapters/sealSelector.js';
import { uploadToWalrus, downloadFromWalrus } from './lib/walrus.js';

const program = new Command();
program
    .requiredOption('--file <path>', 'Path to the file to encrypt')
    .option('--out <dir>', 'Output base dir', process.env.OUTPUT_DIR || './out')
    .option('--walrus-key <k>', 'Mock walrus keyspace', 'default');

program.parse();
const opts = program.opts<{ file: string; out: string; walrusKey: string }>();

async function main() {
    const {
        MODE = 'MOCK',
        ALLOWLIST_ID,
    } = process.env;

    if (!ALLOWLIST_ID) throw new Error('Missing ALLOWLIST_ID in .env');

    // Derive documentId from allowlistId (hex SHA-256), per requirement
    const documentId = sha256Hex(ALLOWLIST_ID.toLowerCase());

    // 1) Allowlist add (admin sponsors gas)
    await addUserToAllowlist();

    // 2) Encrypt
    const seal = await getSeal();
    const { encryptedPath, meta } = await seal.encryptFile({
        inputPath: path.resolve(opts.file),
        documentId
    });

    // 3) Upload to Walrus
    const { blobId } = await uploadToWalrus({
        filePath: encryptedPath,
        meta,
        keyspace: opts.walrusKey
    });

    // 4) Download back
    const downloadedPath = await downloadFromWalrus({
        blobId,
        keyspace: opts.walrusKey
    });

    // 5) Decrypt
    const sessionKey = await seal.createSessionKey();
    const keyMaterial = await seal.fetchDecryptionKeys({
        sessionKey,
        documentId
    });

    const decryptedPath = await seal.decryptFile({
        encryptedPath: downloadedPath,
        outputDir: path.join(opts.out, 'decrypted'),
        keyMaterial,
        meta
    });

    await ensureDirs(opts.out); // no-op if exists

    console.log('\n=== ✅ Done ===');
    console.log('documentId:', documentId);
    console.log('encrypted :', encryptedPath);
    console.log('blobId    :', blobId);
    console.log('downloaded:', downloadedPath);
    console.log('decrypted :', decryptedPath);
    console.log('mode      :', MODE);
}

main().catch((e) => {
    console.error('ERROR:', e);
    process.exit(1);
});
