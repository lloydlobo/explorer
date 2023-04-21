// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

type UserId = string | null;

type Data = {
  id: UserId;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { sessionId, userId } = getAuth(req);
  if (!sessionId) {
    return res.status(401).json({ id: null });
  }
  return res.status(200).json({ id: userId });
}
