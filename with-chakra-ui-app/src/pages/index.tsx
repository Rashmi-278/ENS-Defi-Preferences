import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Input,
  Select,
  Button,
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useEnsName,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { namehash, encodeFunctionData } from "viem";

const ENS_PUBLIC_RESOLVER = "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63" as const;

const resolverAbi = [
  {
    name: "setText",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "key", type: "string" },
      { name: "value", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "text",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "key", type: "string" },
    ],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "multicall",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "data", type: "bytes[]" }],
    outputs: [{ name: "results", type: "bytes[]" }],
  },
] as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const [preferredDex, setPreferredDex] = useState("");
  const [slippage, setSlippage] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [status, setStatus] = useState("");

  const node = ensName ? namehash(ensName) : undefined;

  // Read ENS text records
  const {
    data: ensRecords,
    refetch: refetchRecords,
  } = useReadContracts({
    contracts: node
      ? [
          {
            address: ENS_PUBLIC_RESOLVER,
            abi: resolverAbi,
            functionName: "text",
            args: [node, "defi.preferred_dex"],
          },
          {
            address: ENS_PUBLIC_RESOLVER,
            abi: resolverAbi,
            functionName: "text",
            args: [node, "defi.slippage"],
          },
          {
            address: ENS_PUBLIC_RESOLVER,
            abi: resolverAbi,
            functionName: "text",
            args: [node, "defi.risk"],
          },
        ]
      : undefined,
    query: { enabled: false },
  });

  // Write ENS text records
  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isTxConfirmed) {
      setStatus("Saved to ENS successfully");
    }
  }, [isTxConfirmed]);

  const handleSave = () => {
    if (!ensName || !node) {
      setStatus("No ENS name found for this wallet");
      return;
    }

    resetWrite();

    const calls = [
      encodeFunctionData({
        abi: resolverAbi,
        functionName: "setText",
        args: [node, "defi.preferred_dex", preferredDex],
      }),
      encodeFunctionData({
        abi: resolverAbi,
        functionName: "setText",
        args: [node, "defi.slippage", slippage],
      }),
      encodeFunctionData({
        abi: resolverAbi,
        functionName: "setText",
        args: [node, "defi.risk", riskLevel],
      }),
    ];

    writeContract({
      address: ENS_PUBLIC_RESOLVER,
      abi: resolverAbi,
      functionName: "multicall",
      args: [calls],
    });

    setStatus("Transaction pending...");
  };

  const handleLoad = async () => {
    if (!ensName || !node) {
      setStatus("No ENS name found for this wallet");
      return;
    }

    setStatus("Loading ENS preferences...");
    const result = await refetchRecords();

    if (result.data) {
      const [dex, slip, risk] = result.data;
      if (dex.status === "success" && dex.result) setPreferredDex(dex.result);
      if (slip.status === "success" && slip.result) setSlippage(slip.result);
      if (risk.status === "success" && risk.result) setRiskLevel(risk.result);
      setStatus("Loaded ENS preferences");
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        w="420px"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={4} w="full">
          <ConnectButton />

          {!isConnected && (
            <Text fontSize="sm" color="gray.500">
              Connect wallet to continue
            </Text>
          )}

          {isConnected && (
            <>
              <VStack spacing={1} w="full">
                <Text fontSize="sm" color="gray.500">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </Text>
                {ensName && (
                  <Text fontSize="sm" fontWeight="bold">
                    {ensName}
                  </Text>
                )}
              </VStack>

              <FormControl>
                <FormLabel fontSize="sm">Preferred DEX</FormLabel>
                <Input
                  placeholder="uniswap"
                  value={preferredDex}
                  onChange={(e) => setPreferredDex(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Slippage (%)</FormLabel>
                <Input
                  placeholder="0.5"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Risk Level</FormLabel>
                <Select
                  placeholder="Select risk level"
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </Select>
              </FormControl>

              <Button
                w="full"
                colorScheme="blue"
                onClick={handleSave}
                isLoading={isWritePending || isTxConfirming}
                loadingText={isTxConfirming ? "Confirming..." : "Signing..."}
              >
                Save to ENS
              </Button>

              <Button
                w="full"
                colorScheme="green"
                onClick={handleLoad}
              >
                Load from ENS
              </Button>

              {status && (
                <Text fontSize="sm" color="gray.600">
                  {status}
                </Text>
              )}
            </>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}
