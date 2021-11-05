import { ChainId, JSBI, Percent, Token, WAVAX } from '@partyswap-libs/sdk';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { injected } from '../connectors';


export const GAS_PRICE = 225;

export const ROUTER_ADDRESS = {
  [ChainId.AVALANCHE]: '0xff164Ede3E7C375E8764E9e3a22D3E35F780EEBC',
  [ChainId.FUJI]: '0x3705aBF712ccD4fc56Ee76f0BD3009FD4013ad75'
};

export const LANDING_PAGE = 'https://partyswap.io/';
export const ANALYTICS_PAGE = 'https://info.partyswap.io/';
// TODO: update url to prod url
export const TOKEN_MIGRATION_PAGE = 'https://migrator.partyswap.io/';
export const V1_PAGE = 'https://old.partyswap.io/#';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const GOVERNANCE_ADDRESS = '0xb0Ff2b1047d9E8d294c2eD798faE3fA817F43Ee1';

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
};

export const PARTY: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x02048fe5d5849bfdb0ff2150c443c2a2a28fc0de', 18, 'PARTY', 'PARTY V2'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x25afD99fcB474D7C336A2971F26966da652a92bc',
    18,
    'PARTY',
    'PARTY V2'
  )
};

export const PARTY_V1: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x69A61f38Df59CBB51962E69C54D39184E21C27Ec', 18, 'PARTY', 'PARTY'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x69A61f38Df59CBB51962E69C54D39184E21C27Ec',
    18,
    'PARTY',
    'PARTY'
  )
};

export const PNG: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x20C62EEde571409f7101076F8dA0221867AA46dc', 18, 'PNG', 'Pangolin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x60781C2586D68229fde47564546784ab3fACA982', 18, 'PNG', 'Pangolin')
};

export const ETH: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ETH', 'Ether'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, 'WETH.e', 'Ether')
};

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDC.e', 'USD Coin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    6,
    'USDC.e',
    'USD Coin'
  )
};

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x2058ec2791dD28b6f67DB836ddf87534F4Bbdf22',
    18,
    'FUJISTABLE',
    'The Fuji stablecoin'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
    6,
    'USDT.e',
    'Tether USD'
  )
};

export const BUSD: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BUSD', 'Binance-Peg BUSD Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x9610b01AAa57Ec026001F7Ec5CFace51BfEA0bA6',
    18,
    'BUSD',
    'Binance-Peg BUSD Token'
  )
};

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped Bitcoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x50b7545627a5162F82A992c33b87aDc75187B218',
    8,
    'WBTC.e',
    'Wrapped Bitcoin'
  )
};

export const LINK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'LINK', 'ChainLink Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x5947BB275c521040051D82396192181b413227A3',
    18,
    'LINK.e',
    'ChainLink Token'
  )
};

export const DAI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x01a38eCc037DCf490045f6E4D74296F212331B99', 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    18,
    'DAI.e',
    'Dai Stablecoin'
  )
};

export const SNOB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0xf319e2f610462f846d6e93f51cdc862eeff2a554', 18, 'SNOB', 'Snowball'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xc38f41a296a4493ff429f1238e030924a1542e50',
    18,
    'SNOB',
    'Snowball'
  )
};

export const aaBLOCK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 8, 'aaBLOCK', 'Blocknet'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xc931f61b1534eb21d8c11b24f3f5ab2471d4ab50',
    8,
    'aaBLOCK',
    'Blocknet'
  )
};

export const SPORE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 9, 'SPORE', 'Spore.Finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x6e7f5C0b9f4432716bDd0a77a3601291b9D9e985',
    9,
    'SPORE',
    'Spore.Finance'
  )
};

export const BAG: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BAG', 'Baguette'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xa1144a6A1304bd9cbb16c800F7a867508726566E', 18, 'BAG', 'Baguette')
};

export const PEFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'PEFI', 'PenguinToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xe896cdeaac9615145c0ca09c8cd5c25bced6384c',
    18,
    'PEFI',
    'PenguinToken'
  )
};

export const FRAX: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'FRAX', 'Frax'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xBB69c92FBb4F1aFf528875056650c862F94D3CC1', 18, 'FRAX', 'Frax')
};

export const ZERO: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZERO', 'Zero.Exchange Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x9Bdd302e506C3F6c23c085C37789cce6d3C1a233',
    18,
    'ZERO',
    'Zero.Exchange Token'
  )
};
export const ELK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ELK', 'Elk'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C', 18, 'ELK', 'Elk')
};

