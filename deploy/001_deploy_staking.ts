import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { BigNumber } from "ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const testToken: DeployResult = await deploy("TestToken", {
    from: deployer,
    log: true,
  });

  const governanceToken: DeployResult = await deploy("GovernanceToken", {
    from: deployer,
    log: true,
    args: [testToken.address],
  });
};
export default func;
func.tags = ["staking"];
