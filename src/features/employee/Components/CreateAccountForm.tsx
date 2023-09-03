import {
    Typography, Stack, IconButton, InputAdornment,
} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';
import { ContainerRoot, Root } from "../../../common/StyledComponents/ItemList";
import CustomTextField from "../../../common/Inputs/CustomTextField";
import * as yup from 'yup';
import { Field, Form, Formik } from "formik";
import { CustomButton } from "../../../common/Inputs/CustomButton";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import LoadingOverlay from "../../../common/Indicators/LoadingOverlay";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { EmployeeAccountModel } from "../../../model/Employee";
import { useState } from "react";
import authApi from "../../../api/authApi";

const accountValidationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Bạn chưa nhập tên nhân viên.'),
    email: yup
        .string()
        .email("Email không hợp lệ.")
        .required('Bạn chưa nhập email.'),
    password: yup
        .string()
        .min(6, ({ min }) => `Mật khẩu gồm tối thiểu ${min} kí tự.`)
        .required('Bạn chưa nhập mật khẩu.'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp.')
        .required('Bạn chưa nhập xác nhận mật khẩu.'),
})

interface FormProps {
    updateStep: () => void,
    updateAccountId: (id: number) => void,
}

export default function CreateAccountForm({ updateStep, updateAccountId }: FormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const { isLoading: isMutating, mutate } = useMutation(
        async (data: EmployeeAccountModel) => {
            return await authApi.registerEmployee(data);
        },
        {
            onSuccess: (res: any) => {
                const id = res.user.id;
                updateAccountId(id);
                toast.success('Tạo tài khoản nhân viên thành công.');
                updateStep();
            },
            onError: (err: any) => {
                toast.error(err.response.data.error.message);
                console.log(err);
            },
        }
    );

    return (
        <Root>
            {
                isMutating && <LoadingOverlay />
            }
            <ContainerRoot>
                <Formik
                    validateOnMount={true}
                    validationSchema={accountValidationSchema}
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    }}
                    onSubmit={(values) => {
                        mutate(values);
                    }}
                >
                    {({ }) => (
                        <Form>
                            <Typography variant="h6" fontWeight="600"
                                sx={{ marginLeft: 5, marginTop: 3 }}
                            >
                                Tạo tài khoản nhân viên
                            </Typography>
                            <Grid2 container
                                sx={{ marginLeft: 3, marginRight: 3, marginTop: 2, marginBottom: 5 }}
                                spacing={7}
                            >
                                <Grid2 sm={12} md={6}>
                                    <Stack direction="column">
                                        <Field
                                            component={CustomTextField}
                                            name="username"
                                            label="Tên tài khoản"
                                            placeholder="Tên tài khoản"
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <Field
                                            component={CustomTextField}
                                            name="email"
                                            label="Email"
                                            placeholder="Email"
                                            sx={{ marginBottom: 5 }}
                                        />


                                    </Stack>
                                </Grid2>
                                <Grid2 sm={12} md={6}>
                                    <Stack direction="column">
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
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <Field
                                            component={CustomTextField}
                                            name="confirmPassword"
                                            label="Xác nhận mật khẩu"
                                            placeholder="Xác nhận mật khẩu"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle confirm password visibility"
                                                            onClick={handleClickShowConfirmPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{ marginBottom: 5 }}
                                        />
                                    </Stack>
                                </Grid2>
                                <CustomButton
                                    buttonName="Thêm tài khoản"
                                    size="large"
                                    sx={{ marginTop: 10, ml: 3 }}
                                    fullWidth={false}
                                    type="submit"
                                />
                            </Grid2>
                        </Form>
                    )}
                </Formik>
            </ContainerRoot>
        </Root>
    );
}