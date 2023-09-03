import { TextField, Typography } from '@mui/material';
import { Color } from '../../styles/GlobalStyles';

const CustomTextField = (props: any) => {
    const {
        field: { name, onBlur, onChange, value },
        form: { errors, touched, setFieldTouched },
        ...inputProps
    } = props

    const hasError = errors[name] && touched[name]

    return (
        <>
            <TextField
                error={hasError}
                value={value}
                onChange={(text) => onChange(name)(text)}
                onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                }}
                variant="outlined"
                label="outlined"
                fullWidth
                helperText={
                    hasError && 
                    <Typography variant="body1" mt={1}
                        color={Color.error}
                        component="span"
                    >{errors[name]}</Typography>
                }
                {...inputProps}
            />
            {/* {hasError &&
                <Typography variant="body1" mt={1}
                    color={Color.error}
                >{errors[name]}</Typography>
            } */}
        </>
    )
}

export default CustomTextField