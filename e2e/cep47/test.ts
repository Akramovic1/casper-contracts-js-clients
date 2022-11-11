import { config } from "dotenv";
config({ path: ".env.cep47" });
import { CEP47Client, CEP47Events, CEP47EventParser } from "casper-cep47-js-client";
import { HexToCLPublicKey } from '../../contract/utils/contract-utils';

// import { CEP47Client} from "../../contract/lib/cep47"
import { parseTokenMeta, sleep, getDeploy, getAccountInfo, getAccountNamedKeyValue } from "../utils";
import {
  CLValueBuilder,
  Keys,
  CLPublicKey,
  CLAccountHash,
  CLPublicKeyType,
  DeployUtil,
  EventStream,
  EventName,
  CLValueParsers,
  CLMap,
} from "casper-js-sdk";

import { parseNFT } from '../../contract/utils/parsers';

const {
  NODE_ADDRESS,
  EVENT_STREAM_ADDRESS,
  CHAIN_NAME,
  WASM_PATH,
  MASTER_KEY_PAIR_PATH,
  USER_KEY_PAIR_PATH,
  TOKEN_NAME,
  CONTRACT_NAME,
  TOKEN_SYMBOL,
  CONTRACT_HASH,
  INSTALL_PAYMENT_AMOUNT,
  MINT_ONE_PAYMENT_AMOUNT,
  MINT_COPIES_PAYMENT_AMOUNT,
  TRANSFER_ONE_PAYMENT_AMOUNT,
  BURN_ONE_PAYMENT_AMOUNT,
  MINT_ONE_META_SIZE,
  MINT_COPIES_META_SIZE,
  MINT_COPIES_COUNT,
  MINT_MANY_META_SIZE,
  MINT_MANY_META_COUNT,
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
  `${MASTER_KEY_PAIR_PATH}/public_key.pem`,
  `${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const KEYS_USER = Keys.Ed25519.parseKeyFiles(
  `${USER_KEY_PAIR_PATH}/public_key.pem`,
  `${USER_KEY_PAIR_PATH}/secret_key.pem`
);

const test = async () => {
  const cep47 = new CEP47Client(
    NODE_ADDRESS!,
    CHAIN_NAME!
  );

  let accountInfo = await getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

  console.log(`... Account Info: `);
  console.log(JSON.stringify(accountInfo, null, 2));

  const contractHash = await getAccountNamedKeyValue(
    accountInfo,
    `${CONTRACT_NAME!}_contract_hash`
  );

  const contractPackageHash = await getAccountNamedKeyValue(
    accountInfo,
    `contract_package_hash`
  );

  console.log(`... Contract Hash: ${contractHash}`);
  console.log(`... Contract Package Hash: ${contractPackageHash}`);

  await cep47.setContractHash(contractHash, contractPackageHash);

  await sleep(5 * 1000);

  const es = new EventStream(EVENT_STREAM_ADDRESS!);

  es.subscribe(EventName.DeployProcessed, (event) => {
    const parsedEvents = CEP47EventParser({
      contractPackageHash, 
      eventNames: [
        CEP47Events.MintOne,
        CEP47Events.TransferToken,
        CEP47Events.BurnOne,
        CEP47Events.MetadataUpdate,
        CEP47Events.ApproveToken
      ]
    }, event);

    if (parsedEvents && parsedEvents.success) {
      console.log("*** EVENT ***");
      console.log(parsedEvents.data);
      console.log("*** ***");
    }
  });

  es.start();

  const name = await cep47.name();
  console.log(`... Contract name: ${name}`);

  const symbol = await cep47.symbol();
  console.log(`... Contract symbol: ${symbol}`);

  const meta = await cep47.meta();
  console.log(`... Contract meta: ${JSON.stringify(meta)}`);

  let totalSupply = await cep47.totalSupply();
  console.log(`... Total supply: ${totalSupply}`);


  //****************//
  //* Test Section *//
  //****************//

  const pk = CLPublicKey.fromHex('012e37ffd943f25cf1fa6f0fbb3bdca845cbc468b08a34f3d5752ae03ef5dd07a1')

  console.log(await cep47.getTokenByIndex(pk,'0'))


};

test();
