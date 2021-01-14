// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "hardhat/console.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

import "./Modifiers.sol";

/*
COMMANDMENTS:
1. thou shall not use selfdestruct or delegate call
2. thou shall not change the order/type of conract variables
3. thou shall not change the order of inharitence
4. thou shall not add new variables in parrent contracts
5. thou shall not initalize variables outside of the `initialize` function

note: public constant variables are fine to have an inital value
note: you can define dummy variables to "reserve" memory slots
*/

contract MyContract is Initializable, BaseRelayRecipient, Modifiers {

    mapping(address => uint) values;

    function initialize(address _forwarder) public initializer {
        trustedForwarder = _forwarder;
    }

    function setVal(uint _val) public {
        values[_msgSender()] = _val;
    }

    function getVal(address _addr) external view returns (uint _val) {
        return values[_addr];
    }

    function versionRecipient() external override view returns (string memory) {
        return "2.0.3";
    }
}
