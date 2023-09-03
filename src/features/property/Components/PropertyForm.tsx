import {
    Typography, Stack, MenuItem, FormLabel, Radio, RadioGroup,
    FormControl, InputLabel, Select, SelectChangeEvent, FormControlLabel,
} from "@mui/material";
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
import BackButton from "../../../common/StyledComponents/BackButton";
import ErrorMessage from "../../../common/StyledComponents/ErrorMessage";
import { PropertyFormInitialValue } from "../../../model/Property";
import apartmentApi from "../../../api/apartmentApi";
import { transformApartmentNameData } from "../../../utils/apartmentUtils";
import propertyApi from "../../../api/propertyApi";
import { getPropertyNameFromType } from "../../../utils/propertyUtils";

const propertyValidationSchema = yup.object().shape({
    propertyName: yup
        .string()
        .required('Bạn chưa nhập tên nội thất.'),
    description: yup
        .string()
        .min(30, ({ min }) => `Mô tả gồm tối thiểu ${min} kí tự.`),
    type: yup
        .number()
        .required('Bạn chưa chọn loại nội thất.'),
    price: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(999, () => 'Giá trị không hợp lệ.')
        .required('Bạn chưa chọn giá trị.'),
    quantity: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(0, () => 'Giá trị không hợp lệ.')
        .required('Bạn chưa chọn số lượng.'),
    apartment: yup
        .string()
        .required('Bạn chưa chọn căn hộ.'),
})

interface FormProps {
    isEdit?: boolean,
    title: string,
    initialValue: PropertyFormInitialValue,
    id?: number,
}

export const propertyArray = [1, 2]

export default function PropertyForm({ isEdit, title, initialValue, id }: FormProps) {
    const currentUser = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();

    const apartments = useQuery(['apartmentName'], async ({ signal }) => {
        if (signal) {
            return await apartmentApi.getAllSingleApartmentName(signal);
        }
    }, {
        // enabled: true,
        retry: 1,
        select: (res: any) => {
            return res.data && transformApartmentNameData(res.data);
        },
        onError: (error) => {
            console.log(error);
        },
        refetchOnMount: true,
    })

    const { isLoading: isMutating, mutate } = useMutation(
        async (data: PropertyFormInitialValue) => {
            if (currentUser?.jwt) {
                if (isEdit && id) {
                    return await propertyApi.updateProperty(
                        currentUser.jwt,
                        id,
                        data,
                    );
                } else {
                    return await propertyApi.createProperty(
                        currentUser.jwt,
                        data,
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
                    toast.success('Tạo nội thất thành công.');
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
                    validationSchema={propertyValidationSchema}
                    initialValues={initialValue}
                    onSubmit={(values) => {
                        mutate(values);
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
                                        <Field
                                            component={CustomTextField}
                                            name="propertyName"
                                            label="Tên nội thất"
                                            placeholder="Tên nội thất"
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <Grid2 container>
                                            <Grid2 xs={6} m={0} p={0}>
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                    error={Boolean(errors.apartment) && touched.apartment}
                                                >
                                                    <InputLabel>Căn hộ</InputLabel>
                                                    <Select
                                                        label="Căn hộ"
                                                        value={values.apartment}
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('apartment')(event.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Tòa nhà</em>
                                                        </MenuItem>
                                                        {apartments.isSuccess && apartments.data.map((ele: any) =>
                                                            <MenuItem value={`${ele.id}`} key={ele.id}>{ele.name}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.apartment && touched.apartment) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.apartment}
                                                        />
                                                    }
                                                </FormControl>

                                                <Field
                                                    component={CustomTextField}
                                                    name="price"
                                                    label="Giá trị"
                                                    placeholder="Giá trị"
                                                    type='number'
                                                    InputProps={{ inputProps: { min: 0, step: 1000 } }}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                            </Grid2>
                                            <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                    error={Boolean(errors.type) && touched.type}
                                                >
                                                    <InputLabel>Loại nội thất</InputLabel>
                                                    <Select
                                                        label="Loại nội thất"
                                                        value={values.type?.toString()}
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('type')(event.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Nội thất</em>
                                                        </MenuItem>
                                                        {propertyArray.map((ele: number) =>
                                                            <MenuItem value={ele.toString()} key={ele}>{getPropertyNameFromType(ele)}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.type && touched.type) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.type}
                                                        />
                                                    }
                                                </FormControl>

                                                <Field
                                                    component={CustomTextField}
                                                    name="quantity"
                                                    label="Số lượng"
                                                    placeholder="Số lượng"
                                                    type='number'
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </Stack>
                                </Grid2>
                                <Grid2 sm={12} md={6}>
                                    <Stack direction="column">
                                        <Field
                                            component={CustomTextField}
                                            name="description"
                                            label="Mô tả"
                                            placeholder="Mô tả"
                                            multiline
                                            rows={5}
                                            sx={{ marginBottom: 5 }}
                                        />
                                    </Stack>
                                </Grid2>
                                <CustomButton
                                    buttonName={isEdit ? 'Cập nhật' : "Thêm nội thất"}
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