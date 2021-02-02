var Adventure = artifacts.require("./Adventure.sol");
var LunaFund = artifacts.require("./LunaSwap.sol");

module.exports = function (deployer) {
  // await deployer.deploy(Adventure);
  deployer.deploy(LunaFund);
};