export const XAVA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'XAVA', 'Avalaunch'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xd1c3f94de7e5b45fa4edbba472491a9f4b166fc4',
    18,
    'XAVA',
    'Avalaunch'
  )
};

export const AVME: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AVME', 'AVME'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x1ecd47ff4d9598f89721a2866bfeb99505a413ed', 18, 'AVME', 'AVME')
};

export const RENDOGE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 8, 'renDOGE', 'renDOGE'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xcE829A89d4A55a63418bcC43F00145adef0eDB8E',
    8,
    'renDOGE',
    'renDOGE'
  )
};

export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xf39f9671906d8630812f9d9863bBEf5D523c84Ab', 18, 'UNI', 'Uniswap')
};

export const SUSHI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SUSHI', 'SushiToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc',
    18,
    'SUSHI',
    'SushiToken'
  )
};

export const AAVE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AAVE', 'Aave Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x8cE2Dee54bB9921a2AE0A63dBb2DF8eD88B91dD9',
    18,
    'AAVE',
    'Aave Token'
  )
};

export const SHERPA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SHERPA', 'Sherpa'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xa5E59761eBD4436fa4d20E1A27cBa29FB2471Fc6',
    18,
    'SHERPA',
    'Sherpa'
  )
};

export const YAK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YAK', 'Yak Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7',
    18,
    'YAK',
    'Yak Token'
  )
};

export const QI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'QI', 'BENQI'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5', 18, 'QI', 'BENQI')
};

export const YFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YFI', 'yearn.finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x99519AcB025a0e0d44c3875A4BbF03af65933627',
    18,
    'YFI',
    'yearn.finance'
  )
};

export const VSO: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'VSO', 'VersoToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x846D50248BAf8b7ceAA9d9B53BFd12d7D7FBB25a',
    18,
    'VSO',
    'VersoToken'
  )
};

export const GB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'GB', 'GoodBridging'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x90842eb834cFD2A1DB0b1512B254a18E4D396215',
    18,
    'GB',
    'GoodBridging'
  )
};

export const LIQUIDITY_POOL_MANAGER_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: '0xa0a29Bd6e48C36512894bdDAA08ae6034e1d7211',
  [ChainId.AVALANCHE]: '0xC40E43f7Ba697658A2B3a9f6b659ec23Aab4Bd33'
};

export const JACUZZI_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: '0x5905835E7F5bA05AFa896A42d9d44185Affc4514',
  [ChainId.AVALANCHE]: '0xA07d1932775f22DaeDA671812c16F859b4257363'
};

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: ZERO_ADDRESS,
  [ChainId.AVALANCHE]: '0x0C58C2041da4CfCcF5818Bbe3b66DBC23B3902d9'
};

const WAVAX_ONLY: ChainTokenList = {
  [ChainId.FUJI]: [WAVAX[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [WAVAX[ChainId.AVALANCHE]]
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WAVAX_ONLY,
  [ChainId.FUJI]: [...WAVAX_ONLY[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [...WAVAX_ONLY[ChainId.AVALANCHE]]
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[]; } } = {
  [ChainId.FUJI]: {},
  [ChainId.AVALANCHE]: {}
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WAVAX_ONLY,
  [ChainId.FUJI]: [...WAVAX_ONLY[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [...WAVAX_ONLY[ChainId.AVALANCHE]]
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WAVAX_ONLY,
  [ChainId.FUJI]: [...WAVAX_ONLY[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [...WAVAX_ONLY[ChainId.AVALANCHE]]
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.AVALANCHE]: [],
  [ChainId.FUJI]: []
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo; } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
};

export const NetworkContextName = 'NETWORK';

export const AVALANCHE_CHAIN_PARAMS: { [chainId in ChainId]?: any } = {
  [ChainId.FUJI]: {
    chainId: '0xa869', // A 0x-prefixed hexadecimal chainId
    chainName: 'Avalanche Fuji C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax-test.network/']
  },
  [ChainId.AVALANCHE]: {
    chainId: '0xa86a', // A 0x-prefixed hexadecimal chainId
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax.network/']
  }
};

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 60 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60;

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000));
export const PARTY_DECIMALS_DIVISOR = 1000000000000000000;

export const toFixedTwo = (value: any): number => +(value / PARTY_DECIMALS_DIVISOR).toFixed(2);
export const toFixed = (value: any, digits: number = 4) =>
  +(value / PARTY_DECIMALS_DIVISOR).toFixed(digits) - 1 / 10 ** (digits - 1);
