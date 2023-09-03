import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Color } from '../../styles/GlobalStyles';

export const ContainerRoot = styled(Box)<BoxProps>(({ theme }) => ({
    backgroundColor: Color.secondary, 
    width: '100%',
    marginTop: 2,
    display: 'flex',
    flexDirection: 'column'
}));

export const Root = styled(Box)<BoxProps>(({ theme }) => ({
    maxWidth: 1960, 
    marginLeft: 'auto', 
    marginRight: 'auto',
}));




