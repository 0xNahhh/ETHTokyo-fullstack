import type { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '~/server/api/root';
import {  createTRPCContext } from '~/server/api/trpc'

const TestEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const context = createTRPCContext({ req, res });
  const caller = appRouter.createCaller(context);

  const { domain, to } = req.query

  const data = await caller.checkContract({
    domain: domain as string,
    to: to as string,
  });

  res.status(200).json(data);
};

export default TestEndpoint