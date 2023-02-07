import { Contract } from '@ethersproject/contracts'
import type { Provider } from '@ethersproject/providers'
import type { Signer } from '@ethersproject/abstract-signer'
import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { AddressZero } from '@ethersproject/constants'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'

// warns if addresses are not checksummed
// eslint-disable-next-line consistent-return
export function validateAndParseAddress(address: string): string {
    try {
        const checksummedAddress = getAddress(address)
        warning(address === checksummedAddress, `${address} is not checksummed.`)
        return checksummedAddress
    } catch (error) {
        invariant(false, `${address} is not a valid address.`)
    }
}

export const isAddress = memoize((value: any): string | false => {
    try {
        return getAddress(value)
    } catch {
        return false
    }
})

export function getContract(address: string, ABI: any, signer?: Signer | Provider): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(address, ABI, signer)
}
