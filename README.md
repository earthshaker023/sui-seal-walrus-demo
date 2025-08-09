# Sui + SEAL + Walrus Demo (Two-Wallet, Allowlist, Gas Sponsor)

This script:

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
pnpm i   # or npm i / yarn
cp .env.example .env
pnpm tsx src/index.ts --file ./fixtures/hello.txt
