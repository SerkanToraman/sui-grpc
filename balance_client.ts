import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";

const PROTO_PATH = path.join(
  __dirname,
  "proto/sui/rpc/v2beta2/live_data_service.proto"
);

// Load proto definitions
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [
    path.join(__dirname, "proto"),
    path.join(__dirname, "proto/sui/rpc/v2beta2"),
  ],
});

const suiProto = grpc.loadPackageDefinition(packageDefinition) as any;
const LiveDataService = suiProto.sui.rpc.v2beta2.LiveDataService;

// Create gRPC client
const client = new LiveDataService(
  "fullnode.testnet.sui.io:443",
  grpc.credentials.createSsl()
);

// Your account address
const accountAddress =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

// SUI coin type
const suiCoinType = "0x2::sui::SUI";

// Function to get balance for a specific coin type
function getBalance(owner: string, coinType: string) {
  const request = {
    owner: owner,
    coin_type: coinType,
  };

  client.GetBalance(request, (err: any, response: any) => {
    if (err) {
      console.error("Error getting balance:", err);
    } else {
      console.log(`Balance for ${coinType}:`);
      console.log("Response:", JSON.stringify(response, null, 2));

      if (response.balance) {
        const balance = response.balance.balance;
        const coinType = response.balance.coin_type;
        console.log(`\nBalance: ${balance} (${coinType})`);
      }
    }
  });
}

// Function to list all balances for an account
function listAllBalances(owner: string) {
  const request = {
    owner: owner,
    page_size: 50, // Get up to 50 balances
  };

  client.ListBalances(request, (err: any, response: any) => {
    if (err) {
      console.error("Error listing balances:", err);
    } else {
      console.log("All balances for account:");
      console.log("Response:", JSON.stringify(response, null, 2));

      if (response.balances && response.balances.length > 0) {
        console.log("\nBalances summary:");
        response.balances.forEach((balance: any, index: number) => {
          console.log(`${index + 1}. ${balance.coin_type}: ${balance.balance}`);
        });
      } else {
        console.log("No balances found for this account.");
      }
    }
  });
}

// Get SUI balance
console.log(`Getting SUI balance for account: ${accountAddress}`);
getBalance(accountAddress, suiCoinType);

// Wait a bit then get all balances
setTimeout(() => {
  console.log(`\nGetting all balances for account: ${accountAddress}`);
  listAllBalances(accountAddress);
}, 2000);
