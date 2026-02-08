# ENS DeFi Preference Identity

### Core concept

Today every DeFi app asks users to repeatedly configure:

* slippage tolerance
* preferred DEX
* risk preference
* notification settings

These settings are **not portable** across apps.

Your app shows that **ENS can act as a portable DeFi identity layer** by storing those preferences inside **ENS text records**, so any future DeFi interface could read them automatically.

---

## What the app does (user flow)

**Step 1 — Connect wallet**
User connects wallet via RainbowKit.

**Step 2 — Resolve ENS**
App resolves the wallet ENS name using wagmi ENS hooks.

**Step 3 — Set preferences**
User inputs:

* Preferred DEX (Uniswap / CowSwap etc.)
* Slippage tolerance
* Risk profile (low / medium / high)

**Step 4 — Save to ENS**
App writes these preferences to ENS text records like:

```
defi.preferred_dex = "uniswap"
defi.slippage = "0.5"
defi.risk = "medium"
```

**Step 5 — Load preferences**
App reads ENS records and displays:

“Your ENS DeFi identity is loaded”

