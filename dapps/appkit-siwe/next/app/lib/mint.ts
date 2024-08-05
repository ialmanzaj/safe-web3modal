import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { PasskeyArgType } from "@safe-global/protocol-kit";
import {
  createSmartAccountClient,
  walletClientToSmartAccountSigner,
} from "permissionless";
import { Safe4337Pack } from "@safe-global/relay-kit";
import { encodeFunctionData, type WalletClient } from "viem";
import {
  BUNDLER_URL,
  NFT_ADDRESS,
  PAYMASTER_ADDRESS,
  PAYMASTER_URL,
  RPC_URL,
} from "./constants";

const paymasterOptions = {
  isSponsored: true,
  paymasterAddress: PAYMASTER_ADDRESS,
  paymasterUrl: PAYMASTER_URL,
};

export const mintNft = async (
  passkey: PasskeyArgType,
  safeAddress: string,
  walletClient: WalletClient | undefined,
  socialSmartAccount: string
) => {
  if (!walletClient) return;
  const signer = walletClientToSmartAccountSigner(walletClient);
  console.log("signer", signer.address);

  const safe4337Pack = await Safe4337Pack.init({
    provider: RPC_URL,
    signer: passkey,
    bundlerUrl: BUNDLER_URL,
    paymasterOptions,
    options: {
      owners: [safeAddress, socialSmartAccount],
      threshold: 1,
    },
  });

  const mintNFTTransaction = {
    to: NFT_ADDRESS,
    data: encodeSafeMintData(safeAddress),
    value: "0",
  };

  console.log("mintNFTTransaction", mintNFTTransaction);

  const safeOperation = await safe4337Pack.createTransaction({
    transactions: [mintNFTTransaction],
  });

  const signedSafeOperation = await safe4337Pack.signSafeOperation(
    safeOperation
  );

  console.log("SafeOperation", signedSafeOperation);

  // 4) Execute SafeOperation
  const userOperationHash = await safe4337Pack.executeTransaction({
    executable: signedSafeOperation,
  });

  console.log("userOperationHash", userOperationHash);
};

export function encodeSafeMintData(
  to: string,
  tokenId: bigint = getRandomUint256()
): string {
  return encodeFunctionData({
    abi: [
      {
        constant: false,
        inputs: [
          {
            name: "to",
            type: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "safeMint",
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "safeMint",
    args: [to, tokenId],
  });
}

function getRandomUint256(): bigint {
  const dest = new Uint8Array(32); // Create a typed array capable of storing 32 bytes or 256 bits

  crypto.getRandomValues(dest); // Fill the typed array with cryptographically secure random values

  let result = 0n;
  for (let i = 0; i < dest.length; i++) {
    result |= BigInt(dest[i]) << BigInt(8 * i); // Combine individual bytes into one bigint
  }

  return result;
}
