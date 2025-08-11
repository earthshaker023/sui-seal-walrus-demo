// Simulates an on-chain allowlist add (no chain calls)
// Admin "sponsors" gas implicitly in mock mode

export async function addUserToAllowlist() {
    const allowlistId = process.env.ALLOWLIST_ID!;
    console.log(`(MOCK) Added user to allowlist ${allowlistId} (admin sponsored gas).`);
}