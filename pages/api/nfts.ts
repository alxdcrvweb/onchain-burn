import type { NextApiRequest, NextApiResponse } from "next";
import { ipfsGateway } from "../../utils/utilities";
import fetch from "node-fetch";
import { moralisUrl } from "../../config/config";
import { mintContract } from "../../utils/contracts/mint";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address = req?.query?.address.toString();
  const chain = req?.query?.chain.toString();
  if (!address || !chain) {
    res.status(400).json({ error: "Missing address or chain parameter" });
    return;
  }
  const params = {
    chain: chain,
    offset: "1",
    normalizeMetadata: "true",
    token_addresses: mintContract,
    media_items: 'true',
    
  };

  const query = new URLSearchParams(params).toString();
  try {
    const response = await fetch(moralisUrl + address + `/nft/?` + query, {
      headers: {
        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY as string,
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
