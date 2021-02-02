var Adventure = artifacts.require("./Adventure.sol");
var LunaFund = artifacts.require("./LunaSwap.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Adventure);
  await deployer.deploy(LunaFund);
};
