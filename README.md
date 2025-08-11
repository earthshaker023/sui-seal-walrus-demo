# Sui + SEAL + Walrus Demo (Two-Wallet, Allowlist, Gas Sponsor)

This is a **command-line tool** that:

1) Adds a user to a SEAL allowlist (admin wallet sponsors gas).
2) Encrypts a local file with SEAL (documentId derived from allowlistId).
3) Uploads the encrypted blob to Walrus.
4) Downloads it back by blobId.
5) Decrypts it with keys from SEAL key servers.

Works in two modes:

- REAL mode (uses your actual SDKs and endpoints)
- MOCK mode (runs locally end-to-end with no external deps)

## Quick Start (MOCK mode)

```bash
npm install
cp env.example .env
npm start -- --file ./fixtures/hello.txt
```

You'll see:

- `out/encrypted/<docId>.bin`
- `out/walrus/<blobId>.bin` (mock "Walrus" storage)
- `out/decrypted/<original-filename>`

---

## REAL mode (wire your SDKs/endpoints)

1. Open `.env` and set:

```
MODE=REAL
WALRUS_NODE_URL=https://<your-walrus-node>
# Sui / wallet secrets:
ALLOWLIST_ID=0xb5c8...
ADMIN_PRIVATE_KEY=<sui_admin_key>        # gas sponsor
USER_PRIVATE_KEY=<sui_user_key>          # the allowlisted user
SUI_RPC_URL=https://fullnode.<net>.sui.io
# Optional (only if your packages differ):
ALLOWLIST_PACKAGE=your-allowlist-npm-pkg
SEAL_SDK_PACKAGE=your-seal-sdk-npm-pkg
```

2. Implement the two adapters with your real SDKs:

- `src/adapters/allowlist.real.ts` (already scaffolded)
- `src/adapters/seal.real.ts` (already scaffolded)

3. Run:

```bash
npm start -- --file ./fixtures/hello.txt
```

---

## Two wallets

- **Admin wallet** (gas sponsor) does the allowlist add + any gas sponsoring you require.
- **User wallet** is the identity being added to the allowlist and associated with the documentId.

Configure via `.env` as shown above.

---

## Commands

```bash
npm start -- --file ./path/to/file
# optional flags
# --out ./out                        # change output base
# --walrus-key <key>                 # mock walrus keyspace, for testing
```

---

## Project Structure

```
src/
  adapters/
    allowlist.mock.ts
    allowlist.real.ts
    seal.mock.ts
    seal.real.ts
  lib/
    fs.ts
    sui.ts
    walrus.ts
  index.ts
env.example
```

The orchestration lives in `src/index.ts`. You can swap MOCK/REAL without touching it.

---

## Notes

- **documentId** is deterministically derived from `ALLOWLIST_ID` (SHA-256, hex) to satisfy "Document ID should be generated from the allowlist ID."
- In REAL mode, `seal.real.ts` expects you to call:

  - createSessionKey()
  - encryptFile(documentId, inputPath)
  - fetchDecryptionKeys(sessionKey, documentId)
  - decryptToFile(...)
- In REAL mode, `allowlist.real.ts` expects your package to expose an `addUserToAllowlist(allowlistId, adminSigner, userAddress)` or equivalent. Replace as needed.
- Walrus upload/download is abstracted in `lib/walrus.ts`. In MOCK mode it writes/reads files to `out/walrus/`.

---
