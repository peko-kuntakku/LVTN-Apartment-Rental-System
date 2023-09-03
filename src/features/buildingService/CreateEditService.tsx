import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import serviceApi from "../../api/serviceApi";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { useAppSelector } from "../../app/hooks";
import { getServiceInitialValue } from "../../utils/serviceUtils";
import ServiceForm from "./Components/ServiceForm";

interface Props {
    isEdit?: boolean,
}

const initialValue = {
    serviceName: '',
    isCharged: true,
    type: 1,
    building: '',
    description: '',
    price: undefined,
    unit: '',
}

export default function CreateEditService({ isEdit }: Props) {
    const { id } = useParams();
    const currentUser = useAppSelector(selectCurrentUser);

    const { data: serviceDetail } = useQuery(['serviceDetailForm', id], async ({ signal }) => {
        if (id && currentUser?.jwt) {
            return await serviceApi.getServiceDetail(currentUser.jwt, parseInt(id));
        }
    }, {
        enabled: !!id,
        select: (res: any) => {        
            return getServiceInitialValue(res.data)
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
                        (serviceDetail && id) &&
                        <ServiceForm
                            isEdit
                            title={"Cập nhật dịch vụ"}
                            initialValue={serviceDetail}
                            id={parseInt(id)}
                        />
                    )
                    :
                    <ServiceForm
                        title={"Thêm dịch vụ"}
                        initialValue={initialValue}
                    />
            }

        </>
    );
}