import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

// components
import Button from '../components/button'
import TextInput from '../components/textInput'

// utils
import { api } from '~/utils/api'

const App = () => {
  const [domain, setDomain] = useState<string>('');
  const [addresses, setAddresses] = useState<string>('');
  const { address } = useAccount()

  const setDomainOwner = api.setDomainOwner.useMutation()

  return (
    <div className='flex min-h-screen bg-gradient-to-t from-gray-900 via-gray-950 to-black'>
      <div className='absolute top-4 right-4'>
        <ConnectButton />
      </div> 

      <div className='flex-grow flex flex-col items-center justify-center gap-y-6'>
        <div className='flex flex-col gap-y-2'>
          <p className='font-bold text-2xl'>Domain</p>
          <TextInput 
            onChange={e => setDomain(e.target.value)} 
            name='domain' 
            placeholder='Please enter domain name' 
          />
        </div>

        <div className='flex flex-col gap-y-2'>
          <p className='font-bold text-2xl'>Addresses</p>
          <TextInput 
            onChange={e => setAddresses(e.target.value)} 
            name='addresses' 
            placeholder='Please enter your addresses, comma separated' 
          />
        </div>

        <Button disabled={!domain || !addresses} onClick={() => setDomainOwner.mutate({ domain, owner: address as string, addresses })}>Register</Button>
      </div>
    </div>
  )
}

export default App