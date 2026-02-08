# Frontend Instructions

Build a minimal Next.js app that:

## Requirements
- RainbowKit wallet connect
- wagmi config
- ENS hooks implemented
- Tailwind basic styling

## Pages
### Home Page
Sections:

1. Connect Wallet
2. Show:
   - wallet address
   - ENS name
3. Form:
   - preferred_dex
   - slippage
   - risk_level
4. Buttons:
   - Save to ENS
   - Load from ENS

## ENS Integration
Use wagmi:
- useAccount
- useEnsName
- useEnsText
- writeContract to setText

## UI
Very minimal:
Centered card layout
Three inputs
Two buttons

## Deliverable
Fully working minimal UI without complex styling
