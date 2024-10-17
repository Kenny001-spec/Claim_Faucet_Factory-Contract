import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Faucet Test", function () {
    //Reusable async method for deployment
    async function deployFaucetFixure() {
      //Contracts are deployed using the first signer/account by default
  
      const [owner, addr1] = await hre.ethers.getSigners();

      const Faucet = await hre.ethers.getContractFactory("Faucet");
      const faucet = await Faucet.deploy();

      const withdrawalAmount = ethers.parseEther("0.2");
      
  
      return { faucet, owner, withdrawalAmount, addr1 };
    }
})