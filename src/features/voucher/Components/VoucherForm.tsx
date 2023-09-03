import { useState } from "react";
import { Typography, Stack } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';
import { ContainerRoot, Root } from "../../../common/StyledComponents/ItemList";
import CustomTextField from "../../../common/Inputs/CustomTextField";
import * as yup from 'yup';
import { Field, Form, Formik } from "formik";
import { CustomButton } from "../../../common/Inputs/CustomButton";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../app/features/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../../common/Indicators/LoadingOverlay";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { VoucherFormInitialValue } from "../../../model/Voucher";
import apartmentApi from "../../../api/apartmentApi";
import { transformApartmentNameData } from "../../../utils/apartmentUtils";
import TransferList from "../../../common/Inputs/TransferList";
import voucherApi from "../../../api/voucherApi";
import BackButton from "../../../common/StyledComponents/BackButton";

const voucherValidationSchema = yup.object().shape({
    voucherName: yup
        .string()
        .required('Bạn chưa nhập tên mã giảm giá.'),
    startAt: yup
        .date()
        .required('Bạn chưa chọn thời gian bắt đầu.'),
    expiredAt: yup
        .date(),
    // .required('Bạn chưa chọn thời gian kết thúc.'),
    amount: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(1, () => 'Số lượng mã lớn hơn 0')
        .required('Bạn chưa nhập số lượng.'),
    percentage: yup
        .number()
        .min(1, () => 'Giá trị không hợp lệ.')
        .max(100, () => 'Giá trị không hợp lệ.'),
    maxDiscount: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(1, () => 'Giá trị không hợp lệ.')
        .required('Bạn chưa nhập số tiền giảm tối đa.'),
})

interface FormProps {
    isEdit?: boolean,
    title: string,
    initialValue: VoucherFormInitialValue,
    id?: number,
}

export default function VoucherForm({ isEdit, title, initialValue, id }: FormProps) {
    const currentUser = useAppSelector(selectCurrentUser);
    // const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [selectedApartments, setSelectedApartments] = useState<any[]>([]);
    // const rightApartment = useRef([]);

    const handleSelectApartments = (value: any[]) => {
        setSelectedApartments([...value]);
    }

    const apartments = useQuery(['apartmentName'], async ({ signal }) => {
        return await apartmentApi.getAllSingleApartmentName(signal);
    }, {
        // enabled: true,
        retry: 1,
        select: (res: any) => {
            return res.data && transformApartmentNameData(res.data)
        },
        onError: (error) => {
            console.log(error);
        },
        refetchOnMount: true,
    })

    const { isLoading: isMutating, mutate } = useMutation(
        async (data: VoucherFormInitialValue) => {        
            if (currentUser?.jwt) {
                if (isEdit && id) {
                    return await voucherApi.updateVoucher(
                        currentUser.jwt,
                        id,
                        data,
                        selectedApartments.length > 0 ? selectedApartments : data.apartments,
                    );
                } else {
                    return await voucherApi.createVoucher(
                        currentUser.jwt,
                        data,
                        selectedApartments,
                    );
                }
            }
        },
        {
            onSuccess: (res) => {
                navigate(-1);
                if (isEdit) {
                    toast.success('Cập nhật thành công.');
                } else {
                    toast.success('Tạo mã giảm giá thành công.');
                }
            },
            onError: (err) => {
                toast.error('Lỗi');
                console.log(err);
            },
        }
    );

    return (
        <Root>
            {
                isMutating && <LoadingOverlay />
            }
            <BackButton />
            <Typography variant="h6" fontWeight="600">{title}</Typography>
            <ContainerRoot>
                <Formik
                    validateOnMount={true}
                    validationSchema={voucherValidationSchema}
                    initialValues={initialValue}
                    onSubmit={(values) => {
                        mutate(values);
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
                                <Grid2 sm={12} md={6}>
                                    <Stack direction="column">
                                        <Field
                                            component={CustomTextField}
                                            name="voucherName"
                                            label="Tên mã giảm giá"
                                            placeholder="Tên mã giảm giá"
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Grid2 container>
                                                <Grid2 xs={6} m={0} p={0}>
                                                    <DateTimePicker
                                                        label="Thời gian bắt đầu"
                                                        value={values.startAt}
                                                        onChange={(newValue: Dayjs | null) => {
                                                            newValue && handleChange('startAt')(newValue.toString());
                                                        }}
                                                        renderInput={(params) =>
                                                            // <TextField {...params} value={values.startAt} name="startAt" sx={{ marginBottom: 5, width: '90%' }} />
                                                            <Field
                                                                {...params}
                                                                component={CustomTextField}
                                                                name="startAt"
                                                                sx={{ marginBottom: 5, width: '90%' }}
                                                            />
                                                        }
                                                    />
                                                </Grid2>
                                                <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
                                                    <DateTimePicker
                                                        label="Thời gian kết thúc"
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
                                                </Grid2>
                                            </Grid2>
                                        </LocalizationProvider>

                                        <Typography fontWeight={600} mb={2}>Các căn hộ áp dụng mã:</Typography>
                                        <TransferList
                                            leftData={apartments.data}
                                            rightData={values.apartments}
                                            onSelect={handleSelectApartments}
                                        />
                                    </Stack>
                                </Grid2>
                                {/* <Divider orientation='horizontal' sx={{ width: 1 }}/> */}
                                <Grid2 sm={12} md={6}>
                                    <Stack direction="column">
                                        <Grid2 container>
                                            <Grid2 xs={6} m={0} p={0}>
                                                <Field
                                                    component={CustomTextField}
                                                    name="amount"
                                                    label="Số lượng mã"
                                                    placeholder="Số lượng mã"
                                                    type="number"
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                                <Field
                                                    component={CustomTextField}
                                                    name="maxDiscount"
                                                    label="Giảm tối đa (đồng)"
                                                    placeholder="Giảm tối đa (đồng)"
                                                    type='number'
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                            </Grid2>
                                            <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
                                                <Field
                                                    component={CustomTextField}
                                                    name="percentage"
                                                    label="Phần trăm giảm (%)"
                                                    placeholder="Phần trăm giảm (%)"
                                                    type='number'
                                                    // InputProps={{ inputProps: { min: 0, max: 100 } }}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </Stack>
                                </Grid2>
                                <CustomButton
                                    buttonName={isEdit ? 'Cập nhật' : "Thêm mã giảm giá"}
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