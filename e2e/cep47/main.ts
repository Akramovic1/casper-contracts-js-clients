// import { getTokenByIndex, getMappedTokenMeta } from "../../contract/lib/cep47";
import {
  CasperClient,
  CLPublicKey,
  CLURef,
  Keys,
  CasperServiceByJsonRPC,
  DeployUtil,
  Signer,
  CLValueBuilder,
} from 'casper-js-sdk';

const getAccountBalance: any = async (publicKey: string) => {
  const client = new CasperServiceByJsonRPC(CONNECTION.NODE_ADDRESS);
  const latestBlock: any = await client.getLatestBlockInfo();
  const root = await client.getStateRootHash(latestBlock.block.hash);
  const MOTE_RATE = 1000000000;
  let balanceUref;
  try {
    balanceUref = await client.getAccountBalanceUrefByPublicKey(
      root,
      CLPublicKey.fromHex(publicKey)
    );
  } catch (err) {
    return 0;
  }
  
let publixKey = "012e37ffd943f25cf1fa6f0fbb3bdca845cbc468b08a34f3d5752ae03ef5dd07a1";

console.log(getAccountBalance(publixKey));