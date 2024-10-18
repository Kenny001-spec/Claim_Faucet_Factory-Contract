import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("ClaimFaucetFactory Test", function () {

  async function deployClaimFaucetFactoryFixture() {
    const [deployer, addr1, addr2] = await hre.ethers.getSigners();

    const ClaimFaucetFactory = await hre.ethers.getContractFactory(
      "ClaimFaucetFactory"
    );
    const claimFaucetFactory = await ClaimFaucetFactory.deploy();

    return { claimFaucetFactory, deployer, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should deploy the factory contract", async function () {
      const { claimFaucetFactory } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );
      expect(await claimFaucetFactory.getLengthOfDeployedContract()).to.equal(0);
    });
  });

  it("Should deploy ClaimFaucet and store the contract info", async function () {
    const { claimFaucetFactory, deployer } = await loadFixture(
      deployClaimFaucetFactoryFixture
    );
    const _name = "VLtToken";
    const _symbol = "VLT";

    const tx = await claimFaucetFactory.deployClaimFaucet(_name, _symbol);
    await tx.wait();

    const _index = 0;

    const [deployerAddress, deployedContractAddress] =
      await claimFaucetFactory.getUserDeployedContractByIndex(_index);

    const allContracts = await claimFaucetFactory.getAllContractDeployed();

    expect(allContracts.length).to.equal(1);
    expect(allContracts[_index].deployer).to.equal(deployer.address);
    expect(allContracts[_index].deployedContract).to.equal(
      deployedContractAddress
    );
  });

  describe("getAllContractDeployed", function () {
    it("Should return all deployed contracts", async function () {
      const { claimFaucetFactory, addr1, addr2 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );
      
      await claimFaucetFactory
        .connect(addr1)
        .deployClaimFaucet("DLT Token", "DLT");
      await claimFaucetFactory
        .connect(addr2)
        .deployClaimFaucet("ValoraToken", "VLT");

      const allContracts = await claimFaucetFactory.getAllContractDeployed();

      expect(allContracts.length).to.equal(2);
      expect(allContracts[0].deployer).to.equal(addr1.address);
      expect(allContracts[1].deployer).to.equal(addr2.address);
    });

    it("Should not allow zero address to call", async function () {
      const { claimFaucetFactory } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );
  
      await expect(claimFaucetFactory.getAllContractDeployed()).to.not.be.revertedWith(
        "Zero not allowed"
      );
    });
  }); 

  describe("getUserDeployedContracts", function () {
    it("Should return user's deployed contracts", async function () {
      const { claimFaucetFactory, addr1 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await claimFaucetFactory.connect(addr1).deployClaimFaucet("DLTToken", "DLT");
      await claimFaucetFactory.connect(addr1).deployClaimFaucet("ValoraToken", "VLT");

      const userContracts = await claimFaucetFactory.connect(addr1).getUserDeployedContract();
      expect(userContracts.length).to.equal(2);
      expect(userContracts[0].deployer).to.equal(addr1.address);
      expect(userContracts[1].deployer).to.equal(addr1.address);
    });

    describe("getUserDeployedContractsByIndex", function () {
      it("Should return correct contract info by index", async function () {
        const { claimFaucetFactory, addr1 } = await loadFixture(
          deployClaimFaucetFactoryFixture
        );
  
        await claimFaucetFactory.connect(addr1).deployClaimFaucet("DLTToken", "DLT");
        await claimFaucetFactory.connect(addr1).deployClaimFaucet("ValoraToken", "VLT");
  
        const [deployer] = await claimFaucetFactory
          .connect(addr1)
          .getUserDeployedContractByIndex(1);
        expect(deployer).to.equal(addr1.address);
      });
    });
  });
});
