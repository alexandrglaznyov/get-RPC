// src/utils.ts
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController;
  const signal = controller.signal;
  const fetchPromise = fetch(url, { signal });
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetchPromise;
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// src/index.ts
async function fetchAllRPC() {
  const promises = rpcUrls.map(async (url) => {
    try {
      await fetchWithTimeout(url + "/lavanet/lava/spec/spec");
      return { status: "fulfilled" };
    } catch (error) {
      return { status: "rejected", reason: error.message };
    }
  });
  const results = await Promise.allSettled(promises);
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`RPC ${rpcUrls[index]}`);
    } else {
      console.error(`RPC ${rpcUrls[index]} rejected with reason:`, result.reason);
    }
  });
}
async function main() {
  while (true) {
    await fetchAllRPC();
    await new Promise((resolve) => setTimeout(resolve, 1e4));
  }
}
var rpcUrls = [
  "https://lava.api.t.stavr.tech",
  "https://lava-testnet.api.kjnodes.com",
  "https://lava-api.polkachu.com"
];
main();
