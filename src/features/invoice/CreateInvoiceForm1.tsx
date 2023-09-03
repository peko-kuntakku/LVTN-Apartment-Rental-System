/*
    HÓA ĐƠN THU TIỀN
*/

import {
    Typography, Stack,
    FormControl, InputLabel, Select, SelectChangeEvent, MenuItem,
} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import CustomTextField from "../../common/Inputs/CustomTextField";
import * as yup from 'yup';
import { Field, Form, Formik } from "formik";
import { CustomButton } from "../../common/Inputs/CustomButton";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../../common/Indicators/LoadingOverlay";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BackButton from "../../common/StyledComponents/BackButton";
import { InvoiceFormOneInitialValue } from "../../model/Invoice";
import ErrorMessage from "../../common/StyledComponents/ErrorMessage";
import { getInvoiceType } from "../../utils/invoiceUtils";
import invoiceApi from "../../api/invoiceApi";

const invoiceValidationSchema = yup.object().shape({
    startAt: yup
        .date()
        .required('Bạn chưa chọn thời gian bắt đầu thu tiền.'),
    expiredAt: yup
        .date()
        .required('Bạn chưa chọn hạn thu tiền.'),
    fee: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(1, () => 'Giá trị không hợp lệ.')
        .required('Bạn chưa nhập số tiền.'),
    description: yup
        .string(),
    billType: yup
        .string()
        .required('Bạn chưa chọn loại hóa đơn.')
})

const initialValue: InvoiceFormOneInitialValue = {
    startAt: new Date(),
    expiredAt: new Date(),
    fee: 0,
    description: '',
    billType: '',
}

export const invoiceTypeArray = ['1', '2', '3', '4'];

export default function CreateInvoiceForm1() {
    const currentUser = useAppSelector(selectCurrentUser);
    const { state } = useLocation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isLoading: isMutating, mutate } = useMutation(
        async (data: InvoiceFormOneInitialValue) => {
            return await invoiceApi.createInvoiceType1(currentUser!.jwt, data, state.contractId, state.requestId);
        },
        {
            onSuccess: (res) => {
                navigate(-1);
                toast.success('Tạo hóa đơn thành công.');
            },
            onError: (err) => {
                toast.error('Lỗi');
                console.log(err);
            },
            onSettled: () => {
                queryClient.invalidateQueries('invoices')
            }
        }
    );

    return (
        <Root>
            {
                isMutating && <LoadingOverlay />
            }
            <BackButton />
            <Typography variant="h6" fontWeight="600">Tạo hóa đơn thu tiền</Typography>
            <ContainerRoot>
                <Formik
                    validateOnMount={true}
                    validationSchema={invoiceValidationSchema}
                    initialValues={initialValue}
                    onSubmit={(values) => {
                        if (currentUser?.jwt && state.contractId) {
                            mutate(values);
                        } else {
                            toast.error('Lỗi gửi biểu mẫu');
                        }
                    }}
                >
                    {({
                        handleChange,
                        values,
                        errors,
                        touched
                    }) => (
                        <Form>
                            <Grid2 container
                                sx={{ marginLeft: 3, marginRight: 3, marginTop: 5, marginBottom: 5 }}
                                spacing={7}
                            >
                                <Grid2 sm={12} md={6}>
                                    <Stack direction="column">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Grid2 container>
                                                <Grid2 xs={6} m={0} p={0}>
                                                    <DateTimePicker
                                                        label="Ngày bắt đầu thu tiền"
                                                        value={values.startAt}
                                                        onChange={(newValue: Dayjs | null) => {
                                                            newValue && handleChange('startAt')(newValue.toString());
                                                        }}
                                                        renderInput={(params) =>
                                                            <Field
                                                                {...params}
                                                                component={CustomTextField}
                                                                name="startAt"
                                                                sx={{ marginBottom: 5, width: '90%' }}
                                                            />
                                                        }
                                                    />
                                                    <Field
                                                        component={CustomTextField}
                                                        name="fee"
                                                        label="Tiền thu (đồng)"
                                                        placeholder="Tièn thu (đồng)"
                                                        type='number'
                                                        InputProps={{ inputProps: { step: 1000, min: 0 } }}
                                                        sx={{ marginBottom: 5, width: '90%' }}
                                                    />
                                                </Grid2>
                                                <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
                                                    <DateTimePicker
                                                        label="Hạn thanh toán"
                                                        value={values.expiredAt}
                                                        onChange={(newValue: Dayjs | null) => {
                                                            newValue && handleChange('expiredAt')(newValue.toString());
                                                        }}
                                                        renderInput={(params) =>
                                                            <Field
                                                                {...params}
                                                                component={CustomTextField}
                                                                name="expiredAt"
                                                                sx={{ marginBottom: 5, width: '90%' }}
                                                            />
                                                        }
                                                    />
                                                    <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                        error={Boolean(errors.billType) && touched.billType}
                                                    >
                                                        <InputLabel>Loại hóa đơn</InputLabel>
                                                        <Select
                                                            value={values.billType}
                                                            label="Loại hóa đơn"
                                                            onChange={(event: SelectChangeEvent) => {
                                                                handleChange('billType')(event.target.value);
                                                            }}
                                                        >
                                                            <MenuItem value="">
                                                                <em>Chọn loại hóa đơn</em>
                                                            </MenuItem>
                                                            {invoiceTypeArray.map((ele, index) =>
                                                                <MenuItem value={ele} key={index}>{getInvoiceType(parseInt(ele))}</MenuItem>
                                                            )}
                                                        </Select>
                                                        {(errors.billType && touched.billType) &&
                                                            <ErrorMessage ml={2}
                                                                message={errors.billType}
                                                            />
                                                        }
                                                    </FormControl>
                                                </Grid2>
                                            </Grid2>
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid2>
                                <Grid2 sm={12} md={6}>
                                    <Stack direction="column">
                                        <Field
                                            component={CustomTextField}
                                            name="description"
                                            label="Nội dung"
                                            placeholder="Nội dung / Mô tả"
                                            multiline
                                            rows={5}
                                            sx={{ marginBottom: 5 }}
                                        />
                                    </Stack>
                                </Grid2>
                                <CustomButton
                                    buttonName="Thêm hóa đơn"
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