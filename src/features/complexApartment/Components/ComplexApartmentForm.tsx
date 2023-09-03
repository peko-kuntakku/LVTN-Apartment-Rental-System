import { useState } from "react";
import {
    Typography, Box,
    FormControl, InputLabel, Select, SelectChangeEvent,
    MenuItem, Stack,
} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';
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
import { getField, handleSubmitImg } from "../../../utils/utils";
import { transformBuildingNameData } from "../../../utils/buildingUtils";
import { numberOfFloors } from "../../building/Components/BuildingForm";
import apartmentApi from "../../../api/apartmentApi";
import { ComplexApartmentFormInitialValue } from "../../../model/Apartment";
import BackButton from "../../../common/StyledComponents/BackButton";

const complexApartmentValidationSchema = yup.object().shape({
    apartmentName: yup
        .string()
        .required('Bạn chưa nhập tên căn hộ.'),
    buildingName: yup
        .string()
        .required('Bạn chưa chọn toà nhà.'),
    floor: yup
        .string()
        .required('Bạn chưa chọn tầng.'),
    description: yup
        .string()
        .min(30, ({ min }) => `Mô tả gồm tối thiểu ${min} kí tự.`)
        .required('Bạn chưa nhập mô tả.'),
})

interface FormProps {
    isEdit?: boolean,
    title: string,
    initialValue: ComplexApartmentFormInitialValue,
    id?: number,
}

export default function ComplexApartmentForm({ isEdit, title, initialValue, id }: FormProps) {
    const currentUser = useAppSelector(selectCurrentUser);
    const queryClient = useQueryClient();
    const [previewImgUrl, setPreviewImgUrl] = useState<string>();
    const [file, setFile] = useState<any>();
    const navigate = useNavigate();
    const [selectedFloor, setSelectedFloor] = useState<number>(parseInt(getField(initialValue.buildingName)[2]));

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

    const { isLoading: isMutating, mutate: mutate } = useMutation(
        async (data: ComplexApartmentFormInitialValue) => {
            if (currentUser?.jwt) {
                if (file) {
                    const url = await handleSubmitImg(file, `apartments/${data.apartmentName}-image`) as string;
                    data.imageUrl = url;
                }

                if (isEdit && id) {
                    return await apartmentApi.updateComplexApartment(
                        currentUser.jwt,
                        id,
                        data,
                    );
                } else {
                    return await apartmentApi.createComplexApartment(
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
                    toast.success('Tạo căn hộ thành công.');
                }
            },
            onError: (err) => {
                toast.error('Lỗi');
                console.log(err);
            },
            onSettled: () => {
                queryClient.invalidateQueries('complex-apartments')
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
                    validationSchema={complexApartmentValidationSchema}
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
                                            name="apartmentName"
                                            label="Tên căn hộ"
                                            placeholder="Tên căn hộ"
                                            sx={{ marginBottom: 5 }}
                                        />

                                        <Grid2 container>
                                            <Grid2 xs={6} m={0} p={0}>
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                    error={Boolean(errors.buildingName) && touched.buildingName}
                                                >
                                                    <InputLabel>Tòa nhà</InputLabel>
                                                    <Select
                                                        label="Tòa nhà"
                                                        value={values.buildingName}
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('floor')('');
                                                            setSelectedFloor(parseInt(getField(event.target.value)[2]))
                                                            handleChange('buildingName')(event.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Tòa nhà</em>
                                                        </MenuItem>
                                                        {buildings.isSuccess && buildings.data.map((ele: any) =>
                                                            <MenuItem value={`${ele.id}-${ele.name}-${ele.floors}`} key={ele.id}>{ele.name}</MenuItem>
                                                        )}
                                                    </Select>
                                                    {(errors.buildingName && touched.buildingName) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.buildingName}
                                                        />
                                                    }
                                                </FormControl>
                                            </Grid2>
                                            <Grid2 xs={6} m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <FormControl sx={{ width: '90%', marginBottom: 5 }}
                                                    error={Boolean(errors.floor) && touched.floor}
                                                >
                                                    <InputLabel>Tầng</InputLabel>
                                                    <Select
                                                        label="Tầng"
                                                        value={values.floor}
                                                        onChange={(event: SelectChangeEvent) => {
                                                            handleChange('floor')(event.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Tầng</em>
                                                        </MenuItem>
                                                        {selectedFloor &&
                                                            numberOfFloors.filter(ele => ele <= selectedFloor)
                                                                .map(ele =>
                                                                    <MenuItem value={ele.toString()} key={ele}>{ele}</MenuItem>
                                                                )
                                                        }
                                                    </Select>
                                                    {(errors.floor && touched.floor) &&
                                                        <ErrorMessage ml={2}
                                                            message={errors.floor}
                                                        />
                                                    }
                                                </FormControl>
                                            </Grid2>
                                        </Grid2>

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
                                                <img
                                                    src={previewImgUrl}
                                                    loading="lazy"
                                                    style={{ objectFit: 'contain', width: '300px', height: '300px' }}
                                                />
                                            </>
                                        }
                                    </Stack>
                                </Grid2>
                                <Grid2 sm={12} md={6}>
                                    <Field
                                        component={CustomTextField}
                                        name="description"
                                        label="Mô tả"
                                        placeholder="Mô tả"
                                        multiline
                                        rows={5}
                                        sx={{ marginBottom: 5 }}
                                    />
                                </Grid2>
                                <CustomButton
                                    buttonName={isEdit ? 'Cập nhật' : "Thêm căn hộ"}
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