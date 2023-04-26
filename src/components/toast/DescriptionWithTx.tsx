import { Link } from 'react-router-dom'
import { ChainId } from '@/config/constants/chains'
import { getBlockExploreLink, getBlockExploreName } from '@/utils'
import truncateHash from '@/utils/truncateHash'
import { useActiveChainId } from '@/hooks/useActiveChainId'
import { useTranslation } from '@/context/Localization'
import { Typography } from '@mui/material'

interface DescriptionWithTxProps {
    description?: string
    txHash?: string
    txChainId?: number
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({
    txHash,
    txChainId,
    children,
}) => {
    const { chainId } = useActiveChainId()
    const { t } = useTranslation()

    return (
        <>
            {typeof children === 'string' ? <Typography>{children}</Typography> : children}
            {txHash && (
                <a href={getBlockExploreLink(txHash, 'transaction', txChainId || chainId)} target='_blank'>
                    <Typography sx={{ color: '#333 !important' }}>
                        {t('View on %site%', { site: getBlockExploreName(txChainId || chainId) })}: {truncateHash(txHash, 8, 0)}
                    </Typography>
                    {/* {(txChainId || chainId) === ChainId.MUMBAI && <BscScanIcon color="primary" ml="4px" />}  */}
                </a>
            )}
        </>
    )
}

export default DescriptionWithTx
