import { ethers, deployments, getNamedAccounts } from "hardhat";
import { expect } from "./chai-setup";
import { TestToken, GovernanceToken } from "../typechain";
import { Signer } from "ethers";

describe("Staking Tests", () => {
  let deployer: Signer;
  let testToken: TestToken;
  let governanceToken: GovernanceToken;
  beforeEach("Deploy and initialize", async () => {
    [deployer] = await ethers.getSigners();
    await deployments.fixture("staking");
    testToken = await ethers.getContract("TestToken", deployer);
    governanceToken = await ethers.getContract("GovernanceToken", deployer);
  });

  describe("unit tests", () => {
    const initialBalance = ethers.utils.parseEther("1000000");
    it("initial balance is one million", async () => {
      const tokenBal = await testToken.balanceOf(await deployer.getAddress());
      expect(tokenBal).to.eq(initialBalance);
    });
    it("no staked balance", async () => {
      const stakedBal = await governanceToken.balanceOf(
        await deployer.getAddress()
      );
      expect(stakedBal.isZero()).to.be.true;
    });
    it("stakes successfully", async () => {
      await testToken.approve(
        governanceToken.address,
        ethers.constants.MaxUint256
      );
      await governanceToken.stake(initialBalance);
      const stakedBal = await governanceToken.balanceOf(
        await deployer.getAddress()
      );
      const tokenBal = await testToken.balanceOf(await deployer.getAddress());
      const contractBal = await testToken.balanceOf(governanceToken.address);
      expect(stakedBal).to.eq(initialBalance);
      expect(contractBal).to.eq(initialBalance);
      expect(tokenBal.isZero()).to.be.true;
    });
    it("un-stakes successfully", async () => {
      await testToken.approve(
        governanceToken.address,
        ethers.constants.MaxUint256
      );
      await governanceToken.stake(initialBalance);
      await governanceToken.approve(
        governanceToken.address,
        ethers.constants.MaxUint256
      );
      await governanceToken.unstake(initialBalance);
      const stakedBal = await governanceToken.balanceOf(
        await deployer.getAddress()
      );
      const tokenBal = await testToken.balanceOf(await deployer.getAddress());
      const contractBal = await testToken.balanceOf(governanceToken.address);
      expect(stakedBal.isZero()).to.be.true;
      expect(contractBal.isZero()).to.be.true;
      expect(tokenBal).to.eq(initialBalance);
    });
  });
});
