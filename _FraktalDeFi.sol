pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

contract FraktalDeFi {
  struct ExchangeComponent {
    string name;
    address _address;
  }
  struct Exchange {
    string name;
    ExchangeComponent[] components;
    uint network;
  }

  mapping(uint => Exchange) exchanges;
  mapping(uint => string) networks;
  uint exchangeLength = 0;
  uint networkLength = 0;
  address owner;

  constructor () public {
    owner = msg.sender;
  }
  function addExchange (string calldata name, uint networkId) {
    exchanges[exchangeLength] = Exchange({name: name, netowrk: networks[networkId]});
    exchangeLength++;
  }
  function addNetwork (uint id, string calldata name) {
    networks[id] = name;
    networkLength++;
  }
  function getAllNetworksLength () public view returns(uint) {
    return networkLength;
  }
  function getAllExchagnesLength () public view returns(uint) {
    return exchangeLength;
  }
}