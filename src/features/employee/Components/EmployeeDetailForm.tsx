import { useState } from "react";
import {
    Typography, Stack,
    FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, Checkbox, ListItemText, OutlinedInput,
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
import LoadingOverlay from "../../../common/Indicators/LoadingOverlay";
import { CreateEmployeeDetailModel } from "../../../model/Employee";
import ErrorMessage from "../../../common/StyledComponents/ErrorMessage";
import buildingApi from "../../../api/buildingApi";
import { transformBuildingNameData } from "../../../utils/buildingUtils";
import employeeApi from "../../../api/employeeApi";

export const employeeValidationSchema = yup.object().shape({
    firstname: yup
        .string()
        .required('Bạn chưa nhập tên.'),
    lastname: yup
        .string()
        .required('Bạn chưa nhập họ, tên lót.'),
    role: yup
        .string()
        .required('Bạn chưa chọn vị trí.'),
    salary: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(99999, () => 'Giá trị không hợp lệ.')
        .required('Bạn chưa nhập lương.'),
    benefit: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(99999, () => 'Giá trị không hợp lệ.')
        .required('Bạn chưa nhập phúc lợi.'),
    maxLeave: yup
        .number()
        .integer('Giá trị không hợp lệ')
        .min(0, () => 'Giá trị không hợp lệ.')
        .required('Bạn chưa chọn số ngày nghỉ trong năm.'),
    shift: yup
        .string()
        .required('Bạn chưa chọn ca làm việc.'),
    building: yup
        .string()
        .required('Bạn chưa chọn nơi làm việc.'),
    grade: yup
        .string(),
})

interface FormProps {
    updateStep?: () => void,
    accountId?: number
}

export const roleArray = ['Bảo vệ', 'Giữ xe', 'Giặt ủi', 'Dọn vệ sinh', 'Sửa chữa', 'Khác'];
export const dayArray = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
export const shiftArray = [1, , 2, 3];

export default function EmployeeDetailForm({ accountId, updateStep }: FormProps) {
    const currentUser = useAppSelector(selectCurrentUser);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const buildings = useQuery(['buildingName'], async ({ signal }) => {
        return await buildingApi.getAllBuildingName();
    }, {
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
        async (data: CreateEmployeeDetailModel) => {
            if (accountId) {
                return await employeeApi.createEmployeeDetail(currentUser!.jwt, data, selectedDays, accountId);
            }
        },
        {
            onSuccess: (res) => {
                toast.success('Thao tác thành công.');
                updateStep && updateStep();
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
            <ContainerRoot>
                <Formik
                    validateOnMount={true}
                    validationSchema={employeeValidationSchema}
                    initialValues={{
                        firstname: '',
                        lastname: '',
                        role: '',
                        salary: 100000,
                        benefit: 100000,
                        maxLeave: 0,
                        shift: '',
                        building: '',
                        grade: '',
                    }}
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
                            <Typography variant="h6" fontWeight="600"
                                sx={{ marginLeft: 5, marginTop: 3 }}
                            >
                                Thêm thông tin chi tiết
                            </Typography>
                            <Grid2 container
                                sx={{ marginLeft: 3, marginRight: 3, marginTop: 2, marginBottom: 5 }}
                                spacing={7}
                            >
                                <Grid2 sm={12} md={6}>
                                    <Stack direction="column">
                                        <Field
                                            component={CustomTextField}
                                            name="lastname"
                                            label="Họ, tên lót"
                                            placeholder="Họ, tên lót"
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <Grid2 container>
                                            <Grid2 xs={6} m={0} p={0}>
                                                <Field
                                                    component={CustomTextField}
                                                    name="salary"
                                                    label="Lương (đồng)"
                                                    placeholder="Lương (đồng)"
                                                    type='number'
                                                    InputProps={{ inputProps: { step: 100000, min: 0 } }}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                    error={Boolean(errors.role) && touched.role}
                                                >
                                                    <InputLabel>Vị trí, công việc</InputLabel>
                                                    <Select
                                                        value={values.role}
                                                        label="Vị trí, công việc"
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('role')(event.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Chọn công việc</em>
                                                        </MenuItem>
                                                        {roleArray.map((ele, index) =>
                                                            <MenuItem value={ele} key={index}>{ele}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.role && touched.role) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.role}
                                                        />
                                                    }
                                                </FormControl>
                                            </Grid2>
                                            <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <Field
                                                    component={CustomTextField}
                                                    name="benefit"
                                                    label="Phúc lợi (đồng)"
                                                    placeholder="Phúc lợi (đồng)"
                                                    type='number'
                                                    InputProps={{ inputProps: { step: 100000, min: 0 } }}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                                <Field
                                                    component={CustomTextField}
                                                    name="grade"
                                                    label="Chức vụ"
                                                    placeholder="Chức vụ"
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
                                            name="firstname"
                                            label="Tên"
                                            placeholder="Tên"
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <Grid2 container>
                                            <Grid2 xs={6} m={0} p={0}>
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}>
                                                    <InputLabel>Ngày làm việc</InputLabel>
                                                    <Select
                                                        multiple
                                                        value={selectedDays}
                                                        label="Ngày làm việc"
                                                        onChange={(event: SelectChangeEvent<string[]>) => {
                                                            const {
                                                                target: { value },
                                                            } = event;
                                                            setSelectedDays(
                                                                // On autofill we get a stringified value.
                                                                typeof value === 'string' ? value.split(',') : value,
                                                            );
                                                        }}
                                                        input={<OutlinedInput label="Ngày làm việc" />}
                                                        renderValue={(selected) => selected.join(', ')}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Chọn ngày</em>
                                                        </MenuItem>
                                                        {dayArray.map((ele, index) =>
                                                            <MenuItem key={ele} value={ele}>
                                                                <Checkbox checked={selectedDays.indexOf(ele) > -1} />
                                                                <ListItemText primary={ele} />
                                                            </MenuItem>
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                    error={Boolean(errors.building) && touched.building}
                                                >
                                                    <InputLabel>Nơi làm việc</InputLabel>
                                                    <Select
                                                        label="Nơi làm việc"
                                                        value={values.building}
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('building')(event.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Chọn tòa nhà</em>
                                                        </MenuItem>
                                                        {buildings.isSuccess && buildings.data.map((ele: any) =>
                                                            <MenuItem value={`${ele.id}-${ele.name}-${ele.floors}`} key={ele.id}>{ele.name}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.building && touched.building) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.building}
                                                        />
                                                    }
                                                </FormControl>
                                            </Grid2>
                                            <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                    error={Boolean(errors.shift) && touched.shift}
                                                >
                                                    <InputLabel>Ca làm việc</InputLabel>
                                                    <Select
                                                        value={values.shift}
                                                        label="Ca làm việc"
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('shift')(event.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Chọn ca</em>
                                                        </MenuItem>
                                                        {shiftArray.map(ele =>
                                                            <MenuItem value={ele?.toString()} key={ele}>Ca {ele}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.shift && touched.shift) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.shift}
                                                        />
                                                    }
                                                </FormControl>
                                                <Field
                                                    component={CustomTextField}
                                                    name="maxLeave"
                                                    label="Ngày phép"
                                                    placeholder="Ngày phép"
                                                    type='number'
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                            </Grid2>
                                        </Grid2>

                                    </Stack>
                                </Grid2>
                                <CustomButton
                                    buttonName="Thêm thông tin"
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