
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { Safe4337Pack } from '@safe-global/relay-kit'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { BUNDLER_URL, CHAIN_NAME, RPC_URL } from '../lib/constants'
import { mintNft } from '../lib/mint'
import { useWalletClient, useAccount } from 'wagmi'

type props = {
    passkey: PasskeyArgType
}

function SafeAccountDetails({ passkey }: props) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [safeAddress, setSafeAddress] = useState<string>()
    const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>()
    const [userOp, setUserOp] = useState<string>()
    const { address: socialSmartAccount } = useAccount();
    const { data: walletClient } = useWalletClient();
 
    console.log("socialSmartAccount", socialSmartAccount);

    const showSafeInfo = useCallback(async () => {
        //setIsLoading(true)
      
        const safe4337Pack = await Safe4337Pack.init({
            provider: RPC_URL,
            signer: passkey,
            bundlerUrl: BUNDLER_URL,
            options: {
                owners: [],
                threshold: 1
            }
        })


        const safeAddress = await safe4337Pack.protocolKit.getAddress()
        console.log("safeAddress", safeAddress);
        const isSafeDeployed = await safe4337Pack.protocolKit.isSafeDeployed()
        console.log("isSafeDeployed", isSafeDeployed);
        setSafeAddress(safeAddress)
        setIsSafeDeployed(isSafeDeployed)
        setIsLoading(false)
    }, [passkey])


    useEffect(() => {
        showSafeInfo()
    }, [showSafeInfo])

    async function handleMintNFT() {
        setIsLoading(true)

        if (!safeAddress || !walletClient || !socialSmartAccount) return;
        const userOp = await mintNft(passkey, safeAddress!, walletClient, socialSmartAccount!)

        setIsLoading(false)
        setIsSafeDeployed(true)
        setUserOp(userOp!)
    }

    const safeLink = `https://app.safe.global/home?safe=sep:${safeAddress}`
    const jiffscanLink = `https://jiffyscan.xyz/userOpHash/${userOp}?network=${CHAIN_NAME}`

    return (

        <div>
            {isLoading || !safeAddress ? (
                <div style={{ margin: "24px" }}>
                    loading...
                </div>
            ) : (
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <span style={{ margin: "0" }}>{splitAddress(safeAddress)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>{!isSafeDeployed && <button onClick={handleMintNFT}>Mint NFT</button>} {userOp && (
                            <div style={{ textAlign: "center" }}>
                                <div>
                                    <div style={{ padding: "4px", alignItems: "center" }}>
                                        <div>
                                            {userOp}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SafeAccountDetails

const DEFAULT_CHAR_DISPLAYED = 6

function splitAddress(
    address: string,
    charDisplayed: number = DEFAULT_CHAR_DISPLAYED
): string {
    const firstPart = address.slice(0, charDisplayed)
    const lastPart = address.slice(address.length - charDisplayed)

    return `${firstPart}...${lastPart}`
}

function PendingDeploymentLabel() {
    return (
        <div style={{ margin: '12px auto' }}>
            <span
                style={{
                    marginRight: '8px',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    border: '1px solid rgb(255, 255, 255)',
                    whiteSpace: 'nowrap',
                    backgroundColor: 'rgb(240, 185, 11)',
                    color: 'rgb(0, 20, 40)',
                }}
            >
                Deployment pending
            </span>
        </div>
    )
}
