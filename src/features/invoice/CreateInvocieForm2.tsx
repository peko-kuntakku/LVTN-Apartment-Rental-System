/*
    HÓA ĐƠN THU TIỀN
*/
import {
    Typography, Stack,
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
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../common/Indicators/LoadingOverlay";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BackButton from "../../common/StyledComponents/BackButton";
import { InvoiceFormTwoInitialValue } from "../../model/Invoice";
import invoiceApi from "../../api/invoiceApi";
import { DesktopDatePicker } from "@mui/x-date-pickers";

const invoiceValidationSchema = yup.object().shape({
    paidAt: yup
        .date()
        .required('Bạn chưa chọn thời gian thanh toán.'),
    fee: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(1, () => 'Giá trị không hợp lệ.')
        .required('Bạn chưa nhập số tiền.'),
    description: yup
        .string(),
})

const initialValue: InvoiceFormTwoInitialValue = {
    paidAt: new Date(),
    fee: 0,
    description: '',
}

export default function CreateInvoiceForm2() {
    const currentUser = useAppSelector(selectCurrentUser);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isLoading: isMutating, mutate } = useMutation(
        async (data: InvoiceFormTwoInitialValue) => {
            return await invoiceApi.createInvoiceType2(currentUser!.jwt, data,)
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
        <Root style={{ width: '60%', minWidth: 800 }}>
            {
                isMutating && <LoadingOverlay />
            }
            <BackButton />
            <Typography variant="h6" fontWeight="600">Tạo hóa đơn chi</Typography>
            <ContainerRoot>
                <Formik
                    validateOnMount={true}
                    validationSchema={invoiceValidationSchema}
                    initialValues={initialValue}
                    onSubmit={(values) => {
                        if (currentUser?.jwt) {
                            mutate(values);
                        }
                    }}
                >
                    {({
                        handleChange,
                        values,
                    }) => (
                        <Form>
                            <Grid2 container
                                sx={{ marginLeft: 3, marginRight: 3, marginTop: 5, marginBottom: 5 }}
                                spacing={7}
                            >
                                <Grid2 sm={12}>
                                    <Stack direction="column">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Grid2 container>
                                                <Grid2 xs={6} m={0} p={0}>
                                                    <Field
                                                        component={CustomTextField}
                                                        name="fee"
                                                        label="Sồ tiền (đồng)"
                                                        placeholder="Số tiền (đồng)"
                                                        type='number'
                                                        InputProps={{ inputProps: { min: 0 } }}
                                                        sx={{ marginBottom: 5, width: '90%' }}
                                                    />
                                                </Grid2>
                                                <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
                                                    <DesktopDatePicker
                                                        label="Ngày thanh toán"
                                                        value={values.paidAt}
                                                        onChange={(newValue: Dayjs | null) => {
                                                            newValue && handleChange('paidAt')(newValue.toString());
                                                        }}
                                                        renderInput={(params) =>
                                                            <Field
                                                                {...params}
                                                                component={CustomTextField}
                                                                name="paidAt"
                                                                sx={{ marginBottom: 5, width: '90%' }}
                                                            />
                                                        }
                                                    />
                                                </Grid2>
                                            </Grid2>
                                        </LocalizationProvider>
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
                                    sx={{ marginTop: 8, ml: 3 }}
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