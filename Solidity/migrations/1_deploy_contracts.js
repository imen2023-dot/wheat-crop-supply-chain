const Website = artifacts.require("Website"); // Replace "YourContract" with the name of your contract

module.exports = function(deployer) {
  deployer.deploy(Website); // Deploy YourContract
};