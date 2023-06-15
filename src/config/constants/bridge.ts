import { ChainId } from './chains'

export const BridgeAddress: Record<number, string> = {
    [ChainId.ETHEREUM]: '0x114258764796d6FBa6F7014d704a0E5BE06FC301',
    [ChainId.GOERLI]: '0x4bd50aF224047ef4239978ace8f53Fd42A1FBa75',
    [ChainId.POLYGON]: '0x114258764796d6FBa6F7014d704a0E5BE06FC301',
    [ChainId.MUMBAI]: '0x9CB5a1eE61b65f9Facb6bf115DbB057C51fB42c3',
    [ChainId.SVC]: ''
}
