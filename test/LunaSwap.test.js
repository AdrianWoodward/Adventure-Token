const BigNumber = require('bignumber.js');
const LunaSwap = artifacts.require("LunaSwap");
const BPT = require('./abis/bpt.json');
const USDC = require('./abis/usdc.json');
const TWA = require('./abis/twa.json');
const LINK = require('./abis/link.json');
const WETH = require('./abis/weth.json');
const UNI = require('./abis/uni.json');
const TWALP = require('./abis/twalp.json');
const renBTC = require('./abis/renBTC.json');

const _weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const _twalp = "0x748a9631baD6AF6D048aE66e2e6E3F44213Fb1E0";
const _twa = "0xa2EF2757D2eD560c9e3758D1946d7bcccBD5A7fe";
const _lunaBP = "0x3b260cf977df1ff8d87960064daee2ce491a1b91";
const _usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const _link = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
const _uni = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
const _renBTC = "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D";

const poolTokens = [
  "0x748a9631baD6AF6D048aE66e2e6E3F44213Fb1E0", // TWA-ETH LP
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D", // renBTC
  "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"  // UNI
];
const poolTokenSymbols = [
  "TWA LP",
  "WETH",
  "renBTC",
  "LINK",
  "UNI" 
];
const poolTokenDecimals = [18, 18, 8, 18, 18];
const tokens = [
  "0xa2EF2757D2eD560c9e3758D1946d7bcccBD5A7fe", // TWA
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI
  "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
  "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D", // renBTC
  "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "0xdAC17F958D2ee523a2206206994597C13D831ec7"  // USDT 
];
const tokenPairs = [
  "0x748a9631baD6AF6D048aE66e2e6E3F44213Fb1E0", // TWA-ETH LP
  "0xd3d2E2692501A5c9Ca623199D38826e513033a17", // UNI-ETH LP
  "0xa2107FA5B38d9bbd2C461D6EDf11B11A50F6b974", // LINK-ETH LP
  "0x81FbEf4704776cc5bBa0A5dF3a90056d2C6900B3", // renBTC-ETH LP
  "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11", // DAI-ETH LP
  "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc", // USDC-ETH LP
  "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852"  // USDT-ETH LP
];
const reapproves = [false,false,false,false,false,false,false];
const owner = "0x449D939Ea14dE2B3840021d570A2D62cFA46AE51";

const divByDecimal = (v, d=18) => {
  return new BigNumber(v).div(new BigNumber(10).pow(d)).toString(10);
}

const bnToString = (v, d=18) => {
  return new BigNumber(v).toString(10);
}

