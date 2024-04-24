
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { Web3 } from "web3";
import type { NextApiRequest, NextApiResponse } from "next";
import types from '../../utils/pillTypes.json';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.query.id);
    const web3 = new Web3("https://endpoints.omniatech.io/v1/base/mainnet/public");
    let typeArr = types;
    const help = typeArr.map((el: any) => {
      el.tokenId = web3.eth.abi.encodeParameter("uint256", el.tokenId);
      el.type = web3.eth.abi.encodeParameter("uint256", el.type);
      return keccak256(
        Buffer.concat([
          Buffer.from(el.tokenId.replace("0x", ""), "hex"),
          Buffer.from(el.type.replace("0x", ""), "hex"),
        ])
      );
    });
    const merkleTree = new MerkleTree(help, keccak256, { sortPairs: true });
    res.status(200).json(merkleTree.getHexProof(help[Number(req.query.id) - 1]));
  } catch (e) {
    console.log(e);
  }
}
