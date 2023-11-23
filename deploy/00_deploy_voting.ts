import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('Voting', {
    from: deployer,
    contract: 'Voting',
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        methodName: 'initialize',
      },
      upgradeIndex: 0,
    },
    log: true,
  });
};

export default func;
func.tags = ['Voting', 'Voting_deploy'];
