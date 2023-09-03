import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const Center = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
}));

export default Center;