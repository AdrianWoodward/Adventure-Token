const UniverseSwap = artifacts.require("UniverseSwap");
const BigNumber = require('bignumber.js');
const { divByDecimal, bnToString }  =  require("./utils");
const {
  SPPoolTokenSymbol,
  ERC20TokenSymbol,
  universeFundPoolTokens,
  settings,
  contracts
}  =  require("./constants");

contract("UniverseSwap", async (accounts) => {
  const deployer = accounts[0];
  let instance;

  const slippage = new BigNumber('40000000000000000').toString(10); // 4%
  const ethTestAmounts = [
    '100000000000000000',
    '1000000000000000000',
    '10000000000000000000'
  ]; // 0.1, 1, 10 ether
  const spTestAmounts = [
    '100000000000000000',
    '1000000000000000000',
    '10000000000000000000',
    '100000000000000000000',
    '1000000000000000000000'
  ]; // 0.1, 1, 10, 100, 1000  bp
  const tokenTestAmounts = [0.1, 1, 10, 100, 1000]; // 0.1, 1, 10, 100, 1000 tokens
  
  beforeEach(async () => {
    instance = await UniverseSwap.new({ from: deployer });
    await instance.setTokensSettings(settings.tokens, settings.tokenPairs, settings.reApproves, {
      from: deployer,
      value: 0,
    });
  });

  const checkOddBalances = async () => {
    // check the pool tokens balance
    for (let s = 0 ; s < SPPoolTokenSymbol.length; s++) {
      const symbol = SPPoolTokenSymbol[s];
      const oddAmount = await contracts[symbol].contract.methods.balanceOf(instance.address).call();
      assert.equal(bnToString(oddAmount), bnToString(0));
    }
    // check the ERC20 token balance
    for (let s = 0 ; s < ERC20TokenSymbol.length; s++) {
      const symbol = ERC20TokenSymbol[s];
      const oddAmount = await contracts[symbol].contract.methods.balanceOf(instance.address).call();
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

  describe("swapEthToUniverse", () => {
    // it("calcSwapEthToUniverseInputs", async () => {
    //   for (let a = 0 ; a < ethTestAmounts.length; a++) {
    //     const result = await instance.calcSwapEthToUniverseInputs(ethTestAmounts[a], universeFundPoolTokens, slippage);
    //     for (let i = 0; i < SPPoolTokenSymbol.length; i++) {
    //       console.log('tokensInUniverse[' + SPPoolTokenSymbol[i] +']: ', divByDecimal(result['tokensInUniverse'][i], contracts[SPPoolTokenSymbol[i]].decimals));
    //     }
    //     for (let i = 0; i < SPPoolTokenSymbol.length; i++) {
    //       console.log('ethInUniswap[' + SPPoolTokenSymbol[i] +']: ', divByDecimal(result['ethInUniswap'][i]));
    //     }
    //     console.log('poolOut: ', divByDecimal(result['poolOut']));
    //   }
    // });

    // it("calcNeedEthToPoolOut", async () => {
    //   for (let a = 0 ; a < spTestAmounts.length; a++) {
    //     const result = await instance.calcNeedEthToPoolOut(spTestAmounts[a], slippage);
    //     console.log('Eth out: ', divByDecimal(result));
    //   }
    // });

    // it("swapEthToUniverse", async () => {
    //   for (let a = 0 ; a < ethTestAmounts.length; a++) {
    //     await instance.swapEthToUniverse(slippage, { from: contracts['ETH'].owner, value: ethTestAmounts[a] });
    //     const sptAmount = await contracts['SP'].contract.methods.balanceOf(contracts['ETH'].owner).call();
    //     const spcAmount = await contracts['SPController'].contract.methods.balanceOf(contracts['ETH'].owner).call();
    //     // for (let i = 0 ; i < 8; i++) {
    //     //   const tokenAmount = await contracts[SPPoolTokenSymbol[i]].contract.methods.balanceOf(instance.address).call();
    //     //   console.log(SPPoolTokenSymbol[i] + ': tokenAmount >> ', divByDecimal(tokenAmount));
    //     // }
    //     console.log('SPC Amount: ', divByDecimal(spcAmount));
    //     await checkOddBalances();
    //   }
    // });
  });

  describe("swapErc20ToUniverse", () => {
    // it("calcSwapErc20ToUniverseInputs", async () => {
    //   for (let s = 0; s < ERC20TokenSymbol.length; s++) {
    //     const symbol = ERC20TokenSymbol[s];
    //     const address = contracts[symbol].address;
    //     const decimals = contracts[symbol].decimals;
    //     for (let i = 0; i < tokenTestAmounts.length; i++) {
    //       const amount = new BigNumber(tokenTestAmounts[i]).times(new BigNumber(10).pow(decimals)).toString(10);
    //       const result = await instance.calcSwapErc20ToUniverseInputs(address, amount, universeFundPoolTokens, slippage);
    //       for (let j = 0; j < SPPoolTokenSymbol.length; j++) {
    //         console.log(symbol + ': tokensInUniverse[' + SPPoolTokenSymbol[j] +']: ', divByDecimal(result['tokensInUniverse'][j], contracts[SPPoolTokenSymbol[j]].decimals));
    //       }
    //       for (let k = 0; k < SPPoolTokenSymbol.length; k++) {
    //         console.log(symbol + ': ethInUniswap[' + SPPoolTokenSymbol[k] +']: ', divByDecimal(result['ethInUniswap'][k]));
    //       }
    //       console.log(symbol + ': poolOut: ', divByDecimal(result['poolOut']));
    //     }
    //   }
    // });

    // it("calcNeedErc20ToPoolOut", async () => {
    //   for (let s = 0; s < ERC20TokenSymbol.length; s++) {
    //     const symbol = ERC20TokenSymbol[s];
    //     const address = contracts[symbol].address;
    //     const decimals = contracts[symbol].decimals;
    //     for (let i = 0; i < spTestAmounts.length; i++) {
    //       const result = await instance.calcNeedErc20ToPoolOut(address, spTestAmounts[i], slippage);
    //       console.log(symbol + ': out: ', divByDecimal(result, decimals));
    //     }
    //   }
    // });
    
    // it("swapErc20ToUniverse", async () => {
    //   for (let s = 0; s < ERC20TokenSymbol.length; s++) {
    //     const symbol = ERC20TokenSymbol[s];
    //     const address = contracts[symbol].address;
    //     const decimals = contracts[symbol].decimals;
    //     const tokenOwner = contracts[symbol].owner;
    //     const tokenInstance = contracts[symbol].contract;
    //     // sending 2 ether to token's owner for gas 
    //     await web3.eth.sendTransaction({ from: deployer, to: tokenOwner, value: '2000000000000000000' });
    //     if (symbol === 'DPI' || symbol === 'WBTC' || symbol === 'DEFI5' || symbol === 'CC10') {
    //       for (let i = 0; i < 2; i++) {
    //         const amount = new BigNumber(tokenTestAmounts[i]).times(new BigNumber(10).pow(decimals)).toString(10);
    //         await tokenInstance.methods.approve(instance.address, amount).send({ from: tokenOwner });
    //         const sptAmountBefore = await contracts['SPController'].contract.methods.balanceOf(tokenOwner).call();
    //         await instance.swapErc20ToUniverse(address, amount, slippage, { from: tokenOwner });
    //         const sptAmountAfter = await contracts['SPController'].contract.methods.balanceOf(tokenOwner).call();
    //         console.log('Swapped SPT amount for ' + symbol + ': ', divByDecimal(sptAmountAfter - sptAmountBefore));
    //         await checkOddBalances();
    //       }
    //     } else {
    //       for (let i = 0; i < tokenTestAmounts.length; i++) {
    //         const amount = new BigNumber(tokenTestAmounts[i]).times(new BigNumber(10).pow(decimals)).toString(10);
    //         await tokenInstance.methods.approve(instance.address, amount).send({ from: tokenOwner });
    //         const sptAmountBefore = await contracts['SPController'].contract.methods.balanceOf(tokenOwner).call();
    //         await instance.swapErc20ToUniverse(address, amount, slippage, { from: tokenOwner });
    //         const sptAmountAfter = await contracts['SPController'].contract.methods.balanceOf(tokenOwner).call();
    //         console.log('Swapped SPT amount for ' + symbol + ': ', divByDecimal(sptAmountAfter - sptAmountBefore));
    //         await checkOddBalances();
    //       }
    //     }
    //   }
    // });
  });

  describe("swapUniverseToEth", () => {
    // it("calcSwapUniverseToEthInputs", async () => {
    //   for (let i = 0; i < spTestAmounts.length; i++) {
    //     const result = await instance.calcSwapUniverseToEthInputs(spTestAmounts[i], universeFundPoolTokens);
    //     for (let j = 0; j < SPPoolTokenSymbol.length; j++) {
    //       console.log('tokensOutUniverse[' + SPPoolTokenSymbol[j] +']: ', divByDecimal(result['tokensOutUniverse'][j], contracts[SPPoolTokenSymbol[j]].decimals));
    //     }
    //     for (let k = 0; k < SPPoolTokenSymbol.length; k++) {
    //       console.log('ethOutUniswap[' + SPPoolTokenSymbol[k] +']: ', divByDecimal(result['ethOutUniswap'][k]));
    //     }
    //     console.log('totalEthOut: ', divByDecimal(result['totalEthOut']));
    //   }
    // });

    // it("swapUniverseToEth", async () => {
    //   const owner = contracts['ETH'].owner;
    //   const sptAmountBefore = new BigNumber(await contracts['SPController'].contract.methods.balanceOf(owner).call());
    //   await instance.swapEthToUniverse(slippage, { from: owner, value: ethTestAmounts[1] }); // swap 1 ether to bpt
    //   const sptAmountAfter = new BigNumber(await contracts['SPController'].contract.methods.balanceOf(owner).call());
    //   const sptAmount = sptAmountAfter.minus(sptAmountBefore).toString(10);
    //   console.log('sptAmount: ', divByDecimal(sptAmount));
    //   await contracts['SPController'].contract.methods.approve(instance.address, sptAmount.toString(10)).send({ from: owner });
    //   await instance.swapUniverseToEth(sptAmount.toString(10), { from: owner });
    //   await checkOddBalances();
    // });
  });

  describe("swapUniverseToErc20", () => {
    it("calcSwapUniverseToErc20Inputs", async () => {
      for (let s = 0; s < ERC20TokenSymbol.length; s++) {
        const symbol = ERC20TokenSymbol[s];
        for (let i = 0; i < spTestAmounts.length; i++) {
          const result = await instance.calcSwapUniverseToErc20Inputs(contracts[symbol].address, spTestAmounts[i], universeFundPoolTokens);
          for (let j = 0; j < SPPoolTokenSymbol.length; j++) {
            console.log('tokensOutUniverse[' + SPPoolTokenSymbol[j] +']: ', divByDecimal(result['tokensOutUniverse'][j], contracts[SPPoolTokenSymbol[j]].decimals));
          }
          for (let k = 0; k < SPPoolTokenSymbol.length; k++) {
            console.log('ethOutUniswap[' + SPPoolTokenSymbol[k] +']: ', divByDecimal(result['ethOutUniswap'][k]));
          }
          console.log(symbol + ': totalErc20Out: ', divByDecimal(result['totalErc20Out'], contracts[symbol].decimals));
        }
      }
    });

    it("swapUniverseToErc20", async () => {
      for (let s = 0; s < ERC20TokenSymbol.length; s++) {
        const symbol = ERC20TokenSymbol[s];

        await instance.swapEthToUniverse(slippage, { from: contracts['ETH'].owner, value: ethTestAmounts[1] }); // swap 1 ether to bpt
        const sptAmount = new BigNumber(await contracts['SPController'].contract.methods.balanceOf(contracts['ETH'].owner).call());

        await contracts['SPController'].contract.methods.approve(instance.address, sptAmount.toString(10)).send({ from: contracts['ETH'].owner });
        await instance.swapUniverseToErc20(contracts[symbol].address, sptAmount.toString(10), { from: contracts['ETH'].owner });

        await checkOddBalances();
      }
    });
  });
});
