//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "@opengsn/gsn/contracts/BasePaymaster.sol";

// accept everything.
// this paymaster accepts any request.
//
// NOTE: Do NOT use this contract on a mainnet: it accepts anything, so anyone can "grief" it and drain its account

contract Paymaster is BasePaymaster {
    address public ourTarget;
    event TargetSet(address target);

    function setTarget(address target) external onlyOwner {
        ourTarget = target;
        emit TargetSet(target);
    }

    event PreRelayed(uint);
	event PostRelayed(uint);

    function preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData,
        uint256 maxPossibleGas
    )
    external
    override
    virtual
    returns (bytes memory context, bool revertOnRecipientRevert) {
        _verifyForwarder(relayRequest);
        (signature, approvalData, maxPossibleGas);

        require(relayRequest.request.to == ourTarget);
        emit PreRelayed(now);
        return (abi.encode(now), false);
    }

    function postRelayedCall(
        bytes calldata context,
        bool success,
        uint256 gasUseWithoutPost,
        GsnTypes.RelayData calldata relayData
    ) external override virtual {
        (context, success, gasUseWithoutPost, relayData);
        emit PostRelayed(abi.decode(context, (uint)));
    }

    function versionPaymaster() external view override virtual returns (string memory){
        return "2.0.3";
    }
}