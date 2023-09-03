import { useState } from "react";
import {
    Typography, Box,
    FormControl, InputLabel, Select, SelectChangeEvent,
    MenuItem, Stack
} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';
import locationApi from "../../../api/locationApi";
import { ContainerRoot, Root } from "../../../common/StyledComponents/ItemList";
import CustomTextField from "../../../common/Inputs/CustomTextField";
import * as yup from 'yup';
import { Field, Form, Formik } from "formik";
import { CustomButton } from "../../../common/Inputs/CustomButton";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ErrorMessage from "../../../common/StyledComponents/ErrorMessage";
import { toast } from "react-toastify";
import { Color } from "../../../styles/GlobalStyles";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../app/features/authentication/authSlice";
import buildingApi from "../../../api/buildingApi";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../../common/Indicators/LoadingOverlay";
import { handleSubmitImg } from "../../../utils/utils";
import { BuildingFormInitialValue } from "../../../model/Building";
import BackButton from "../../../common/StyledComponents/BackButton";

const addBuildingValidationSchema = yup.object().shape({
    buildingName: yup
        .string()
        .required('Bạn chưa nhập tên tòa nhà.'),
    numOfFloors: yup
        .string()
        .required('Bạn chưa chọn số tầng.'),
    description: yup
        .string()
        .min(30, ({ min }) => `Mô tả gồm tối thiểu ${min} kí tự.`)
        .required('Bạn chưa nhập mô tả.'),
    province: yup
        .string(),
    // .required('Bạn chưa chọn tỉnh/thành phố.'),
    district: yup
        .string(),
    // .required('Bạn chưa chọn quận/huyện.'),
    ward: yup
        .string(),
    // .required('Bạn chưa chọn xã/phường.'),
    addressDetail: yup
        .string()
        .required('Bạn chưa nhập địa chỉ cụ thể.'),
    // bug in regex
    latitude: yup
        .string()
        .matches(/^[0-9]*([.]\d*)?$/, 'Giá trị không hợp lệ.')
        .required('Bạn chưa nhập vĩ độ.'),
    // bug in regex    
    longtitude: yup
        .string()
        .matches(/^[0-9]*([.]\d*)?$/, 'Giá trị không hợp lệ.')
        .required('Bạn chưa nhập kinh độ.'),
})

export const numberOfFloors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

interface FormProps {
    isEdit?: boolean,
    title: string,
    initialValue: BuildingFormInitialValue,
    id?: number,
}

