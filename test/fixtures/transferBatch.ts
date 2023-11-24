import { ethers } from "hardhat";

async function deploy() {
  const [deployer, user1, user2, user3] = await ethers.getSigners();

  const ERC20ContractFactory = await ethers.getContractFactory("MockERC20");
  const ERC20Contract = await ERC20ContractFactory.deploy(
    "ERC20Token",
    "ERC20T"
  );
  await ERC20Contract.waitForDeployment();

  const TransferBatchFactory = await ethers.getContractFactory("TransferBatch");
  const TransferBatch = await TransferBatchFactory.deploy(
    await ERC20Contract.getAddress(),
    3
  );
  await TransferBatch.waitForDeployment();

  return { TransferBatch, ERC20Contract, deployer, user1, user2, user3 };
}

export async function deployFixtures() {
  return deploy();
}
