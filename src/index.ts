import { fetchWithTimeout } from './utils'

const rpcUrls = [
  'https://lava.api.t.stavr.tech',
  'https://lava-testnet.api.kjnodes.com',
  'https://lava-api.polkachu.com'
];

async function fetchAllRPC() {
  const promises = rpcUrls.map(async (url) => {
    try {
      await fetchWithTimeout(url + '/lavanet/lava/spec/spec');
      return { status: 'fulfilled' };
    } catch (error: any) {
      return { status: 'rejected', reason: error.message };
    }
  });

  const results = await Promise.allSettled(promises);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`RPC ${rpcUrls[index]}`);
    } else {
      console.error(`RPC ${rpcUrls[index]} rejected with reason:`, result.reason);
    }
  });
}

async function main() {
  while (true) {
    await fetchAllRPC();
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

main();