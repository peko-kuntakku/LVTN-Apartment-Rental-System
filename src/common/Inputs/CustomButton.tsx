import { Button, ButtonProps } from "@mui/material";
import { styled } from '@mui/material/styles';

type CustomButtonProps = {
    buttonName: string,
} & ButtonProps

/*
    DEFINE STYLED BUTTON for props.sx in CustomButton working
*/
const CusButton = styled(Button)<ButtonProps>(({ theme }) => ({
    fontWeight: 600,
    textTransform: 'none',
    // height: 42 => size='large' nearly 42
}));

export function CustomButton({ buttonName, ...props }: CustomButtonProps) {
    return (
        <CusButton
            variant="contained"
            fullWidth
            {...props}
        >
            {buttonName}
        </CusButton>
    );
}