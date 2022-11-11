export const proxyServer = process.env.REACT_APP_PROXY_SERVER || '';
export const NFT_STORAGE_KEY = process.env.REACT_APP_NFT_STORAGE_KEY;
export const NODE_RPC_ADDRESS =
  process.env.REACT_APP_NODE_RPC_ADDRESS ||
  'https://node-clarity-testnet.make.services/rpc';

export const USER_KEY_PAIR_PATH =
  process.env.REACT_APP_USER_KEY_PAIR_PATH ||
  '../../keys';

export const DEPLOYER_ACC =
  process.env.REACT_APP_CASPER_PUBLIC_KEY ||
  '012e37ffd943f25cf1fa6f0fbb3bdca845cbc468b08a34f3d5752ae03ef5dd07a1';

export const TREASURY_WALLET =
  process.env.REACT_APP_CASPER_TREASURY ||
  process.env.REACT_APP_CASPER_PUBLIC_KEY;

export const CONNECTION = {
  NODE_ADDRESS: proxyServer + NODE_RPC_ADDRESS,
  CHAIN_NAME: process.env.REACT_APP_CHAIN_NAME || 'casper-test',

  CONTRACT_NAME: process.env.REACT_APP_CONTRACT_NAME || 'VINFTv0_0_1',

  CONTRACT_HASH:
    process.env.REACT_APP_NFT_CONTRACT_HASH ||
    'hash-a6ed915e065d63171415208a1d6d356edaf90dfd4b125a6c2907d80f15c82a41',
  CONTRACT_PACKAGE_HASH:
    process.env.REACT_APP_NFT_CONTRACT_PACKAGE_HASH ||
    'hash-583e3b85bf040c61b43471de96591303e5eb8e1e54d9f984abbdaabfe688e446',
};

export const KEYS = {
  DEPLOYER_ACC_HASH:
    process.env.REACT_APP_DEPLOYER_ACC_HASH ||
    'account-hash-14b94d33a1be1a2741ddefa7ae68a28cd1956e3801730bea617bf529d50f8aea',
  DEPLOYER_ACC:
    process.env.REACT_APP_DEPLOYER_ACC_HASH ||
    '01e23d200eb0f3c8a3dacc8453644e6fcf4462585a68234ebb1c3d6cc8971148c2',
};

export const NFT_CONTRACT_HASH = process.env.REACT_APP_CASPER_NFT_CONTRACT_HASH;
export const NFT_PACKAGE_HASH =
  process.env.REACT_APP_CASPER_NFT_CONTRACT_PACKAGE_HASH;

export const PROFILE_CONTRACT_HASH =
  process.env.REACT_APP_CASPER_PROFILE_CONTRACT_HASH;
export const PROFILE_PACKAGE_HASH =
  process.env.REACT_APP_CASPER_PROFILE_CONTRACT_PACKAGE_HASH;
