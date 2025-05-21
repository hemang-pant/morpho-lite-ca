import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Abi, ContractFunctionArgs, ContractFunctionName, extractChain, Hash, TransactionReceipt } from "viem";
import {
  BaseError,
  Config,
  ResolvedRegister,
  useChainId,
  useChains,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { type WriteContractVariables } from "wagmi/query";

import { Button } from "@/components/shadcn/button";

export function TransactionButton<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  chainId extends config["chains"][number]["id"],
  config extends Config = ResolvedRegister["config"],
  
>({
  children,
  variables,
  disabled,
  onTxnReceipt,
  beforeTxn,  // NEW prop

}: {
  children: React.ReactNode;
  variables?: WriteContractVariables<abi, functionName, args, config, chainId>;
  disabled: boolean;
  onTxnReceipt?: (receipt: TransactionReceipt) => void;
  beforeTxn?: () => Promise<void>;  // NEW prop type
}) {
  const [isWaitingForUser, setIsWaitingForUser] = useState(false);
  const [txnHash, setTxnHash] = useState<Hash | undefined>(undefined);

  const chainId = useChainId();
  const chains = useChains();
  const chain = extractChain({ chains, id: chainId });
  const { writeContract } = useWriteContract();
  const { data: txnReceipt } = useWaitForTransactionReceipt({ hash: txnHash, confirmations: 1 });

  useEffect(() => {
    if (txnReceipt === undefined) return;

    console.log(txnReceipt);
    onTxnReceipt?.(txnReceipt);

    if (txnReceipt.status === "success") {
      toast.success(`Transaction ${txnHash?.slice(0, 8)} was successful.`, { duration: 10_0000 });
    } else {
      toast.error(`Transaction ${txnHash?.slice(0, 8)} reverted.`, { duration: 10_0000 });
    }
    setTxnHash(undefined);
  }, [txnReceipt, txnHash, onTxnReceipt]);

  return (
    <Button
      className="text-md mt-3 h-12 w-full rounded-full font-light"
      variant="blue"
      onClick={async () => {
        console.log("Button clicked");
        setIsWaitingForUser(true);
        setTxnHash(undefined);
        if (beforeTxn) {
              console.log("Running beforeTxn...");  // <--- add this debug line
          try {
            console.log("Running pre-transaction step...");
            await beforeTxn(); 
             // Run your bridge function here
                   console.log("beforeTxn done.");      // <--- add this debug line

          } catch (err) {
            setIsWaitingForUser(false);
            toast.error("Pre-transaction step failed.");
            console.error(err);
            return;
          }
        }

        // @ts-expect-error wagmi is weird
        writeContract(variables, {
          onSettled(txnHash, err: BaseError) {
            setIsWaitingForUser(false);
            if (err != null) {
              toast.error(err.shortMessage);
              console.log(err.message);
            } else {
              toast(`Broadcasted transaction ${txnHash?.slice(0, 8)}.`, {
                duration: 10_0000,
                action: chain.blockExplorers
                  ? {
                      label: "Explorer ↗︎",
                      onClick: () =>
                        window.open(
                          `${chain.blockExplorers!.default.url}/tx/${txnHash}`,
                          "_blank",
                          "noopener,noreferrer",
                        ),
                    }
                  : undefined,
              });
              setTxnHash(txnHash);
            }
          },
        });
      }}
      disabled={disabled || variables === undefined || isWaitingForUser || txnHash !== undefined}
    >
      {isWaitingForUser || txnHash !== undefined ? <Loader className="h-4 w-4 animate-spin" /> : undefined}{" "}
      {isWaitingForUser ? "Check your wallet" : children}
    </Button>
  );
}
