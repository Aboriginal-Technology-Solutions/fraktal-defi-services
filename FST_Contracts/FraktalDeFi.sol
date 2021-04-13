pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract FraktalDeFi {
  struct Network {
    string name;
    uint id;
  }
  struct ExchangeComponent {
    string name;
    address _address;

  }

  struct Exchange {
    string name;
    // ExchangeComponent[] components;
    string[] tags;
    Network network;
  }

  uint exchangeLength;

  mapping(string => ExchangeComponent[]) exchangeComponents;
  mapping(uint => Exchange) exchanges;
  address public owner;
  address private creator;

  constructor () public {
    exchangeLength = 0;
    owner = msg.sender;
    creator = msg.sender;
  }
  receive () external payable {}
  fallback () external payable {}

  // // swapTokens (address exchange, address token0, address token1) public {
  // //   IUniswapV2Router
  // // }
  function addExchange (string memory name, string[] memory tags, Network memory network) public {
    exchanges[exchangeLength] = Exchange({name: name, tags: tags, network: network});
    exchangeLength++;
  }
  function addExchangeComponent (string memory exchange, string memory name, address _address) public {
    exchangeComponents[exchange].push(ExchangeComponent({name: name, _address: _address}));
  }
  function getExchangeByName (string memory name) public pure {
    uint i = 0;
    for (i; i < exchangeLength; i++) {
      if (exchanges[i].name == name) return exchanges[i];
    }
  }
  function ethToLP (address exchange, address token0, address token1, uint amt) public {
    uint token0EthAmt;
    uint token1EthAmt;
    

  }
  // swaptTokens (address token0, address token1, uint amt0, uint amt1) public {
    
  // }
}