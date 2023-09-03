import { useEffect, useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import Box, { BoxProps } from '@mui/material/Box';
import { Color } from "../../styles/GlobalStyles";
import { styled } from '@mui/material/styles';
import CoverImage from '../../assets/apartment.jpeg';
import { IconButton, InputAdornment, Typography } from "@mui/material";
import Center from "../../common/StyledComponents/Center";
import * as yup from 'yup';
import { Field, Form, Formik } from "formik";
import CustomTextField from "../../common/Inputs/CustomTextField";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { CustomButton } from '../../common/Inputs/CustomButton';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { authActions, selectIsLoggedIn } from '../../app/features/authentication/authSlice';
import { useNavigate } from 'react-router-dom';

const loginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Vui lòng nhập email hợp lệ.")
        .required('Email là bắt buộc.'),
    password: yup
        .string()
        //   .matches(/\w*[a-z]\w*/, "Password must have a small letter")
        //   .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
        //   .matches(/\d/, "Password must have a number")
        //   .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
        .min(6, ({ min }) => `Mật khẩu gồm tối thiểu ${min} kí tự.`)
        .required('Mật khẩu là bắt buộc.'),
})

const FormContainer = styled(Box)<BoxProps>(({ theme }) => ({
    // backgroundColor: Color.success,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
}));

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard');
        }
    }, [isLoggedIn])

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Grid2 container sx={{ width: '100vw', height: '100vh' }}>
            <Grid2 sm={0} md={7} bgcolor={Color.primary}>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${CoverImage})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'

                }}>
                    <Box sx={{
                        backgroundColor: 'rgba(16, 24, 40, 0.25)',
                        zIndex: 2,
                        height: "100%",
                    }}>
                    </Box>
                </Box>
            </Grid2>
            <Grid2 sm={12} md={5} bgcolor={Color.secondary}>
                <Center>
                    <FormContainer>
                        <Typography variant="h4" fontWeight="600">Đăng nhập</Typography>
                        <Formik
                            validateOnMount={true}
                            validationSchema={loginValidationSchema}
                            initialValues={{ email: '', password: '' }}
                            onSubmit={(values) => {
                                dispatch(authActions.login(values))
                            }}
                        >
                            {() => (
                                <Box mt={10}>
                                    <Form>
                                        <Field
                                            component={CustomTextField}
                                            name="email"
                                            label="Email"
                                            placeholder="Email"
                                        />
                                        <Field
                                            component={CustomTextField}
                                            name="password"
                                            label="Mật khẩu"
                                            placeholder="Mật khẩu"
                                            type={showPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{ marginTop: 5 }}
                                        />
                                        <CustomButton 
                                            buttonName="Đăng nhập"
                                            size="large"
                                            sx={{ marginTop: 10 }}
                                            type="submit"
                                        />
                                    </Form>
                                </Box>
                            )}
                        </Formik>
                    </FormContainer>
                </Center>
            </Grid2>
        </Grid2>
    );
}