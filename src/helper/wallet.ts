
export const registerToken = async (
    tokenAddress: string,
    tokenSymbol: string,
    tokenDecimals: number,
    tokenLogo: string,
) => {

    const tokenAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20',
            options: {
                address: tokenAddress,
                symbol: tokenSymbol,
                decimals: tokenDecimals,
                image: tokenLogo,
            },
        },
    })

    return tokenAdded
}
