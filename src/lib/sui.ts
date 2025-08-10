import { Ed25519Keypair, fromB64, Signer } from '@mysten/sui.js/cryptography';
import { SuiClient } from '@mysten/sui.js/client';

export function getSui() {
    const rpc = process.env.SUI_RPC_URL;
    if (!rpc) {
        return { client: null as unknown as SuiClient, admin: null as unknown as Signer, user: null as unknown as Signer };
    }
    const client = new SuiClient({ url: rpc });
    const adminPk = process.env.ADMIN_PRIVATE_KEY!;
    const userPk = process.env.USER_PRIVATE_KEY!;
    const admin = Ed25519Keypair.fromSecretKey(fromB64(adminPk));
    const user = Ed25519Keypair.fromSecretKey(fromB64(userPk));
    return { client, admin, user };
}
