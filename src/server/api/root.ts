import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ethers } from 'ethers'
import { z } from "zod";
import { env } from "~/env.mjs";
import domainoorAbi from '~/abi/domainoor.json'
import { TRPCError } from "@trpc/server";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  setDomainOwnerAndAddresses: publicProcedure
    .input(z.object({
      domain: z.string(),
      owner: z.string(),
      addresses: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // fetch signer
        const { domain, owner, addresses } = input
        const provider = new ethers.providers.JsonRpcProvider(env.RPC_URL)
        const signer = new ethers.Wallet(env.PRIVATE_KEY, provider)
        const signerAddress = await signer.getAddress()

        // set domain owner
        const domainBytes = ethers.utils.formatBytes32String(domain)
        const domainoor = new ethers.Contract(env.NEXT_PUBLIC_CONTRACT_ADDRESS, domainoorAbi, signer)
        // const setDomainOwnerSelfTx = await domainoor.setDomainOwner(domainBytes, signerAddress)
        // await setDomainOwnerSelfTx.wait()
        // console.log("domain owner set to self")

        // set trusted contracts
        const contracts = addresses.split(',')
        const setTrustedContractsTx = await domainoor.setTrustedContracts(domainBytes, contracts)
        await setTrustedContractsTx.wait()
        console.log("trusted contracts set")

        // // set domain owner
        // const setDomainOwnerTx = await domainoor.setDomainOwner(domainBytes, signerAddress)
        // await setDomainOwnerTx.wait()
        // console.log("domain owner set")
      } catch (error) {
        console.error("errors: ", error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }
    }),

    setDomainOwner: publicProcedure
      .input(z.object({
        domain: z.string(),
        owner: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // fetch signer
        const { domain, owner } = input
        const provider = new ethers.providers.JsonRpcProvider(env.RPC_URL)
        const signer = new ethers.Wallet(env.PRIVATE_KEY, provider)

        // set domain owner
        const domainBytes = ethers.utils.formatBytes32String(domain)
        const domainoor = new ethers.Contract(env.NEXT_PUBLIC_CONTRACT_ADDRESS, domainoorAbi, signer)
        const setDomainOwnerTx = await domainoor.setDomainOwner(domainBytes, owner)
        await setDomainOwnerTx.wait()
        console.log("set domain owner")

        return true
      }),

    setTrustedContracts: publicProcedure
      .input(z.object({
        domain: z.string(),
        addresses: z.string(),
      }))
      .query(async ({ input, ctx }) => {
        // fetch signer
        const { domain, addresses } = input
        const provider = new ethers.providers.JsonRpcProvider(env.RPC_URL)
        const signer = new ethers.Wallet(env.PRIVATE_KEY, provider)

        // set trusted contracts
        const domainBytes = ethers.utils.formatBytes32String(domain)
        const domainoor = new ethers.Contract(env.NEXT_PUBLIC_CONTRACT_ADDRESS, domainoorAbi, signer)
        const contracts = addresses.split(',')
        console.log("contracts: ", contracts)
        const setTrustedContractsTx = await domainoor.setTrustedContracts(domainBytes, contracts)
        await setTrustedContractsTx.wait()
        console.log("trusted contracts set")

        return true
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
