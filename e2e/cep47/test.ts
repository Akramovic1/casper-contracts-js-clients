import { config } from "dotenv";
config({ path: ".env.cep47" });
import { CEP47Client, CEP47Events, CEP47EventParser } from "casper-cep47-js-client";
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
  //* Mint Section *//
  //****************//
  console.log('\n*************************\n');

    console.log('... Mint token one \n');
    
  const metas = [new Map()];

  metas[0].set('title', "Ahmed's Token");
  metas[0].set('description', "Test description");
  metas[0].set('image',"https://test.com/image.png");
  metas[0].set('price', "100");
  metas[0].set('isForSale', "true");
  metas[0].set('currency', "USD");
  metas[0].set('campaign', "Test campaign");
  metas[0].set('creator', "Test creator");
  metas[0].set('creatorPercentage', "10");
  metas[0].set('collectionName', "Test collection name");
  metas[0].set('beneficiary', "Test beneficiary");
  metas[0].set('beneficiaryPercentage', "10");
  console.log(metas);

  const mintDeploy = await cep47.mint(
    KEYS.publicKey,
    ["1"],
    metas,
    MINT_ONE_PAYMENT_AMOUNT!,
    KEYS.publicKey,
    [KEYS]
  );

  const mintDeployHash = await mintDeploy.send(NODE_ADDRESS!);

  console.log("...... Mint deploy hash: ", mintDeployHash);

  await getDeploy(NODE_ADDRESS!, mintDeployHash);
  console.log("...... Token minted successfully");

  //* Checks after mint *//
  const balanceOf1 = await cep47.balanceOf(KEYS.publicKey);

  console.log('...... Balance of master account: ', balanceOf1);

  const ownerOfTokenOne = await cep47.getOwnerOf("1");

  console.log('...... Owner of token one: ', ownerOfTokenOne);

  const tokenOneMeta = await cep47.getTokenMeta("1");

  console.log('...... Token five metadata: ', tokenOneMeta);

  const indexByToken1 = await cep47.getIndexByToken(KEYS.publicKey, "1");
  console.log('...... index of token one: ', indexByToken1);

  const tokenByIndex1 = await cep47.getTokenByIndex(KEYS.publicKey, indexByToken1);
  console.log('...... token one id: ', tokenByIndex1);



};

test();
