import Typography, { TypographyProps } from '@mui/material/Typography';
import { Color } from '../../styles/GlobalStyles';

type Props = {
    message: string,
} & TypographyProps

export default function ErrorMessage({ message, ...otherProps }: Props) {
    return (
        <Typography variant="body1" mt={1} 
            color={Color.error}
            component="span"
            {...otherProps}
        >{message}</Typography>
    );
}