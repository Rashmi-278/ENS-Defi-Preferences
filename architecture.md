# Architecture

## App Name
ENS DeFi Preferences

## Goal
A minimal web app where a connected wallet:
1. Resolves its ENS name
2. Stores DeFi preferences in ENS text records
3. Reads and displays preferences from ENS

This demonstrates ENS as **portable DeFi identity storage**.

## Stack
Frontend:
- Next.js
- wagmi
- viem
- RainbowKit
- Tailwind

Backend:
- No server required
- Uses public RPC via wagmi
- Optional API route for fallback ENS resolution

## Flow
User → Connect Wallet → Resolve ENS → 
Input preferences (slippage, preferred DEX, risk level) →
Write ENS text record →
Display saved preferences

## ENS Integration
Must implement:
- wagmi `useEnsName`
- wagmi `useEnsText`
- wagmi `useContractWrite` to update text record

## Contracts
Use ENS Public Resolver:
https://docs.ens.domains/web/records

## Deliverable
Simple UI:
- Connect wallet
- Show ENS
- Input preferences
- Save to ENS
- Read from ENS
