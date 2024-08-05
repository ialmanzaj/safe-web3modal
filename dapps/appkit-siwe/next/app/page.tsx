"use client"
import { useState } from 'react';
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { createPasskey, storePasskeyInLocalStorage } from './lib/passkeys'
import LoginWithPasskey from './components/login';
import SafeAccountDetails from './components/safeAccount'


export default function Home() {
  const [selectedPasskey, setSelectedPasskey] = useState<PasskeyArgType>()

  async function handleCreatePasskey() {
    const passkey = await createPasskey()

    storePasskeyInLocalStorage(passkey)
    setSelectedPasskey(passkey)
  }

  async function handleSelectPasskey(passkey: PasskeyArgType) {
    setSelectedPasskey(passkey)
  }

  return (
    <main >
      <w3m-button />
      <LoginWithPasskey handleCreatePasskey={handleCreatePasskey} handleSelectPasskey={handleSelectPasskey} />
      {selectedPasskey ? <SafeAccountDetails passkey={selectedPasskey} /> : <div>No passkey selected</div>}

    </main>
  );
}
