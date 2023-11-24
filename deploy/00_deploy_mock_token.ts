import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('ERC20', {
    contract: 'MockERC20',
    from: deployer,
    log: true,
    args: ["Mock Token", "MCKT"], // hardcoded upper bound value can be fetched from env
    skipIfAlreadyDeployed: true,
  });
};
export default func;
func.tags = ['ERC20', 'ERC20_deploy'];
