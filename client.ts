import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";

const PROTO_PATH = path.join(
  __dirname,
  "proto/sui/rpc/v2beta2/ledger_service.proto"
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
const LedgerService = suiProto.sui.rpc.v2beta2.LedgerService;

// Create gRPC client
const client = new LedgerService(
  "fullnode.testnet.sui.io:443",
  grpc.credentials.createSsl()
);

// Sample transaction digest in Base58 format
const base58Digest = "3ByWphQ5sAVojiTrTrGXGM5FmCVzpzYmhsjbhYESJtxp";

// Construct the request
const request = {
  digest: base58Digest,
  read_mask: {
    paths: ["events", "effects"],
  },
};

// Make gRPC call
client.GetTransaction(request, (err: any, response: any) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Response:", JSON.stringify(response, null, 2));
  }
});
