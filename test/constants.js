const twaABI = require('./abis/TWA.json');
const grtABI = require('./abis/GRT.json');
const usdtABI = require('./abis/USDT.json');
const usdcABI = require('./abis/USDC.json');
const daiABI = require('./abis/DAI.json');
const dpiABI = require('./abis/DPI.json');
const wbtcABI = require('./abis/WBTC.json');
const renBTCABI = require('./abis/renBTC.json');
const linkABI = require('./abis/LINK.json');
const uniABI = require('./abis/UNI.json');
const defi5ABI = require('./abis/DEFI5.json');
const cc10ABI = require('./abis/CC10.json');
const twaLPABI = require('./abis/TWALP.json');
const BPoolABI = require('./abis/BPool.json');
const BPHedgeABI = require('./abis/BPHedge.json');
const swapABI = require('./abis/swap.json');
const farmABI = require('./abis/farm.json');
const wethABI = require('./abis/WETH.json');

const poolTokenSymbol = [
  "TWA LP",
  "WETH",
  "renBTC",
  "LINK",
  "UNI" 
];

const ERC20TokenSymbol = [
  'TWA',
  'GRT',
  'USDT',
  'USDC',
  'DAI',
  'DPI',
  'WBTC',
  'renBTC',
  'LINK',
  'UNI',
  'DEFI5',
  'CC10'
];

const BPAddress = {
  'BP': '0x3B260CF977DF1ff8d87960064DaeE2cE491a1B91',
  'BPHEDGE': '0x42A4150b974E78509B5E746bc6fDa3D68da78aCC',
  'BPHEDGE_POOL': '0x76958fa640ca66e8f4337a0d874b2d8a6c408f95'
}

const swapAddress = '0x14EA26cfE41655997e0EC1BC66191dF1ca48FB66';

const farmAddress = '0xb480Fdcaa2Fa9a46e121A24128d9Fcb3C5f1A2A3';

const tokenAddress = {
  'TWA': '0xa2EF2757D2eD560c9e3758D1946d7bcccBD5A7fe',
  'GRT': '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
  'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  'DPI': '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
  'WBTC': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  'renBTC': '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  'LINK': '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  'UNI': '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  'DEFI5': '0xfa6de2697D59E88Ed7Fc4dFE5A33daC43565ea41',
  'CC10': '0x17aC188e09A7890a1844E5E65471fE8b0CcFadF3',
  'WETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
}

const pairAddress = {
  'TWA': '0x748a9631baD6AF6D048aE66e2e6E3F44213Fb1E0',
  'GRT': '0x2e81eC0B8B4022fAC83A21B2F2B4B8f5ED744D70',
  'USDT': '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
  'USDC': '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
  'DAI': '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
  'DPI': '0x4d5ef58aAc27d99935E5b6B4A6778ff292059991',
  'WBTC': '0xbb2b8038a1640196fbe3e38816f3e67cba72d940',
  'renBTC': '0x81FbEf4704776cc5bBa0A5dF3a90056d2C6900B3',
  'LINK': '0xa2107FA5B38d9bbd2C461D6EDf11B11A50F6b974',
  'UNI': '0xd3d2E2692501A5c9Ca623199D38826e513033a17',
  'DEFI5': '0x8dCBa0B75c1038c4BaBBdc0Ff3bD9a8f6979Dd13',
  'CC10': '0x2701eA55b8B4f0FE46C15a0F560e9cf0C430f833'
}

const BPTokensAddress = [
  "0x748a9631baD6AF6D048aE66e2e6E3F44213Fb1E0",
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
  "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
]

const settings = {
  tokens: [
    "0xa2EF2757D2eD560c9e3758D1946d7bcccBD5A7fe",
    "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b",
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
    "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "0xfa6de2697D59E88Ed7Fc4dFE5A33daC43565ea41",
    "0x17aC188e09A7890a1844E5E65471fE8b0CcFadF3"
  ],
  tokenPairs: [
    "0x748a9631baD6AF6D048aE66e2e6E3F44213Fb1E0",
    "0x2e81eC0B8B4022fAC83A21B2F2B4B8f5ED744D70",
    "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
    "0x4d5ef58aAc27d99935E5b6B4A6778ff292059991",
    "0xbb2b8038a1640196fbe3e38816f3e67cba72d940",
    "0x81FbEf4704776cc5bBa0A5dF3a90056d2C6900B3",
    "0xa2107FA5B38d9bbd2C461D6EDf11B11A50F6b974",
    "0xd3d2E2692501A5c9Ca623199D38826e513033a17",
    "0x8dCBa0B75c1038c4BaBBdc0Ff3bD9a8f6979Dd13",
    "0x2701eA55b8B4f0FE46C15a0F560e9cf0C430f833"
  ],
  reApproves: [false, false, false, false, false, false, false, false, false, false, false, false]
};

const twaContract = new web3.eth.Contract(twaABI, tokenAddress['TWA']);
const grtContract = new web3.eth.Contract(grtABI, tokenAddress['GRT']);
const usdtContract = new web3.eth.Contract(usdtABI, tokenAddress['USDT']);
const usdcContract = new web3.eth.Contract(usdcABI, tokenAddress['USDC']);
const daiContract = new web3.eth.Contract(daiABI, tokenAddress['DAI']);
const dpiContract = new web3.eth.Contract(dpiABI, tokenAddress['DPI']);
const wbtcContract = new web3.eth.Contract(wbtcABI, tokenAddress['WBTC']);
const wethContract = new web3.eth.Contract(wethABI, tokenAddress['WETH']);
const renBTCContract = new web3.eth.Contract(renBTCABI, tokenAddress['renBTC']);
const linkContract = new web3.eth.Contract(linkABI, tokenAddress['LINK']);
const uniContract = new web3.eth.Contract(uniABI, tokenAddress['UNI']);
const defi5Contract = new web3.eth.Contract(defi5ABI, tokenAddress['DEFI5']);
const cc10Contract = new web3.eth.Contract(cc10ABI, tokenAddress['CC10']);

