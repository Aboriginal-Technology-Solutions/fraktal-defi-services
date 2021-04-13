pragma solidity ^0.7.0;

contract FraktaFinancial {
  event AddedContract(string indexed _name, address indexed _address, uint indexed _network);
  event AddedToken(string indexed _symbol, address indexed _address, uint _decimals, uint indexed _network);

  struct Contract {
    string _name;
    address _address;
    uint _network;
  }
  struct Token {
    string _symbol;
    address _address;
    uint _decimals;
    uint _network;
  }

  address owner;
  address token;
  address[] admins;
  address comptroller;
  
  string[] exchnages;
  mapping(uint => Contract) contracts;
  mapping(uint => Token) tokens;
  mapping(uint => string) networks;
  
  uint tokenLen;
  uint contractLen;

  constructor () public {
    owner = msg.sender;
  }
  function getOwner() public view returns(address) {
    return owner;
  } 
  function getAdmins() public view returns(address[] memory) {
    return admins;
  } 
  function getComptroller() public view returns(address) {
    return comptroller;
  }
  function transferOwner (address _newOwner) public onlyOwner() returns (bool _success) {
    owner = _newOwner;
    _success = true;
  }

  function addAdmin (address _newAdmin) public onlyAdmin() returns(bool) {
    admins.push(_newAdmin);
    return true;
  }
  // function addToken (string _symbol, address _address, uint _decimals, uint _network) public onlyAdmin () {
  //   token = _token;
  // }
  function updateComptroller (address _comptroller) public onlyAdmin () {
    comptroller = _comptroller;
  }
  function addToken (string calldata _symbol, address _address, uint _decimals, uint _network) public {
    uint i;
    uint len = tokenLen;

    for (i = 0; i < len; i++) {
      require(_address != tokens[i]._address, 'Token already listed');
    }
    tokens[tokenLen] = Token({
      _address: _address,
      _symbol: _symbol,
      _decimals: _decimals,
      _network: _network
    });
    tokenLen++;
    emit AddedToken(_symbol, _address, _decimals, _network);
  }
  
  function addContract (string calldata _name, address _address, uint _network) public {
     uint i;
    uint len = contractLen;
    bool addressExists = false;

    for (i = 0; i < len; i++) {
      if(_address == contracts[i]._address) addressExists = true;
    }
    require(!addressExists, 'Address already exists');

    contracts[contractLen] = Contract({
      _address: _address,
      _name: _name,
      _network: _network
    });
    contractLen++;
    emit AddedContract(_name, _address, _network);
  }
  function getContractByName (string memory name) public view returns(string memory _name, address _address, uint _network) {
    uint _contract;
    uint i;
    uint len = contractLen;
    bool hasContract = false;

    require(contractLen > 0, 'No contracts found');
    for (i = 0; i < len; i++) {
      if (keccak256(abi.encodePacked(contracts[i]._name)) == keccak256(abi.encodePacked(name))) {
        hasContract = true;
        _contract = i;
      }
    }
    require(hasContract, 'Contract not found');

    _name = contracts[_contract]._name;
    _address = contracts[_contract]._address;
    _network = contracts[_contract]._network;
  }
  function getToken (string memory _symbol) public returns(string memory symbol, address _address, uint decimals, uint network) { 
    uint _tokenId;
    uint i;
    uint len = tokenLen;
    bool hasToken = false;

    for (i; i < len; i++) {
      if (keccak256(abi.encodePacked(tokens[i]._symbol)) == keccak256(abi.encodePacked(_symbol))) {
        hasToken = true;
        _tokenId = i;
      }

    } 
    require(hasToken, 'Token not found');
    symbol = tokens[_tokenId]._symbol;
    _address = tokens[_tokenId]._address;
    decimals = tokens[_tokenId]._decimals;
    network = tokens[_tokenId]._network;
  }
  ///////////////
  // Modifiers //
  ///////////////

  modifier onlyOwner () {
    require(
      msg.sender == owner, 
      'Unauthorized action...'
    );
    _;
  }

   modifier onlyAdmin () {
    bool isAdmin = false;
    uint i;
    uint len = admins.length;
    for(i = 0; i < len; i++) {
      if (admins[i] == msg.sender) {
        isAdmin = true;
      }
    }
    require(owner == msg.sender || isAdmin, 'Unauthorized access');
    _;
  }
}