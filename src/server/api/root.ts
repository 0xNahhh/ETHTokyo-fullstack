import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ethers } from 'ethers'
import { z } from "zod";
import { env } from "~/env.mjs";
import domainoorAbi from '~/abi/domainoor.json'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  setDomainOwner: publicProcedure
    .input(z.object({
      domain: z.string(),
      owner: z.string(),
      addresses: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // fetch signer
      const { domain, owner, addresses } = input
      const provider = new ethers.providers.JsonRpcProvider(env.RPC_URL)
      const signer = new ethers.Wallet(env.PRIVATE_KEY, provider)

      // set domain owner
      const domainBytes = ethers.utils.formatBytes32String(domain)
      const domainoor = new ethers.Contract(env.NEXT_PUBLIC_CONTRACT_ADDRESS, domainoorAbi, signer)
      const setDomainOwnerTx = await domainoor.setDomainOwner(domainBytes, owner)
      await setDomainOwnerTx.wait()
      console.log("domain owner set")

      // set trusted contracts
      const contracts = addresses.split(',')
      const setTrustedContractsTx = await domainoor.setTrustedContracts(domainBytes, contracts)
      await setTrustedContractsTx.wait()
      console.log("trusted contracts set")
    }),

    getDomainOwner: publicProcedure
      .input(z.object({ domain: z.string() }))
      .query(async ({ input, ctx }) => {
        const { domain } = input

        const provider = new ethers.providers.JsonRpcProvider(env.RPC_URL)
        const signer = new ethers.Wallet(env.PRIVATE_KEY, provider)

        // set domain owner
        const domainBytes = ethers.utils.formatBytes32String(domain)
        const domainoor = new ethers.Contract(env.NEXT_PUBLIC_CONTRACT_ADDRESS, domainoorAbi, signer)
        const domainOwner = await domainoor.getDomainOwner(domainBytes)

        return domainOwner
      }),

    checkContract: publicProcedure
      .input(z.object({ domain: z.string(), to: z.string() }))
      .query(async ({ input, ctx }) => {
        const { domain, to } = input

        const provider = new ethers.providers.JsonRpcProvider(env.RPC_URL)
        const signer = new ethers.Wallet(env.PRIVATE_KEY, provider)

        // set domain owner
        const domainBytes = ethers.utils.formatBytes32String(domain)
        const domainoor = new ethers.Contract(env.NEXT_PUBLIC_CONTRACT_ADDRESS, domainoorAbi, signer)
        const contractVerified = await domainoor.checkContract(domainBytes, to)

        return contractVerified
      })
  
});

// export type definition of API
export type AppRouter = typeof appRouter;
