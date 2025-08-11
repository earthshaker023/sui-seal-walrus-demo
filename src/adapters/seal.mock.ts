import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { ensureDirs, safeBasename, writeBufferToFile } from '../lib/fs.js';

type Meta = { algorithm: 'aes-256-gcm'; iv: string; };
type KeyMaterial = { key: Buffer };

export function getSeal() {
    return new MockSeal();
}

class MockSeal {
    async encryptFile(args: { inputPath: string; documentId: string }) {
        const { inputPath, documentId } = args;
        const data = fs.readFileSync(inputPath);
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(12);

        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        const tag = cipher.getAuthTag();
        const out = Buffer.concat([iv, tag, encrypted]);

        const outDir = path.join(process.env.OUTPUT_DIR || './out', 'encrypted');
        await ensureDirs(outDir);
        const outPath = path.join(outDir, `${documentId}.bin`);
        writeBufferToFile(outPath, out);

        // store key in memory (mock). In REAL, fetch from SEAL key servers later.
        this._keys.set(documentId, key);
        return { encryptedPath: outPath, meta: { algorithm: 'aes-256-gcm', iv: iv.toString('hex') } as Meta };
    }

    async createSessionKey(): Promise<string> {
        return crypto.randomBytes(16).toString('hex');
    }

    async fetchDecryptionKeys(args: { sessionKey: string; documentId: string }): Promise<KeyMaterial> {
        const key = this._keys.get(args.documentId);
        if (!key) throw new Error('No key found (mock).');
        return { key };
    }

    async decryptFile(args: {
        encryptedPath: string;
        outputDir: string;
        keyMaterial: KeyMaterial;
        meta: Meta;
    }) {
        const { encryptedPath, outputDir, keyMaterial } = args;
        const buf = fs.readFileSync(encryptedPath);
        const iv = buf.subarray(0, 12);
        const tag = buf.subarray(12, 28);
        const ciphertext = buf.subarray(28);

        const decipher = crypto.createDecipheriv('aes-256-gcm', keyMaterial.key, iv);
        decipher.setAuthTag(tag);
        const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

        await ensureDirs(outputDir);
        const outPath = path.join(outputDir, path.basename(encryptedPath).replace('.bin', '.decrypted'));
        writeBufferToFile(outPath, plain);
        return outPath;
    }

    private _keys = new Map<string, Buffer>();
}