export default function BuildingForm({ isEdit, title, initialValue, id }: FormProps) {
    const currentUser = useAppSelector(selectCurrentUser);
    const queryClient = useQueryClient()
    const [selectedProvince, setSelectedProvince] = useState<number>();
    const [selectedDistrict, setSelectedDistrict] = useState<number>();
    const [previewImgUrl, setPreviewImgUrl] = useState<string>();
    const [file, setFile] = useState<any>();
    const navigate = useNavigate();

    const provinces = useQuery(['provinces'], async ({ signal }) => {
        return await locationApi.getAllProvinces(signal);
    }, {
        // enabled: true,
        retry: 1,
        select: (res: any) => {
            return res.data;
        },
        onError: (error) => {
            console.log(error);
        },
        staleTime: Infinity,
    })

    const districts = useQuery(['districts', selectedProvince], async ({ signal }) => {
        return await locationApi.getDistricts(selectedProvince!);
    }, {
        enabled: Boolean(selectedProvince),
        retry: 1,
        select: (res: any) => {
            return res.data;
        },
        onError: (error) => {
            console.log(error);
        },
    })

    const wards = useQuery(['wards', selectedDistrict], async ({ signal }) => {
        return await locationApi.getWards(selectedDistrict!);
    }, {
        enabled: Boolean(selectedDistrict),
        retry: 1,
        select: (res: any) => {
            return res.data;
        },
        onError: (error) => {
            console.log(error);
        },
    })

    const { isLoading: isMutating, mutate } = useMutation(
        async (data: BuildingFormInitialValue) => {
            if (currentUser?.jwt) {
                if (file) {
                    const url = await handleSubmitImg(file, `buildings/${data.buildingName}-image`) as string;
                    data.imageUrl = url;
                }
                if (isEdit && id) {
                    return await buildingApi.updateBuilding(
                        currentUser.jwt,
                        id,
                        data
                    );
                } else {
                    return await buildingApi.createBuilding(
                        currentUser.jwt,
                        data
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
                    toast.success('Tạo toà nhà thành công.');
                }
            },
            onError: (err) => {
                toast.error('Lỗi');
                console.log(err);
            },
            onSettled: () => {
                queryClient.invalidateQueries('buildings')
            }
        }
    );

    const onImageChange = (event: any) => {
        const file = event.target?.files[0];
        if (file) {
            if (file.size >= 512000) {
                toast.error('Kích thước ảnh tối đa là 500KB.');
                return
            }
            setPreviewImgUrl(URL.createObjectURL(file));
            setFile(file);
        }
    }

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
                    validationSchema={addBuildingValidationSchema}
                    initialValues={initialValue}
                    onSubmit={(values) => {
                        mutate(values);
                    }}
                >
                    {({
                        handleChange,
                        values,
                        errors,
                        touched,
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
                                            name="buildingName"
                                            label="Tên tòa nhà"
                                            placeholder="Tên tòa nhà"
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <FormControl sx={{ width: '40%', marginBottom: 5 }}
                                            error={Boolean(errors.numOfFloors) && touched.numOfFloors}
                                        >
                                            <InputLabel id="select-number-of-floors">Số tầng</InputLabel>
                                            <Select
                                                labelId="select-number-of-floors"
                                                id="numOfFloors"
                                                value={values.numOfFloors}
                                                label="Số tầng"
                                                onChange={(event: SelectChangeEvent) => {
                                                    handleChange('numOfFloors')(event.target.value);
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>Số tầng</em>
                                                </MenuItem>
                                                {numberOfFloors.map(ele =>
                                                    <MenuItem value={ele.toString()} key={ele}>{ele}</MenuItem>
                                                )}
                                            </Select>
                                            {(errors.numOfFloors && touched.numOfFloors) &&
                                                <ErrorMessage ml={2}
                                                    message={errors.numOfFloors}
                                                />
                                            }
                                        </FormControl>

                                        <Field
                                            component={CustomTextField}
                                            name="description"
                                            label="Mô tả"
                                            placeholder="Mô tả"
                                            multiline
                                            rows={5}
                                            sx={{ marginBottom: 5 }}
                                        />

                                        {
                                            !initialValue.imageUrl &&
                                            <>
                                                <label htmlFor={'upload-button'}>
                                                    <Box sx={{
                                                        border: `1px solid ${Color.primary}`,
                                                        paddingTop: '8px', paddingBottom: '8px',
                                                        paddingLeft: '22px', paddingRight: '22px',
                                                        width: 'fit-content',
                                                        borderRadius: 1,
                                                        marginBottom: 2,
                                                    }}>
                                                        <Typography color={Color.extraText}>Chọn ảnh</Typography>
                                                    </Box>
                                                    <input type='file' id="upload-button"
                                                        style={{ display: 'none' }}
                                                        onChange={onImageChange}
                                                    />
                                                </label>
                                                {
                                                    previewImgUrl &&
                                                    <img
                                                        src={previewImgUrl}
                                                        loading="lazy"
                                                        alt="Preview"
                                                        style={{ objectFit: 'contain', width: '300px', height: '300px' }}
                                                    />
                                                }
                                            </>
                                        }
                                    </Stack>
                                </Grid2>
                                <Grid2 sm={12} md={6}>
                                    <Stack direction="column">
                                        <Field
                                            component={CustomTextField}
                                            name="addressDetail"
                                            label="Địa chỉ cụ thể"
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <Grid2 container>
                                            <Grid2 xs={6} m={0} p={0}>
                                                <Field
                                                    component={CustomTextField}
                                                    name="latitude"
                                                    label={`Vĩ độ`}
                                                    placeholder={`Vĩ độ`}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                                <FormControl sx={{ width: "90%", marginBottom: 5 }}>
                                                    <InputLabel id="select-province">Tỉnh/Thành</InputLabel>
                                                    <Select
                                                        labelId="select-province"
                                                        id="province"
                                                        value={values.province}
                                                        label="Tỉnh/Thành"
                                                        onChange={(event: SelectChangeEvent) => {
                                                            const arr = event.target.value.split('-');
                                                            setSelectedProvince(parseInt(arr[1]));
                                                            handleChange('province')(event.target.value);
                                                            /*
                                                                reset district, ward select
                                                            */
                                                            handleChange('district')('');
                                                            handleChange('ward')('');
                                                        }}
                                                    >
                                                        {provinces.isSuccess && provinces.data.map((ele: any) =>
                                                            <MenuItem value={`${ele.name}-${ele.code}`} key={ele.code}>{ele.name}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.province && touched.province) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.province}
                                                        />
                                                    }
                                                </FormControl>
                                                <FormControl sx={{ width: "90%", marginBottom: 5 }}>
                                                    <InputLabel id="select-ward">Phường/Xã</InputLabel>
                                                    <Select
                                                        labelId="select-ward"
                                                        id="ward"
                                                        value={values.ward}
                                                        label="Phường/Xã"
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('ward')(event.target.value);
                                                        }}
                                                    >
                                                        {wards.isSuccess && wards.data.wards.map((ele: any) =>
                                                            <MenuItem value={`${ele.name}-${ele.code}`} key={ele.code}>{ele.name}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.ward && touched.ward) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.ward}
                                                        />
                                                    }
                                                </FormControl>
                                            </Grid2>
                                            <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <Field
                                                    component={CustomTextField}
                                                    name="longtitude"
                                                    label={`Kinh độ`}
                                                    placeholder={`Kinh độ`}
                                                    sx={{ marginBottom: 5, width: '90%' }}
                                                />
                                                <FormControl sx={{ width: "90%", marginBottom: 15 }}>
                                                    <InputLabel id="select-district">Quận/Huyện</InputLabel>
                                                    <Select
                                                        labelId="select-district"
                                                        id="district"
                                                        value={values.district}
                                                        label="Quận/Huyện"
                                                        onChange={(event: SelectChangeEvent) => {
                                                            const arr = event.target.value.split('-');
                                                            setSelectedDistrict(parseInt(arr[1]));
                                                            handleChange('district')(event.target.value);
                                                            /*
                                                                reset ward select
                                                            */
                                                            handleChange('ward')('');
                                                        }}
                                                    >
                                                        {districts.isSuccess && districts.data.districts.map((ele: any) =>
                                                            <MenuItem value={`${ele.name}-${ele.code}`} key={ele.code}>{ele.name}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.district && touched.district) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.district}
                                                        />
                                                    }
                                                </FormControl>
                                            </Grid2>
                                        </Grid2>
                                    </Stack>
                                </Grid2>
                                <CustomButton
                                    buttonName={isEdit ? 'Cập nhật' : "Thêm tòa nhà"}
                                    size="large"
                                    sx={{ marginTop: 10, marginLeft: 3, }}
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