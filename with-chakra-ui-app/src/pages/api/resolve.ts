import type { NextApiRequest, NextApiResponse } from "next";
import { createPublicClient, http, isAddress, normalize } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const PREFERENCE_KEYS = [
  "defi.preferred_dex",
  "defi.slippage",
  "defi.risk",
] as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.query;

  if (!address || typeof address !== "string" || !isAddress(address)) {
    return res.status(400).json({ error: "Valid Ethereum address required" });
  }

  try {
    const ens = await client.getEnsName({ address: address as `0x${string}` });

    if (!ens) {
      return res.status(200).json({ ens: null, preferences: {} });
    }

    const records = await Promise.all(
      PREFERENCE_KEYS.map(async (key) => {
        const value = await client.getEnsText({
          name: normalize(ens),
          key,
        });
        return [key, value] as const;
      })
    );

    const preferences: Record<string, string | null> = {};
    for (const [key, value] of records) {
      preferences[key] = value;
    }

    return res.status(200).json({ ens, preferences });
  } catch (error) {
    return res.status(500).json({ error: "ENS resolution failed" });
  }
}
