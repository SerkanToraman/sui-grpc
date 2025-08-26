import axios from "axios";

// Sui Testnet REST API endpoint
const SUI_TESTNET_URL = "https://fullnode.mainnet.sui.io";

// Sample address
const address =
  "0xd1cb71c7e5990542ae1a0c4f403c6e6edbf4e37a076bacde40b1b0ce4906fd01";

async function getAllCoins() {
  try {
    // Make REST API call to get all coins for an address
    const response = await axios.post(
      `${SUI_TESTNET_URL}/`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "suix_getAllCoins",
        params: [address],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Execute the function
getAllCoins();
