import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import propertyApi from "../../api/propertyApi";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { useAppSelector } from "../../app/hooks";
import { PropertyFormInitialValue } from "../../model/Property";
import { getPropertyInitialValue } from "../../utils/propertyUtils";
import PropertyForm from "./Components/PropertyForm";

interface Props {
    isEdit?: boolean,
}

const initialValue: PropertyFormInitialValue = {
    propertyName: '',
    quantity: 1,
    price: 0,
    type: '',
    apartment: '',
    description: '',
}

export default function CreateEditProperty({ isEdit }: Props) {
    const { id } = useParams();
    const currentUser = useAppSelector(selectCurrentUser);

    const { data: propertyDetail } = useQuery(['propertyDetailForm', id], async ({ signal }) => {
        if (id && currentUser?.jwt) {
            return await propertyApi.getPropertyDetail(currentUser.jwt, parseInt(id));
        }
    }, {
        enabled: !!id,
        select: (res: any) => {                    
            return getPropertyInitialValue(res.data)
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        staleTime: 500,
        cacheTime: 0,
    });

    return (
        <>
            {
                isEdit
                    ?
                    (
                        (propertyDetail && id) &&
                        <PropertyForm
                            isEdit
                            title={"Cập nhật nội thất"}
                            initialValue={propertyDetail}
                            id={parseInt(id)}
                        />
                    )
                    :
                    <PropertyForm
                        title={"Thêm nội thất"}
                        initialValue={initialValue}
                    />
            }

        </>
    );
}