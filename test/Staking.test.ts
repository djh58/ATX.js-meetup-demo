import { ethers, deployments, getNamedAccounts } from "hardhat";
import { expect } from "./chai-setup";
import { Signer } from "ethers";
import { Test, StakingToken } from "../typechain";

describe("Staking Tests", () => {
  let deployer: Signer;
  let testToken: Test;
  let stakeToken: StakingToken;
  beforeEach("Deploy and initialize", async () => {
    [deployer] = await ethers.getSigners();
    await deployments.fixture("staking");
    testToken = await ethers.getContract("Test", deployer);
    stakeToken = await ethers.getContract("StakingToken", deployer);
  });

  describe("unit tests", () => {
    const stakeAmount = ethers.utils.parseEther("1");
    it("stakes successfully", async () => {
      await testToken.approve(stakeToken.address, ethers.constants.MaxUint256);
      await stakeToken.stake(stakeAmount);
      const stakeBalance = await stakeToken.balanceOf(
        await deployer.getAddress()
      );
      const tokenBalance = await testToken.balanceOf(
        await deployer.getAddress()
      );
      const contractBal = await testToken.balanceOf(stakeToken.address);
      expect(stakeBalance).to.eq(stakeAmount);
      expect(tokenBalance.isZero()).to.be.true;
      expect(contractBal).to.eq(stakeAmount);
    });
  });
});
