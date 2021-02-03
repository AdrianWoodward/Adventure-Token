var Adventure = artifacts.require("./Adventure.sol");
var LunaSwap = artifacts.require("./LunaSwap.sol");

module.exports = function (deployer) {
  deployer.deploy(Adventure);
  deployer.deploy(LunaSwap);
};
