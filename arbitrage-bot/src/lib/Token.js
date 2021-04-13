class Token {
  constructor(name, symbol, address, decimals = 18) {
    this.name = name
    this.symbol = symbol
    this.address = address
  }
}

module.exports = Token