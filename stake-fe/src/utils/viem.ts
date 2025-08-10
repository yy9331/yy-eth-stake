import { sepolia } from "viem/chains";
import { PublicClient, createPublicClient, http } from 'viem'


export const viemClients = (chainId: number): PublicClient => {
  const clients: {
    [key: number]: PublicClient
  } = {
    [sepolia.id]: createPublicClient({
      chain: sepolia,
      transport: http('https://sepolia.infura.io/v3/d8ed0bd1de8242d998a1405b6932ab33')
    })
  }
  return clients[chainId]
}