import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apartmentApi from "../../api/apartmentApi";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { useAppSelector } from "../../app/hooks";
import { ApartmentFormInitialValue } from "../../model/Apartment";
import { getApartmentInitialValue } from "../../utils/apartmentUtils";
import ApartmentForm from "./Components/ApartmentForm";

interface Props {
    isEdit?: boolean,
}

const initialValue: ApartmentFormInitialValue = {
    apartmentName: '',
    size: '',
    capacity: '',
    rentalFee: '',
    buildingName: '',
    floor: '',
    livingroom: 0,
    bedroom: 0,
    restroom: 0,
    kitchen: 0,
    description: '',
    imageUrl: '',
    status: undefined,
    complexApartment: '',
}

export default function CreateEditApartment({ isEdit }: Props) {
    const { id } = useParams();
    const currentUser = useAppSelector(selectCurrentUser);

    const { data: apartmentDetail } = useQuery(['apartmentDetailForm', id], async ({ signal }) => {
        if (id && currentUser?.jwt) {
            return await apartmentApi.getApartmentDetail(currentUser.jwt, parseInt(id));
        }
    }, {
        enabled: !!isEdit,
        select: (res: any) => {                    
            return getApartmentInitialValue(res.data);
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
                        <ApartmentForm
                            isEdit
                            title={"Cập nhật thông tin"}
                            initialValue={apartmentDetail}
                            // initialValue={initialValue}
                            id={parseInt(id)}
                        />
                    )
                    :
                    <ApartmentForm
                        title={"Thêm căn hộ"}
                        initialValue={initialValue}
                    />
            }

        </>
    );
}