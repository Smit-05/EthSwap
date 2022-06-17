pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap{

    string public name="EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100;
    
    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokenSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _tkn) public {
        token = _tkn;
    }
    
    function buyTokens() public payable {
        uint tokenAmount = msg.value * rate;  //1 ETH = 100 TOM

        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);

    }

    function sellTokens(uint _amount) public {

        require(token.balanceOf(msg.sender) >= _amount);

        uint etherAmount = _amount / rate;
        
        require(token.balanceOf(address(this)) >= etherAmount);
        
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        emit TokenSold(msg.sender, address(token), _amount, rate);
    }
}