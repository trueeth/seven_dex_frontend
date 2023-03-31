import { useCallback, useEffect, useRef } from "react"
import { CSSTransition } from "react-transition-group"
import styled from "styled-components"
import { ToastProps, types } from "./types"
import { Box, Typography } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ReportIcon from '@mui/icons-material/Report'
import InfoIcon from '@mui/icons-material/Info'
import ErrorIcon from '@mui/icons-material/Error'

const StyledToast = styled.div`
  right: 16px;
  position: fixed;
  max-width: calc(100% - 32px);
  transition: all 250ms ease-in;
  width: fit-content;
`;

export const Toast: React.FC<React.PropsWithChildren<ToastProps>> = ({ toast, onRemove, style, ttl, ...props }) => {
    const timer = useRef<number>();
    const ref = useRef(null);
    const { id, title, description, type } = toast;

    const handleRemove = useCallback(() => onRemove(id), [id, onRemove]);

    const handleMouseEnter = () => {
        clearTimeout(timer.current);
    };

    const handleMouseLeave = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = window.setTimeout(() => {
            handleRemove();
        }, ttl);
    };

    useEffect(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = window.setTimeout(() => {
            handleRemove();
        }, ttl);

        return () => {
            clearTimeout(timer.current);
        };
    }, [timer, ttl, handleRemove])

    const getToastIcons = () => {
        switch (type) {
            case types.SUCCESS:
                return CheckCircleIcon;
            case types.INFO:
                return InfoIcon;
            case types.DANGER:
                return ErrorIcon;
            case types.WARNING:
                return ReportIcon
            default:
                return InfoIcon;
        }
    }
    const ToastIcon = getToastIcons()

    return (
        <CSSTransition nodeRef={ref} timeout={250} style={style} {...props}>
            <StyledToast ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {/* <Alert title={title} variant={alertTypeMap[type]} onClick={handleRemove}>
                    {description}
                </Alert> */}
                <Box
                    sx={{
                        bgcolor: '#fff',
                        borderRadius: 2.5,
                        p: 3
                    }}
                    onClick={handleRemove}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <ToastIcon />
                        <Typography>{title}</Typography>
                    </Box>
                    <Typography>{description}</Typography>
                </Box>
            </StyledToast>
        </CSSTransition>
    );
};
