import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apartmentApi from "../../api/apartmentApi";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { useAppSelector } from "../../app/hooks";
import { ComplexApartmentFormInitialValue } from "../../model/Apartment";
import { getComplexApartmentInitialValue } from "../../utils/apartmentUtils";
import ComplexApartmentForm from "./Components/ComplexApartmentForm";

interface Props {
    isEdit?: boolean,
}

const initialValue: ComplexApartmentFormInitialValue = {
    apartmentName: '',
    buildingName: '',
    floor: '',
    description: '',
    imageUrl: '',
}

export default function CreateEditComplexApartment({ isEdit }: Props) {
    const { id } = useParams();
    const currentUser = useAppSelector(selectCurrentUser);

    const { data: apartmentDetail } = useQuery(['apartmentDetailForm', id], async ({ signal }) => {
        if (id && currentUser?.jwt) {
            return await apartmentApi.getApartmentDetail(currentUser.jwt, parseInt(id));
        }
    }, {
        enabled: !!isEdit,
        select: (res: any) => {        
            return getComplexApartmentInitialValue(res.data);
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
        refetchOnMount: true,
        cacheTime: 0,
    });

    return (
        <>
            {
                isEdit
                    ?
                    (
                        (apartmentDetail && id) &&
                        <ComplexApartmentForm
                            isEdit
                            title={"Cập nhật thông tin"}
                            initialValue={apartmentDetail}
                            id={parseInt(id)}
                        />
                    )
                    :
                    <ComplexApartmentForm
                        title={"Thêm căn hộ"}
                        initialValue={initialValue}
                    />
            }

        </>
    );
}