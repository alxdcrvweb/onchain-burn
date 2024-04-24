import type { NextApiRequest, NextApiResponse } from "next";
import { ipfsGateway } from "../../utils/utilities";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req?.query?.cid);
  fetch(ipfsGateway(req?.query?.cid?.toString())).then((resp) => {
    resp.headers.forEach((v: any, n: any) => res.setHeader(n, v));
    resp!.body!.pipe(res);
  });
}
