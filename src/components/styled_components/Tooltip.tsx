import { Box, Tooltip, tooltipClasses, TooltipProps } from "@mui/material"
import { styled } from "@mui/material/styles"
import * as React from "react"

interface IProps extends TooltipProps { }

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        padding: '10px',
        backgroundColor: "rgb(255 248 230)",
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: theme.shadows[1],
        fontSize: 12,
        borderRadius: '10px'
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "rgb(255 248 230)",
    },
}))

export const CustomTooltip: React.FunctionComponent<IProps> = (props) => {
    const { children, ...rest } = props

    return (
        <Box display="flex">
            <StyledTooltip arrow {...rest}>
                {children}
            </StyledTooltip>
        </Box>
    )
}