contract("LunaSwap", async (accounts) => {
  const firstAccount = accounts[0];
  const secondAccount = accounts[1];

  let instance;
  let BPTinstance;
  let TWAinstance;
  let USDCinstance;
  let TWALPinstance;
  let LINKinstance;
  let renBTCinstance;
  let UNIinstance;
  let WETHinstance;

  beforeEach(async () => {
    instance = await LunaSwap.new({ from: owner });
    await instance.setTokensSettings(tokens, tokenPairs, reapproves, {
      from: owner,
      value: 0,
    });
    BPTinstance = await new web3.eth.Contract(BPT, _lunaBP);
    USDCinstance = await new web3.eth.Contract(USDC, _usdc);
    TWAinstance = await new web3.eth.Contract(TWA, _twa);
    TWALPinstance = await new web3.eth.Contract(TWALP, _twalp);
    LINKinstance = await new web3.eth.Contract(LINK, _link);
    renBTCinstance = await new web3.eth.Contract(renBTC, _renBTC);
    UNIinstance = await new web3.eth.Contract(UNI, _uni);
    WETHinstance = await new web3.eth.Contract(WETH, _weth);
  });

  describe("Settings", () => {
    it("Check token and pair settings", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const pairAddress = await instance.uniswapEthPairByTokenAddress(tokens[i]);
        assert.equal(tokenPairs[i], pairAddress);
      }
    });
  });

  describe("swapEthToLuna", () => {
    it("calcSwapEthToLunaInputs", async () => {
      const ethAmount = new BigNumber('1000000000000000000').toString(10); // 1 ether
      const slippage = new BigNumber('40000000000000000').toString(10); // 4%
      const result = await instance.calcSwapEthToLunaInputs(ethAmount, poolTokens, slippage);

      for (let i = 0; i < poolTokens.length; i++) {
        console.log('tokensInLuna[' + poolTokenSymbols[i] +']: ', divByDecimal(result['tokensInLuna'][i], poolTokenDecimals[i]));
      }
      for (let i = 0; i < poolTokens.length; i++) {
        console.log('ethInUniswap[' + poolTokenSymbols[i] +']: ', divByDecimal(result['ethInUniswap'][i]));
      }
      console.log('poolOut: ', divByDecimal(result['poolOut']));
    });

    it("calcNeedEthToPoolOut", async () => {
      const amountOut = new BigNumber('1000000000000000000').toString(10); // 1 ether
      const slippage = new BigNumber('40000000000000000').toString(10); // 4%
      const result = await instance.calcNeedEthToPoolOut(amountOut, slippage);

      console.log('eth out: ', divByDecimal(result));
    });

    it("getAmountOutForUniswap", async () => {
      const uniswapPairFor = await instance.uniswapPairFor('0x514910771AF9Ca656af840dff83E8264EcF986CA');
      const result = await instance.getAmountOutForUniswap(uniswapPairFor, '96000000000000000', false);
      console.log('Token amount out: ', divByDecimal(result['amountOut']));
    });

    it("swapEthToLuna", async () => {
      const ethAmount = new BigNumber('10000000000000000000').toString(10); // 1 ether
      const slippage = new BigNumber('40000000000000000').toString(10); // 4%
      const result = await instance.swapEthToLuna(slippage, { from: owner, value: ethAmount });
      const bptAmount = await BPTinstance.methods.balanceOf(owner).call();
      console.log('bptAmount: ', divByDecimal(bptAmount));
    });
  });

  describe("swapErc20ToLuna", () => {
    it("calcSwapErc20ToLunaInputs", async () => {
      const usdc = new BigNumber('10000000000').toString(10); // 1000 twa
      const slippage = new BigNumber('40000000000000000').toString(10); // 4%
      const result = await instance.calcSwapErc20ToLunaInputs(_usdc, usdc, poolTokens, slippage);

      for (let i = 0; i < poolTokens.length; i++) {
        console.log('tokensInLuna[' + poolTokenSymbols[i] +']: ', divByDecimal(result['tokensInLuna'][i], poolTokenDecimals[i]));
      }
      for (let i = 0; i < poolTokens.length; i++) {
        console.log('ethInUniswap[' + poolTokenSymbols[i] +']: ', divByDecimal(result['ethInUniswap'][i]));
      }
      console.log('poolOut: ', divByDecimal(result['poolOut']));
    });

    it("calcNeedErc20ToPoolOut", async () => {
      const amountOut = new BigNumber('1000000000000000000').toString(10); // 1 ether
      const slippage = new BigNumber('40000000000000000').toString(10); // 4%
      const result = await instance.calcNeedErc20ToPoolOut(_usdc, amountOut, slippage);

      console.log('Erc20 token out: ', divByDecimal(result));
    });

    
    it("getAmountOutForUniswap", async () => {
      const uniswapPairFor = await instance.uniswapPairFor(_usdc);
      const result = await instance.getAmountOutForUniswap(uniswapPairFor, '1000000000', true);
      console.log('Eth amount out: ', divByDecimal(result['amountOut']));
    });

    it("swapErc20ToLuna with twa", async () => {
      const twaOwner = "0x8f012CD662fc117dc21bCbf4A52b5052BF7a4D4E";
      const twa = new BigNumber('100000000000000000000').toString(10); // 1000 twa
      const slippage = new BigNumber('40000000000000000').toString(10); // 4%
      await TWAinstance.methods.approve(instance.address, twa).send({ from: twaOwner });
      const result = await instance.swapErc20ToLuna(_twa, twa, slippage, { from: twaOwner });

      const bptAmount = await BPTinstance.methods.balanceOf(twaOwner).call();
      console.log('bptAmount: ', divByDecimal(bptAmount));
    });

    it("swapErc20ToLuna with usdc", async () => {
      const usdc = new BigNumber('1000000').toString(10); // 1000 twa
      const slippage = new BigNumber('40000000000000000').toString(10); // 4%
      await USDCinstance.methods.approve(instance.address, usdc).send({ from: owner });
      const result = await instance.swapErc20ToLuna(_usdc, usdc, slippage, { from: owner });

      const bptAmount = await BPTinstance.methods.balanceOf(owner).call();
      console.log('bptAmount: ', divByDecimal(bptAmount));
    });
  });

  describe("swapLunaToEth", () => {
    it("calcSwapLunaToEthInputs", async () => {
      const amountIn = new BigNumber('10000000000000000000').toString(10); // 10 bpt
      const result = await instance.calcSwapLunaToEthInputs(amountIn, poolTokens);

      for (let i = 0; i < poolTokens.length; i++) {
        console.log('tokensOutLuna[' + poolTokenSymbols[i] +']: ', divByDecimal(result['tokensOutLuna'][i], poolTokenDecimals[i]));
      }
      for (let i = 0; i < poolTokens.length; i++) {
        console.log('ethOutUniswap[' + poolTokenSymbols[i] +']: ', divByDecimal(result['ethOutUniswap'][i]));
      }
      console.log('totalEthOut: ', divByDecimal(result['totalEthOut']));
    });

    it("swapLunaToEth", async () => {
      let bptAmount = new BigNumber(await BPTinstance.methods.balanceOf(owner).call());

      if (bptAmount.gt(new BigNumber('10000000000000000000')))
        bptAmount = new BigNumber('10000000000000000000');
      
      await BPTinstance.methods.approve(instance.address, bptAmount.toString(10)).send({ from: owner });
      const result = await instance.swapLunaToEth(bptAmount, { from: owner });

      const twaBalance = await TWAinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(twaBalance), bnToString(0));

      const linkBalance = await LINKinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(linkBalance), bnToString(0));

      const uniBalance = await UNIinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(uniBalance), bnToString(0));

      const renBTCBalance = await renBTCinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(renBTCBalance), bnToString(0));

      const wethBalance = await WETHinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(wethBalance), bnToString(0));

      const twalpBalance = await TWALPinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(twalpBalance), bnToString(0));

      console.log('result: ', result);
    });
  });

  describe("swapLunaToErc20", () => {
    it("calcSwapLunaToErc20Inputs", async () => {
      const amountIn = new BigNumber('10000000000000000000').toString(10); // 10 bpt
      const result = await instance.calcSwapLunaToErc20Inputs(_usdc, amountIn, poolTokens);

      for (let i = 0; i < poolTokens.length; i++) {
        console.log('tokensOutLuna[' + poolTokenSymbols[i] +']: ', divByDecimal(result['tokensOutLuna'][i], poolTokenDecimals[i]));
      }
      for (let i = 0; i < poolTokens.length; i++) {
        console.log('ethOutUniswap[' + poolTokenSymbols[i] +']: ', divByDecimal(result['ethOutUniswap'][i]));
      }
      console.log('totalErc20Out: ', divByDecimal(result['totalErc20Out'], 6));
    });

    it("getAmountOutForUniswap", async () => {
      const uniswapPairFor = await instance.uniswapPairFor(_twa);
      const result = await instance.getAmountOutForUniswap(uniswapPairFor, '100000000000000000000', true);
      console.log('Eth amount out: ', divByDecimal(result['amountOut']));
      console.log('isInverse: ', result['isInverse']);
    });
  
    it("swapLunaToErc20", async () => {
      let bptAmount = new BigNumber(await BPTinstance.methods.balanceOf(owner).call());

      if (bptAmount.gt(new BigNumber('10000000000000000000')))
        bptAmount = new BigNumber('10000000000000000000');

      await BPTinstance.methods.approve(instance.address, bptAmount.toString(10)).send({ from: owner });
      const result = await instance.swapLunaToErc20(_usdc, bptAmount.toString(10), { from: owner });
      // console.log('erc20Out: ', result);

      const twaBalance = await TWAinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(twaBalance), bnToString(0));

      const linkBalance = await LINKinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(linkBalance), bnToString(0));

      const uniBalance = await UNIinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(uniBalance), bnToString(0));

      const renBTCBalance = await renBTCinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(renBTCBalance), bnToString(0));

      const wethBalance = await WETHinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(wethBalance), bnToString(0));

      const twalpBalance = await TWALPinstance.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(twalpBalance), bnToString(0));

      // const result1 = await instance._swapTokenForWethOut(_twa, bnToString(twaBalance), { from: owner });
      // console.log('result1 :>> ', result1);

    });
  });
});
