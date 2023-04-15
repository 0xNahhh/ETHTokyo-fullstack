import type { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '~/server/api/root';
import {  createTRPCContext } from '~/server/api/trpc'
import { ethers } from 'ethers'

const TestEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const context = createTRPCContext({ req, res });
  const caller = appRouter.createCaller(context);

  const data = await caller.checkContract({
    domain: 'asd.com',
    to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  });

  res.status(200).json(data);
};

export default TestEndpoint