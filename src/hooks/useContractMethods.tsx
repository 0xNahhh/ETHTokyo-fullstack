import { fetchSigner } from '@wagmi/core'
import { useQuery, useMutation } from 'wagmi'
import { ethers } from 'ethers'
import domainoorAbi from '../abi/domainoor.json'

const useContractMethods = () => {
  const setDomainAndAddresses = async (domain: string, addressesString: string) => {
    // fetch signer
    const signer = await fetchSigner()
    if (!signer) throw Error('Signer does not exist')
    const signerAddress = await signer.getAddress()

    // check signer has endpoint role
    // const 

    // set domain owner
    const domainoor = new ethers.Contract(import.meta.env.VITE_DOMAINOOR_ADDRESS, domainoorAbi, signer)
    const setDomainOwnerTx = await domainoor.setDomainOwner(domain, signerAddress)
    await setDomainOwnerTx.wait()
    console.log("domain owner set")

    // set trusted contracts
    const addresses = addressesString.split(',')
    const setTrustedContractsTx = await domainoor.setTrustedContracts(domain, addresses)
    await setTrustedContractsTx.wait()
    console.log("trusted contracts set")
  }
}

export default useContractMethods
