import { SearchOutlined } from '@mui/icons-material';
import { InputBase, InputBaseProps } from '@mui/material';
import { styled, alpha, SxProps } from '@mui/material/styles';
import { CSSProperties } from 'react';
import { Color } from '../styles/GlobalStyles';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.common.white, 0.35),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.55),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        // marginLeft: theme.spacing(3),
        // width: 'auto',
        width: 348,
    },
    border: `1px solid ${Color.border}`,
    color: Color.extraText,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function SearchBar({...props}: InputBaseProps) {
    return (
        <Search>
            <SearchIconWrapper>
                <SearchOutlined />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Tìm kiếm..."
                inputProps={{ 'aria-label': 'search' }}
                {...props}
            />
        </Search>
    );
}