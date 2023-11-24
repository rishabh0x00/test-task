import { expect } from 'chai';
import { deployFixtures } from './fixtures/voting';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { Contract, Signer } from 'ethers';

describe ('Voting.sol', function () {
  let VotingContract: Contract, user1: Signer, user2: Signer, user3: Signer;

  beforeEach (async function () {
    ({ VotingContract, user1, user2, user3 } = await loadFixture(
      deployFixtures
    ));
  });

  it ('should be able to propose new item for voting', async function () {
    await expect(VotingContract.connect(user1).proposeItem('proposal_0'))
      .to.emit(VotingContract, 'ProposalCreated')
      .withArgs(await user1.getAddress(), 'proposal_0');
  });

  it ('should not be able to propose already existing item', async function () {
    await VotingContract.connect(user1).proposeItem('proposal_0');

    await expect(
      VotingContract.connect(user1).proposeItem('proposal_0')
    ).to.be.revertedWith('Proposal Already Exists');
  });

  it ('should not be able to vote for invalid proposal', async function () {
    await expect(
      VotingContract.connect(user1).voteForItem(0)
    ).to.be.revertedWith('Invalid ProposalId');
  });

  it ('should be able to vote for proposed item', async function () {
    await VotingContract.connect(user1).proposeItem('proposal_0');

    const initialVotes = await VotingContract.proposalToVotes(0);
    expect(initialVotes).to.equal(0);

    await VotingContract.voteForItem(0);
    const currentVotes = await VotingContract.proposalToVotes(0);
    expect(currentVotes).to.equal(1);
  });

  it ('should emit Voted event', async function () {
    await VotingContract.connect(user1).proposeItem('proposal_0');
    await expect(VotingContract.connect(user1).voteForItem(0))
      .to.emit(VotingContract, 'Voted')
      .withArgs(await user1.getAddress(), 0);
  });

  it ('should not be able to vote for already voted item', async function () {
    await VotingContract.connect(user1).proposeItem('proposal_0');
    await VotingContract.connect(user1).voteForItem(0);

    expect(await VotingContract.proposalToVotes(0)).to.equal(1);
    await expect(
      VotingContract.connect(user1).voteForItem(0)
    ).to.be.revertedWith('Already Voted');
  });

  it ('should return the correct winner after voting', async function () {
    await VotingContract.connect(user1).proposeItem('Proposal_0');
    await VotingContract.connect(user2).proposeItem('Proposal_1');

    // vote for Proposal_0
    await VotingContract.connect(user1).voteForItem(0);

    // vote for Proposal_1
    await VotingContract.connect(user2).voteForItem(1);
    await VotingContract.connect(user3).voteForItem(1);

    // Get the winner
    const winner = await VotingContract.getWinner();

    // Check the winner's details
    expect(winner.id).to.equal(1);
    expect(winner.proposal).to.equal('Proposal_1');
  });
});
