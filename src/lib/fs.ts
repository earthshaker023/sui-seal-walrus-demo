import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export async function ensureDirs(...dirs: string[]) {
    for (const d of dirs) fs.mkdirSync(d, { recursive: true });
}

export function sha256Hex(input: string) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

export function safeBasename(p: string) {
    return path.basename(p).replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function writeBufferToFile(filePath: string, buf: Buffer) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buf);
}

export function readFileToBuffer(filePath: string) {
    return fs.readFileSync(filePath);
}
