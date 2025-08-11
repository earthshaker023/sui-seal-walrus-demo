import { getSeal as getMock } from './seal.mock.js';
import { getSeal as getReal } from './seal.real.js';

export async function getSeal() {
    const mode = (process.env.MODE || 'MOCK').toUpperCase();
    if (mode === 'REAL') return getReal();
    return getMock();
}