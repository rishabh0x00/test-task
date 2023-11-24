// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';

/**
 * @title Voting contract
 * @author Rishabh Sharma
 * @notice Voting contract developed as a test task 
 */
contract Voting is OwnableUpgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;

    /// @dev enum to keep track of proposal status.
    ///      The use case can be extended by adding more statuses like EXECUTED, CANCELLED, etc
    enum ProposalStatus {
        DEFAULT,
        ADDED
    }

    struct Winner {
        uint256 id;
        string proposal;
    }

    /// @dev simultaneously tracking highest voted proposal
    /// @notice there can be a tie for top votes, we are ignoring the scenario,
    ///         since only one winner is exptected in the task,
    ///         or else we could have made this variable an array of ids
    Winner private _currentWinner;

    /// @dev variable to store set of users who have already voted
    EnumerableSet.AddressSet private _voters;

    /// @dev variable to store the list proposals;
    string[] public proposals;

    /// @dev variable to check the current status of proposal;
    mapping(bytes => ProposalStatus) private _proposalStatus;

    /// @dev variable to store proposal ids and their corresponding votes;
    mapping(uint256 => uint256) public proposalToVotes;

    /// @dev emitted when a new proposal is added
    event ProposalCreated(address indexed _creator, string _item);
    /// @dev emitted when a new vote is cast
    event Voted(address indexed _voter, uint256 indexed _itemId);

    function initialize() external initializer {
        __Ownable_init(_msgSender());
    }

    /**
     * @dev create a new proposal if did not exist already
     * @param _item value of the new proposal
     * @return _id of the new proposal
    */
    function proposeItem(string memory _item) external returns (uint256 _id) {
        bytes memory hash = abi.encodePacked(_item);
        if (_proposalStatus[hash] == ProposalStatus.DEFAULT) {
            _proposalStatus[hash] = ProposalStatus.ADDED;
            _id = proposals.length;
            proposals.push(_item);
            emit ProposalCreated(_msgSender(), _item);
        } else {
            revert('Proposal Already Exists');
        }
    }

    /**
     * @dev adds one vote for a proposal and records the user who voted
     * @param _itemId id of the proposal 
    */
    function voteForItem(uint256 _itemId) external {
        if (proposals.length == 0 || _itemId > proposals.length - 1){
            revert('Invalid ProposalId');
        }
        if (_voters.contains(_msgSender())) {
            revert('Already Voted');
        }
        _voters.add(_msgSender());
        proposalToVotes[_itemId]++;
        _checkAndUpdateTopVoted(_itemId);
        emit Voted(_msgSender(), _itemId);
    }

    /**
     * @dev updates the winner if any other proposal has matched the previous winner
     * @return a struct value containing proposal and its id which has the highest vote
    */
    function getWinner() external view returns(Winner memory) {
        return _currentWinner;
    }

    /**
     * @dev updates the winner if any other proposal has matched the previous winner
     * @param _itemId id of the proposal
    */
    function _checkAndUpdateTopVoted(uint256 _itemId) private {
        /// Since we are returning only one winner, we are make latest proposal as winner in case of equal votes 
        if(proposalToVotes[_itemId] >= proposalToVotes[_currentWinner.id]) {
            _currentWinner = Winner({
                id: _itemId,
                proposal: proposals[_itemId]
            });
        }
    }
}