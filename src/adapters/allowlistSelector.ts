ximport { addUserToAllowlist as addMock } from './allowlist.mock.js';
import { addUserToAllowlist as addReal } from './allowlist.real.js';

export async function addUserToAllowlist() {
    const mode = (process.env.MODE || 'MOCK').toUpperCase();
    if (mode === 'REAL') return addReal();
    return addMock();
}