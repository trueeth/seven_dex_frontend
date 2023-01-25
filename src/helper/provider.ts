import { ethers } from "ethers"
import { DEFAULT_CHAIN_ID, DEFAULT_PROVIDER } from "src/config/chains";
import Web3 from 'web3'

let provider: ethers.providers.Web3Provider | null = null


export function web3ProviderFrom(endpoint: string): any {
    const providerClass = endpoint.includes('wss') ? Web3.providers.WebsocketProvider : Web3.providers.HttpProvider;
    return new providerClass(endpoint);
}


export function getDefaultProvider(): ethers.providers.Web3Provider {
    if (!provider) {
        provider = new ethers.providers.Web3Provider(web3ProviderFrom(DEFAULT_PROVIDER), DEFAULT_CHAIN_ID)
    }
    return provider
}