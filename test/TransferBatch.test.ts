import { expect } from 'chai';
import { deployFixtures } from './fixtures/transferBatch';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { Contract, Signer } from 'ethers';

describe ('TransferBatch.sol', function () {
  let TransferBatch: Contract,
    ERC20Contract: Contract,
    deployer: Signer,
    user1: Signer,
    user2: Signer,
    user3: Signer;

  beforeEach (async function () {
    ({ TransferBatch, ERC20Contract, deployer, user1, user2, user3 } =
      await loadFixture(deployFixtures));
    await ERC20Contract.connect(deployer).mint(
      await TransferBatch.getAddress(),
      300
    );
  });

  it ('should revert on exceeding upper bound', async function () {
    const toAddresses = [
      await user1.getAddress(),
      await user2.getAddress(),
      await user3.getAddress(),
    ];
    // amounts size greater than upperbound
    const amounts = [50, 100, 150, 200];

    await expect(
      TransferBatch.transferBatch(toAddresses, amounts)
    ).to.be.revertedWith('Invalid Input');
  });

  it ('should revert for mismatched address and amount arrays', async function () {
    // mismatched array size
    const toAddresses = [await user1.getAddress(), await user2.getAddress()];
    const amounts = [50, 100, 150];

    await expect(
      TransferBatch.transferBatch(toAddresses, amounts)
    ).to.be.revertedWith('Invalid Input');
  });

  it ('should TransferBatch', async function () {
    // balance before batch transfer
    expect(
      await ERC20Contract.balanceOf(await TransferBatch.getAddress())
    ).to.be.equals(300);
    expect(
      await ERC20Contract.balanceOf(await user1.getAddress())
    ).to.be.equals(0);
    expect(
      await ERC20Contract.balanceOf(await user2.getAddress())
    ).to.be.equals(0);
    expect(
      await ERC20Contract.balanceOf(await user3.getAddress())
    ).to.be.equals(0);

    const toAddresses = [
      await user1.getAddress(),
      await user2.getAddress(),
      await user3.getAddress(),
    ];
    const amounts = [50, 100, 150];

    await TransferBatch.transferBatch(toAddresses, amounts);

    // balance after batch transfer
    expect(
      await ERC20Contract.balanceOf(await TransferBatch.getAddress())
    ).to.be.equals(0); // 300 - (50 + 100 + 150)
    expect(
      await ERC20Contract.balanceOf(await user1.getAddress())
    ).to.be.equals(50);
    expect(
      await ERC20Contract.balanceOf(await user2.getAddress())
    ).to.be.equals(100);
    expect(
      await ERC20Contract.balanceOf(await user3.getAddress())
    ).to.be.equals(150);
  });
});
