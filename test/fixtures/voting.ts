import { ethers, upgrades } from "hardhat";

async function deploy() {
  const [deployer, user1, user2, user3] = await ethers.getSigners();

  const VotingFactory = await ethers.getContractFactory("Voting");
  const VotingContract = await upgrades.deployProxy(VotingFactory, [], {
    initializer: "initialize",
  });

  return { VotingContract, deployer, user1, user2, user3 };
}

export async function deployFixtures() {
  return deploy();
}
