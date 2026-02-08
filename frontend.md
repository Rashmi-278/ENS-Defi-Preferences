# Frontend Implementation Guide

This project is a minimal ENS-powered DeFi identity interface built using
Next.js (App Router), Chakra UI, wagmi, viem, and RainbowKit.

The objective is to build a single-page interface that allows a connected
wallet to:

1. Resolve and display its ENS name
2. Read ENS text records for user DeFi preferences
3. Write ENS text records to store preferences

No complex styling, animations, or routing is required. Focus only on a
clean, centered functional UI.

---

# Dependencies

Install the following:

- wagmi
- viem
- @rainbow-me/rainbowkit
- @chakra-ui/react
- @emotion/react
- @emotion/styled
- framer-motion

---

# Global Setup

## Providers

Wrap the application root with:

- WagmiProvider
- RainbowKitProvider
- ChakraProvider

Ensure Ethereum mainnet is enabled in wagmi config.

---

# Page: Home (app/page.tsx)

The home page contains ONE centered card container that holds the entire UI.

Layout rules:

- Full viewport height
- Flex center horizontally and vertically
- Card width approx 420px
- Padding large (8)
- Rounded corners (xl)
- Shadow (lg)

---

# Section 1 — Wallet Connect

Display RainbowKit ConnectButton at the top of the card.

Below the button display:

- Wallet address (shortened)
- ENS name (if exists)

Implementation:

Use wagmi hooks:

- useAccount
- useEnsName

When address is undefined, display:
"Connect wallet to continue"

---

# Section 2 — Preferences Form

Create a vertical Stack containing:

### Input 1
Label: Preferred DEX  
Name: preferred_dex  
Placeholder: "uniswap"

### Input 2
Label: Slippage (%)  
Name: slippage  
Placeholder: "0.5"

### Input 3
Label: Risk Level  
Name: risk_level  
Type: select  
Options:
- low
- medium
- high

State should be managed using React useState.

---

# Section 3 — ENS Actions

Two full-width buttons:

### Button 1
Text: "Save to ENS"
Color: blue

Action:
Write ENS text records using wagmi writeContract calling
ENS Public Resolver setText()

Records to store:

key: "defi.preferred_dex"
key: "defi.slippage"
key: "defi.risk"

Values come from form state.

---

### Button 2
Text: "Load from ENS"
Color: green

Action:
Use wagmi useEnsText to read:

- defi.preferred_dex
- defi.slippage
- defi.risk

Populate the form inputs with returned values.

---

# Section 4 — Status Feedback

Below buttons display a small Text component showing:

- "Saved to ENS successfully"
- "Loaded ENS preferences"
- or transaction pending status

Use wagmi transaction state for feedback.

---

# Styling Requirements

- Chakra VStack for layout
- Spacing 4 between elements
- Inputs full width
- Buttons full width
- Minimal typography only (no headings needed)

Keep styling extremely minimal.

---

# Functional Requirements

The interface MUST:

- Work with real ENS names
- Not use hardcoded values
- Perform real ENS write transactions
- Perform real ENS read operations

---

# Deliverable

A working single-page UI where a user can:

1. Connect wallet
2. See ENS name
3. Enter preferences
4. Save preferences to ENS
5. Load preferences from ENS

No additional pages, routes, dashboards, or styling complexity required.
