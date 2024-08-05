"use client"

import { PasskeyArgType } from '@safe-global/protocol-kit'
import { useState } from 'react'
import { loadPasskeysFromLocalStorage } from '../lib/passkeys'

type props = {
    handleCreatePasskey: () => {}
    handleSelectPasskey: (passkey: PasskeyArgType) => {}
}

function LoginWithPasskey({ handleCreatePasskey, handleSelectPasskey }: props) {
    const [passkeys, setPasskeys] = useState<PasskeyArgType[]>([])

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="p-4">
                <h1 className="text-center text-2xl font-bold text-primary">
                    Use Safe Account via Passkeys
                </h1>

                <p className="text-center mb-8 mt-8">
                    Create a new Safe using passkeys
                </p>

                <button
                    onClick={handleCreatePasskey}
                    className="bg-blue-500 text-white p-2 rounded-md"


                >
                    Create a new passkey
                </button>

                <p className="text-center mb-8 mt-8">
                    OR
                </p>
                <p className="text-center mb-8 mt-8">
                    Connect existing Safe using an existing passkey
                </p>

                <button
                    onClick={async () => {
                        const passkeys = loadPasskeysFromLocalStorage()

                        setPasskeys(passkeys)
                        handleSelectPasskey(passkeys[0])
                    }}
                >
                    Use an existing passkey
                </button>
            </div>
        </div>
    )
}

export default LoginWithPasskey
