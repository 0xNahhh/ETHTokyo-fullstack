import type { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '~/server/api/root';
import {  createTRPCContext } from '~/server/api/trpc'
import NextCors from 'nextjs-cors';

const TestEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

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