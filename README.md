# @askspecter/cli

SPECTER Protocol CLI — **Know Your Agent (KYA)** behavioral reputation scoring tool.

Score any Ethereum/Base address directly from your terminal with ANSI color output, JSON mode, and live watch polling.

---

## Install

### One-liner (bash)

```bash
curl -fsSL https://raw.githubusercontent.com/askspecter/specter-cli/main/install.sh | bash
```

### Manual

```bash
git clone https://github.com/askspecter/specter-cli
cd specter-cli
npm install
npm run build
npm link   # makes 'specter' available globally
```

### Via npm (once published)

```bash
npm install -g @askspecter/cli
```

---

## Commands

### `specter score <address>`

Full 7-dimension behavioral score with colored bar chart.

```
$ specter score 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

  ╔══════════════════════════════════════╗
  ║  ░░  SPECTER PROTOCOL  ░░  v1.0.0    ║
  ║      Know Your Agent · KYA           ║
  ╚══════════════════════════════════════╝

  Connecting to Base mainnet... ✓
  Indexing agent transactions... ✓
  Scoring 7 dimensions... ✓

  Address  0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
  Score    82/100
  Verdict  TRUSTED_AGENT
  Passport 0x4a2bc...
  Block    #21,847,392

  ──────────────────────────────────────────────
  Dimension Breakdown
  ──────────────────────────────────────────────
  Transaction Volume   ████████░░  78
  Counterparty Div.    █████████░  91
  Account Age          ██████░░░░  65
  Repayment History    ████████░░  88
  Exploit Exposure     █████████░  95
  Prompt Integrity     ███████░░░  72
  Peer Endorsement     ████████░░  83
  ──────────────────────────────────────────────
```

Add `--json` for machine-readable output:

```bash
specter score 0xd8dA... --json
```

---

### `specter verify <address>`

ERC-8004 identity passport verification.

```bash
specter verify 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

---

### `specter watch <address>`

Live polling — updates every 3 seconds.

```bash
specter watch 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
specter watch 0xd8dA... --interval 1000   # 1-second polling
```

---

## Development

```bash
npm install
npm run dev    # tsx (no build step)
npm test       # vitest
npm run build  # tsup → dist/
```

---

## Requirements

- Node.js ≥ 18

---

## License

MIT © [SPECTER Protocol](https://askspecter.lol)
