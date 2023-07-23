export const TokensQuery = `query MyQuery {
    TokenBalances(
      input: {filter: {tokenAddress: {_eq: "0x8d3fce9bd8bd5e5f28744b6ed6ac430f9f2c4f24"}, tokenType: {_eq: ERC20}}, blockchain: polygon, limit: 50}
    ) {
      TokenBalance {
        tokenAddress
        amount
        formattedAmount
        tokenType
      }
    }
  }`;
  