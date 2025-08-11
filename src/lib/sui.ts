import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';
import { SuiClient } from '@mysten/sui.js/client';

export function getSui() {
    const rpc = process.env.SUI_RPC_URL;
    if (!rpc) {
        return { client: null as unknown as SuiClient, admin: null as unknown as Ed25519Keypair, user: null as unknown as Ed25519Keypair };
    }
    const client = new SuiClient({ url: rpc });
    const adminPk = process.env.ADMIN_PRIVATE_KEY!;
    const userPk = process.env.USER_PRIVATE_KEY!;
    const admin = Ed25519Keypair.fromSecretKey(fromB64(adminPk));
    const user = Ed25519Keypair.fromSecretKey(fromB64(userPk));
    return { client, admin, user };
}