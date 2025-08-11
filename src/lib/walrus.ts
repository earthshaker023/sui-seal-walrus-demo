import path from 'node:path';
import crypto from 'node:crypto';
import axios from 'axios';
import { ensureDirs, readFileToBuffer, writeBufferToFile } from './fs.js';

type UploadArgs = {
    filePath: string;
    meta: Record<string, any>;
    keyspace?: string; // for mock
};
type DownloadArgs = { blobId: string; keyspace?: string };

const OUT = process.env.OUTPUT_DIR || './out';
const WALRUS_DIR = path.join(OUT, 'walrus');

export async function uploadToWalrus({ filePath, meta, keyspace = 'default' }: UploadArgs) {
    const url = process.env.WALRUS_NODE_URL;
    const content = readFileToBuffer(filePath);
    // Deterministic blobId by content hash (simulates content-addressing)
    const blobId = crypto.createHash('sha256').update(content).digest('hex');

    if (url) {
        // REAL mode: replace with your Walrus node API (multipart/form-data or raw PUT)
        // Example (pseudo):
        // const res = await axios.post(`${url}/v1/blobs`, content, { headers: {...} });
        // const blobId = res.data.blob_id;
        // return { blobId };
        await axios.post(`${url}/__mock-upload`, { meta, blobId }).catch(() => { });
    } else {
        // MOCK mode: store locally
        await ensureDirs(WALRUS_DIR, path.join(WALRUS_DIR, keyspace));
        const dest = path.join(WALRUS_DIR, keyspace, `${blobId}.bin`);
        writeBufferToFile(dest, content);
    }

    return { blobId };
}

export async function downloadFromWalrus({ blobId, keyspace = 'default' }: DownloadArgs) {
    const url = process.env.WALRUS_NODE_URL;
    const dest = path.join(WALRUS_DIR, keyspace, `${blobId}.bin`);
    if (url) {
        // REAL mode: GET from Walrus node, write to dest
        // const res = await axios.get(`${url}/v1/blobs/${blobId}`, { responseType: 'arraybuffer' });
        // writeBufferToFile(dest, Buffer.from(res.data));
    }
    // In MOCK mode the file is already there
    return dest;
}