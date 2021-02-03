const LunaSwap = artifacts.require("LunaSwap");
const BigNumber = require('bignumber.js');
const { divByDecimal, bnToString }  =  require("./utils");
const {
  poolTokenSymbol,
  ERC20TokenSymbol,
  swapAddress,
  BPTokensAddress,
  settings,
  contracts
}  =  require("./constants");

contract("LunaSwap", async (accounts) => {
  const deployer = accounts[0];

  const slippage = new BigNumber('40000000000000000').toString(10); // 4%
  const ethTestAmounts = [
    '100000000000000000',
    '1000000000000000000',
    '10000000000000000000'
  ]; // 0.1, 1, 10 ether
  const bpTestAmounts = [
    '100000000000000000',
    '1000000000000000000',
    '10000000000000000000',
    '100000000000000000000',
    '1000000000000000000000'
  ]; // 0.1, 1, 10, 100, 1000  bp
  const tokenTestAmounts = [0.1, 1, 10, 100, 1000 ]; // 0.1, 1, 10, 100, 1000 tokens
  
  beforeEach(async () => {
    instance = await LunaSwap.new({ from: deployer });
    await instance.setTokensSettings(settings.tokens, settings.tokenPairs, settings.reApproves, {
      from: deployer,
      value: 0,
    });
  });

  const checkOddBalances = async () => {
    // check the pool tokens balance
    for (let s = 0 ; s < poolTokenSymbol.length; s++) {
      const symbol = poolTokenSymbol[s];
      const oddAmount = await contracts[symbol].contract.methods.balanceOf(swapAddress).call();
      assert.equal(bnToString(oddAmount), bnToString(0));
    }
    // check the ERC20 token balance
    for (let s = 0 ; s < ERC20TokenSymbol.length; s++) {
      const symbol = ERC20TokenSymbol[s];
      const oddAmount = await contracts[symbol].contract.methods.balanceOf(swapAddress).call();
      assert.equal(bnToString(oddAmount), bnToString(0));
    }
  }

  describe("Settings", () => {
    it("Check token and pair settings", async () => {
      for (let i = 0; i < settings.tokens.length; i++) {
        const pairAddress = await instance.uniswapEthPairByTokenAddress(settings.tokens[i]);
        assert.equal(settings.tokenPairs[i].toLocaleLowerCase(), pairAddress.toLocaleLowerCase());
      }
    });
  });

  describe("swapEthToLuna", () => {
    it("calcSwapEthToLunaInputs", async () => {
      for (let a = 0 ; a < ethTestAmounts.length; a++) {
        const result = await instance.calcSwapEthToLunaInputs(ethTestAmounts[a], BPTokensAddress, slippage);
        for (let i = 0; i < poolTokenSymbol.length; i++) {
          console.log('tokensInLuna[' + poolTokenSymbol[i] +']: ', divByDecimal(result['tokensInLuna'][i], contracts[poolTokenSymbol[i]].decimals));
        }
        for (let i = 0; i < poolTokenSymbol.length; i++) {
          console.log('ethInUniswap[' + poolTokenSymbol[i] +']: ', divByDecimal(result['ethInUniswap'][i]));
        }
        console.log('poolOut: ', divByDecimal(result['poolOut']));
      }
    });

    it("calcNeedEthToPoolOut", async () => {
      for (let a = 0 ; a < bpTestAmounts.length; a++) {
        const result = await instance.calcNeedEthToPoolOut(bpTestAmounts[a], slippage);
        console.log('Eth out: ', divByDecimal(result));
      }
    });

    it("swapEthToLuna", async () => {
      for (let a = 0 ; a < ethTestAmounts.length; a++) {
        await instance.swapEthToLuna(slippage, { from: contracts['ETH'].owner, value: ethTestAmounts[a] });
        const bptAmount = await contracts['BP'].contract.methods.balanceOf(contracts['ETH'].owner).call();
        console.log('BPT Amount: ', divByDecimal(bptAmount));
        await checkOddBalances();
      }
    });
  });

  describe("swapErc20ToLuna", () => {
    it("calcSwapErc20ToLunaInputs", async () => {
      for (let s = 0; s < ERC20TokenSymbol.length; s++) {
        const symbol = ERC20TokenSymbol[s];
        const address = contracts[symbol].address;
        const decimals = contracts[symbol].decimals;
        for (let i = 0; i < tokenTestAmounts.length; i++) {
          const amount = new BigNumber(tokenTestAmounts[i]).times(new BigNumber(10).pow(decimals)).toString(10);
          const result = await instance.calcSwapErc20ToLunaInputs(address, amount, BPTokensAddress, slippage);
          for (let j = 0; j < poolTokenSymbol.length; j++) {
            console.log(symbol + ': tokensInLuna[' + poolTokenSymbol[j] +']: ', divByDecimal(result['tokensInLuna'][j], contracts[poolTokenSymbol[j]].decimals));
          }
          for (let k = 0; k < poolTokenSymbol.length; k++) {
            console.log(symbol + ': ethInUniswap[' + poolTokenSymbol[k] +']: ', divByDecimal(result['ethInUniswap'][k]));
          }
          console.log(symbol + ': poolOut: ', divByDecimal(result['poolOut']));
        }
      }
    });

    it("calcNeedErc20ToPoolOut", async () => {
      for (let s = 0; s < ERC20TokenSymbol.length; s++) {
        const symbol = ERC20TokenSymbol[s];
        const address = contracts[symbol].address;
        const decimals = contracts[symbol].decimals;
        for (let i = 0; i < bpTestAmounts.length; i++) {
          const result = await instance.calcNeedErc20ToPoolOut(address, bpTestAmounts[i], slippage);
          console.log(symbol + ': out: ', divByDecimal(result, decimals));
        }
      }
    });
    
    it("swapErc20ToLuna", async () => {
      for (let s = 0; s < ERC20TokenSymbol.length; s++) {
        const symbol = ERC20TokenSymbol[s];
        const address = contracts[symbol].address;
        const decimals = contracts[symbol].decimals;
        const tokenOwner = contracts[symbol].owner;
        const tokenInstance = contracts[symbol].contract;
        // sending 2 ether to token's owner for gas 
        await web3.eth.sendTransaction({ from: deployer, to: tokenOwner, value: '2000000000000000000' });
        if (symbol === 'DPI' || symbol === 'WBTC' || symbol === 'renBTC' || symbol === 'DEFI5' || symbol === 'CC10') {
          for (let i = 0; i < 2; i++) {
            const amount = new BigNumber(tokenTestAmounts[i]).times(new BigNumber(10).pow(decimals)).toString(10);
            await tokenInstance.methods.approve(instance.address, amount).send({ from: tokenOwner });
            await instance.swapErc20ToLuna(address, amount, slippage, { from: tokenOwner });
            const bptAmount = await contracts['BP'].contract.methods.balanceOf(tokenOwner).call();
            console.log('Swapped BPT amount for ' + symbol + ': ', divByDecimal(bptAmount));
            await checkOddBalances();
          }
        } else {
          for (let i = 0; i < tokenTestAmounts.length; i++) {
            const amount = new BigNumber(tokenTestAmounts[i]).times(new BigNumber(10).pow(decimals)).toString(10);
            await tokenInstance.methods.approve(instance.address, amount).send({ from: tokenOwner });
            await instance.swapErc20ToLuna(address, amount, slippage, { from: tokenOwner });
            const bptAmount = await contracts['BP'].contract.methods.balanceOf(tokenOwner).call();
            console.log('Swapped BPT amount for ' + symbol + ': ', divByDecimal(bptAmount));
            await checkOddBalances();
          }
        }
      }
    });
  });

  describe("swapLunaToEth", () => {
    it("calcSwapLunaToEthInputs", async () => {
      for (let i = 0; i < bpTestAmounts.length; i++) {
        const result = await instance.calcSwapLunaToEthInputs(bpTestAmounts[i], BPTokensAddress);
        for (let j = 0; j < poolTokenSymbol.length; j++) {
          console.log('tokensOutLuna[' + poolTokenSymbol[j] +']: ', divByDecimal(result['tokensOutLuna'][j], contracts[poolTokenSymbol[j]].decimals));
        }
        for (let k = 0; k < poolTokenSymbol.length; k++) {
          console.log('ethOutUniswap[' + poolTokenSymbol[k] +']: ', divByDecimal(result['ethOutUniswap'][k]));
        }
        console.log('totalEthOut: ', divByDecimal(result['totalEthOut']));
      }
    });

    it("swapLunaToEth", async () => {
      await instance.swapEthToLuna(slippage, { from: contracts['ETH'].owner, value: ethTestAmounts[1] }); // swap 1 ether to bpt
      const bptAmount = new BigNumber(await contracts['BP'].contract.methods.balanceOf(contracts['ETH'].owner).call());

      await contracts['BP'].contract.methods.approve(instance.address, bptAmount.toString(10)).send({ from: contracts['ETH'].owner });
      await instance.swapLunaToEth(bptAmount.toString(10), { from: contracts['ETH'].owner });
      await checkOddBalances();
    });
  });

  describe("swapLunaToErc20", () => {
    it("calcSwapLunaToErc20Inputs", async () => {
      for (let s = 0; s < ERC20TokenSymbol.length; s++) {
        const symbol = ERC20TokenSymbol[s];
        for (let i = 0; i < bpTestAmounts.length; i++) {
          const result = await instance.calcSwapLunaToErc20Inputs(contracts[symbol].address, bpTestAmounts[i], BPTokensAddress);
          for (let j = 0; j < poolTokenSymbol.length; j++) {
            console.log('tokensOutLuna[' + poolTokenSymbol[j] +']: ', divByDecimal(result['tokensOutLuna'][j], contracts[poolTokenSymbol[j]].decimals));
          }
          for (let k = 0; k < poolTokenSymbol.length; k++) {
            console.log('ethOutUniswap[' + poolTokenSymbol[k] +']: ', divByDecimal(result['ethOutUniswap'][k]));
          }
          console.log(symbol + ': totalErc20Out: ', divByDecimal(result['totalErc20Out'], contracts[symbol].decimals));
        }
      }
    });

    it("swapLunaToErc20", async () => {
      for (let s = 0; s < ERC20TokenSymbol.length; s++) {
        const symbol = ERC20TokenSymbol[s];

        await instance.swapEthToLuna(slippage, { from: contracts['ETH'].owner, value: ethTestAmounts[1] }); // swap 1 ether to bpt
        const bptAmount = new BigNumber(await contracts['BP'].contract.methods.balanceOf(contracts['ETH'].owner).call());

        await contracts['BP'].contract.methods.approve(instance.address, bptAmount.toString(10)).send({ from: contracts['ETH'].owner });
        await instance.swapLunaToErc20(contracts[symbol].address, bptAmount.toString(10), { from: contracts['ETH'].owner });

        await checkOddBalances();
      }
    });
  });
});
