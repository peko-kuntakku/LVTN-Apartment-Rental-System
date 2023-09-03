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
import buildingApi from "../../../api/buildingApi";
import { transformBuildingNameData } from "../../../utils/buildingUtils";
import { ServiceFormInitialValue } from "../../../model/Service";
import ErrorMessage from "../../../common/StyledComponents/ErrorMessage";
import { getServiceNameFromType } from "../../../utils/serviceUtils";
import serviceApi from "../../../api/serviceApi";

const serviceValidationSchema = yup.object().shape({
    serviceName: yup
        .string()
        .required('Bạn chưa nhập tên dịch vụ.'),
    isCharged: yup
        .boolean()
        .required('Bạn chưa chọn trả phí.'),
    unit: yup
        .string(),
    description: yup
        .string()
        .min(30, ({ min }) => `Mô tả gồm tối thiểu ${min} kí tự.`),
    type: yup
        .number()
        .required('Bạn chưa chọn loại dịch vụ.'),
    price: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(999, () => 'Giá trị không hợp lệ.'),
    building: yup
        .string()
        .required('Bạn chưa chọn toà nhà.'),
})

interface FormProps {
    isEdit?: boolean,
    title: string,
    initialValue: ServiceFormInitialValue,
    id?: number,
}

export const serviceArray = [1, 2, 3, 4, 5, 6]

export default function ServiceForm({ isEdit, title, initialValue, id }: FormProps) {
    const currentUser = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();

    const buildings = useQuery(['buildingName'], async ({ signal }) => {
        return await buildingApi.getAllBuildingName();
    }, {
        // enabled: true,
        retry: 1,
        select: (res: any) => {
            return res.data && transformBuildingNameData(res.data)
        },
        onError: (error) => {
            console.log(error);
        },
        refetchOnMount: true,
    })

    const { isLoading: isMutating, mutate } = useMutation(
        async (data: ServiceFormInitialValue) => {
            if (currentUser?.jwt) {
                if (isEdit && id) {
                    return await serviceApi.updateService(
                        currentUser.jwt,
                        id,
                        data,
                    );
                } else {
                    return await serviceApi.createService(
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
                    validationSchema={serviceValidationSchema}
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
                                            name="serviceName"
                                            label="Tên dịch vụ"
                                            placeholder="Tên dịch vụ"
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <Grid2 container>
                                            <Grid2 xs={6} m={0} p={0}>
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                    error={Boolean(errors.building) && touched.building}
                                                >
                                                    <InputLabel>Tòa nhà</InputLabel>
                                                    <Select
                                                        label="Tòa nhà"
                                                        value={values.building}
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('building')(event.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Tòa nhà</em>
                                                        </MenuItem>
                                                        {buildings.isSuccess && buildings.data.map((ele: any) =>
                                                            <MenuItem value={`${ele.id}`} key={ele.id}>{ele.name}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.building && touched.building) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.building}
                                                        />
                                                    }
                                                </FormControl>

                                                <Field
                                                    component={CustomTextField}
                                                    name="price"
                                                    label="Giá tiền"
                                                    placeholder="Giá tiền"
                                                    type='number'
                                                    InputProps={{ inputProps: { min: 0, step: 1000 } }}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                            </Grid2>
                                            <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                    error={Boolean(errors.type) && touched.type}
                                                >
                                                    <InputLabel>Loại dịch vụ</InputLabel>
                                                    <Select
                                                        label="Loại dịch vụ"
                                                        value={values.type?.toString()}
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('type')(event.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Dịch vụ</em>
                                                        </MenuItem>
                                                        {serviceArray.map((ele: number) =>
                                                            <MenuItem value={ele.toString()} key={ele}>{getServiceNameFromType(ele)}</MenuItem>
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
                                                    name="unit"
                                                    label="Đơn vị"
                                                    placeholder="Đơn vị"
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

                                        <FormControl>
                                            <FormLabel id="radio-is-charged">Tính phí?</FormLabel>
                                            <RadioGroup
                                                name="controlled-radio-buttons-group"
                                                value={values.isCharged}
                                                onChange={handleChange('isCharged')}
                                            >
                                                <FormControlLabel value={true} control={<Radio />} label="Có" />
                                                <FormControlLabel value={false} control={<Radio />} label="Không" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Stack>
                                </Grid2>
                                <CustomButton
                                    buttonName={isEdit ? 'Cập nhật' : "Thêm dịch vụ"}
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