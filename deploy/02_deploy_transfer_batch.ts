import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const token = await deployments.get('ERC20');

  await deploy('TransferBatch', {
    from: deployer,
    log: true,
    args: [token.address, 50], // hardcoded upper bound value can be fetched from env
    skipIfAlreadyDeployed: true,
  });
};
export default func;

func.tags = ['TransferBatch', 'TransferBatch_deploy'];
func.dependencies = ['ERC20_deploy'];
