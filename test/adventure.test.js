const Adventure = artifacts.require("Adventure");
const BN = web3.utils.BN;

const catchRevert = require("./exceptionsHelpers").catchRevert;

const increaseTime = function (seconds) {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [seconds],
        id: id,
      },
      (err1) => {
        if (err1) return reject(err1);

        web3.currentProvider.send(
          {
            jsonrpc: "2.0",
            method: "evm_mine",
            id: id + 1,
          },
          (err2, res) => {
            return err2 ? reject(err2) : resolve(res);
          }
        );
      }
    );
  });
};

contract("Adventure", async (accounts) => {
  const firstAccount = accounts[0];
  const secondAccount = accounts[1];

  let instance;

  beforeEach(async () => {
    instance = await Adventure.new();
  });

  describe("twaFoundation lock", () => {
    it("cannot transact when the contract is deployed, i.e. is locked", async () => {
      const preBalance = await instance.balanceOf(firstAccount);

      await catchRevert(
        instance.transfer(secondAccount, 1000, {
          from: firstAccount,
          value: 0,
        })
      );

      const postBalance = await instance.balanceOf(firstAccount);

      assert.equal(
        preBalance.toString(),
        postBalance.toString(),
        "The twaFoundation account should not be able to transact before 24 months"
      );
    });

    it("cannot transact after 12 months", async () => {
      await increaseTime(31557600);

      const preBalance = await instance.balanceOf(firstAccount);

      await catchRevert(
        instance.transfer(secondAccount, 1000, {
          from: firstAccount,
          value: 0,
        })
      );

      const postBalance = await instance.balanceOf(firstAccount);

      assert.equal(
        preBalance.toString(),
        postBalance.toString(),
        "The twaFoundation account should not be able to transact before 24 months"
      );
    });

    it("cannot transact after 16 months", async () => {
      await increaseTime(42076800);

      const preBalance = await instance.balanceOf(firstAccount);

      await catchRevert(
        instance.transfer(secondAccount, 1000, {
          from: firstAccount,
          value: 0,
        })
      );

      const postBalance = await instance.balanceOf(firstAccount);

      assert.equal(
        preBalance.toString(),
        postBalance.toString(),
        "The twaFoundation account should not be able to transact before 24 months"
      );
    });

    it("can transact after 24 months", async () => {
      await increaseTime(63141500);

      const preBalance = await instance.balanceOf(firstAccount);

      await instance.transfer(secondAccount, 1000, {
        from: firstAccount,
        value: 0,
      });

      const postBalance = await instance.balanceOf(firstAccount);

      assert(
        preBalance.sub(postBalance).gt(new BN(0)),
        "The twaFoundation account should be able to transact after 24 months"
      );
    });

    it("can transact after 30 months", async () => {
      await increaseTime(78894000);

      const preBalance = await instance.balanceOf(firstAccount);

      await instance.transfer(secondAccount, 1000, {
        from: firstAccount,
        value: 0,
      });

      const postBalance = await instance.balanceOf(firstAccount);

      assert(
        preBalance.sub(postBalance).gt(new BN(0)),
        "The twaFoundation account should be able to transact after 24 months"
      );
    });

    it("cannot transferFrom when the contract is deployed, i.e. is locked", async () => {
      await instance.increaseAllowance(secondAccount, 1000, {
        from: firstAccount,
        value: 0,
      });

      const preBalance = await instance.balanceOf(firstAccount);

      await catchRevert(
        instance.transferFrom(firstAccount, secondAccount, 1000, {
          from: firstAccount,
          value: 0,
        })
      );

      const postBalance = await instance.balanceOf(firstAccount);

      assert.equal(
        preBalance.toString(),
        postBalance.toString(),
        "The twaFoundation account should not be able to transact before 24 months"
      );
    });

    it("cannot transferFrom after 12 months", async () => {
      await instance.increaseAllowance(secondAccount, 1000, {
        from: firstAccount,
        value: 0,
      });

      await increaseTime(31557600);

      const preBalance = await instance.balanceOf(firstAccount);

      await catchRevert(
        instance.transferFrom(firstAccount, secondAccount, 1000, {
          from: secondAccount,
          value: 0,
        })
      );

      const postBalance = await instance.balanceOf(firstAccount);

      assert.equal(
        preBalance.toString(),
        postBalance.toString(),
        "The twaFoundation account should not be able to transact before 24 months"
      );
    });

    it("can transferFrom after 24 months", async () => {
      await instance.increaseAllowance(secondAccount, 1000, {
        from: firstAccount,
        value: 0,
      });

      await increaseTime(63141500);

      const preBalance = await instance.balanceOf(firstAccount);

      await instance.transferFrom(firstAccount, secondAccount, 1000, {
        from: secondAccount,
        value: 0,
      });

      const postBalance = await instance.balanceOf(firstAccount);

      assert(
        preBalance.sub(postBalance).gt(new BN(0)),
        "The twaFoundation account should be able to transact after 24 months"
      );
    });

    it("can transferFrom after 30 months", async () => {
      await instance.increaseAllowance(secondAccount, 1000, {
        from: firstAccount,
        value: 0,
      });

      await increaseTime(78894000);

      const preBalance = await instance.balanceOf(firstAccount);

      await instance.transferFrom(firstAccount, secondAccount, 1000, {
        from: secondAccount,
        value: 0,
      });

      const postBalance = await instance.balanceOf(firstAccount);

      assert(
        preBalance.sub(postBalance).gt(new BN(0)),
        "The twaFoundation account should be able to transact after 24 months"
      );
    });
  });
});