const twaLPContract = new web3.eth.Contract(twaLPABI, pairAddress['TWA']);
const BPPoolContract = new web3.eth.Contract(BPoolABI, BPAddress['BP']);
const BPHEDGEContract = new web3.eth.Contract(BPHedgeABI, BPAddress['BPHEDGE']);
const BPHEDGEPoolContract = new web3.eth.Contract(BPoolABI, BPAddress['BPHEDGE_POOL']);
const swapContract = new web3.eth.Contract(swapABI, swapAddress);
const farmContract = new web3.eth.Contract(farmABI, farmAddress);

const contracts = {
  'TWA': {
    address: tokenAddress['TWA'],
    contract: twaContract,
    decimals: 18,
    owner: '0x8f012CD662fc117dc21bCbf4A52b5052BF7a4D4E'
  },
  'GRT': {
    address: tokenAddress['GRT'],
    contract: grtContract,
    decimals: 18,
    owner: '0x8B1C44E5D18EBe84E0E2775850b6D3f61425655f'
  },
  'USDT': {
    address: tokenAddress['USDT'],
    contract: usdtContract,
    decimals: 6,
    owner: '0x449D939Ea14dE2B3840021d570A2D62cFA46AE51'
  },
  'USDC': {
    address: tokenAddress['USDC'],
    contract: usdcContract,
    decimals: 6,
    owner: '0x449D939Ea14dE2B3840021d570A2D62cFA46AE51'
  },
  'DAI': {
    address: tokenAddress['DAI'],
    contract: daiContract,
    decimals: 18,
    owner: '0x04ad0703B9c14A85A02920964f389973e094E153'
  },
  'DPI': {
    address: tokenAddress['DPI'],
    contract: dpiContract,
    decimals: 18,
    owner: '0xcfc50541c3dEaf725ce738EF87Ace2Ad778Ba0C5'
  },
  'WBTC': {
    address: tokenAddress['WBTC'],
    contract: wbtcContract,
    decimals: 8,
    owner: '0x5f71fE94C92514Ce7226EB8BF0370667124add89'
  },
  'WETH': {
    address: tokenAddress['WETH'],
    contract: wethContract,
    decimals: 18,
    owner: '0x3DbA737ccC50a32a1764b493285dd51C8Af6c278'
  },
  'renBTC': {
    address: tokenAddress['renBTC'],
    contract: renBTCContract,
    decimals: 8,
    owner: '0x99739fa525c0A98384430235d278Fd08938997F9'
  },
  'LINK': {
    address: tokenAddress['LINK'],
    contract: linkContract,
    decimals: 18,
    owner: '0xbe6977E08D4479C0A6777539Ae0e8fa27BE4e9d6'
  },
  'UNI': {
    address: tokenAddress['UNI'],
    contract: uniContract,
    decimals: 18,
    owner: '0x9F41cECc435101045Ea9F41D4EE8C5353F77e5D5'
  },
  'DEFI5': {
    address: tokenAddress['DEFI5'],
    contract: defi5Contract,
    decimals: 18,
    owner: '0x20F0a75fAc9744aeCE33518F84bCf99b81907bA0'
  },
  'CC10': {
    address: tokenAddress['CC10'],
    contract: cc10Contract,
    decimals: 18,
    owner: '0xb4aa0619a9E43E856c597c28754900f0AD6e1399'
  },
  'TWA LP': {
    address: pairAddress['TWA'],
    contract: twaLPContract,
    decimals: 18,
    owner: '0x449D939Ea14dE2B3840021d570A2D62cFA46AE51'
  },
  'BP': {
    address: BPAddress['BP'],
    contract: BPPoolContract,
    decimals: 18,
    owner: '0x449D939Ea14dE2B3840021d570A2D62cFA46AE51'
  },
  'BPHEDGE': {
    address: BPAddress['BPHEDGE'],
    contract: BPHEDGEContract,
    decimals: 18,
    owner: '0x449D939Ea14dE2B3840021d570A2D62cFA46AE51'
  },
  'BPHEDGEPool': {
    address: BPAddress['BPHEDGE_POOL'],
    contract: BPHEDGEPoolContract,
    decimals: 18,
    owner: '0x449D939Ea14dE2B3840021d570A2D62cFA46AE51'
  },
  'SWAP': {
    address: swapAddress,
    contract: swapContract,
    decimals: 18,
    owner: ''
  },
  'FARM': {
    address: farmAddress,
    contract: farmContract,
    decimals: 18,
    owner: ''
  },
  'ETH': {
    address: '',
    contract: '',
    decimals: 18,
    owner: '0x449D939Ea14dE2B3840021d570A2D62cFA46AE51'
  }
};

module.exports = {
  poolTokenSymbol,
  ERC20TokenSymbol,
  BPAddress,
  swapAddress,
  farmAddress,
  tokenAddress,
  pairAddress,
  BPTokensAddress,
  settings,
  contracts
}