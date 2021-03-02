var Adventure = artifacts.require("./Adventure.sol");
var LunaSwap = artifacts.require("./LunaSwap.sol");
var UniverseSwap = artifacts.require("./UniverseSwap.sol");
var YieldFarm = artifacts.require("./YieldFarm.sol");

module.exports = function (deployer) {
  // deployer.deploy(Adventure);
  // deployer.deploy(LunaSwap);
  deployer.deploy(UniverseSwap);
  // deployer.deploy(YieldFarm);
};
