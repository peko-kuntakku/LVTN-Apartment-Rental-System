import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import buildingApi from "../../api/buildingApi";
import { getBuildingInitialValue } from "../../utils/buildingUtils";
import BuildingForm from "./Components/BuildingForm";

interface Props {
    isEdit?: boolean,
}

const initialValue = {
    buildingName: '',
    numOfFloors: '',
    description: '',
    province: '',
    district: '',
    ward: '',
    addressDetail: '',
    imageUrl: '',
    latitude: '',
    longtitude: '',
}

export default function CreateEditBuilding({ isEdit }: Props) {
    const { id } = useParams();

    const { data: buildingDetail } = useQuery(['buildingDetailForm', id], async ({ signal }) => {
        if (id) {
            return await buildingApi.getBuildingDetail(parseInt(id));
        }
    }, {
        enabled: !!isEdit,
        select: (res: any) => {
            return getBuildingInitialValue(res.data);
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
                        (buildingDetail && id) &&
                        <BuildingForm
                            isEdit
                            title={"Cập nhật thông tin"}
                            initialValue={buildingDetail}
                            id={parseInt(id)}
                        />
                    )
                    :
                    <BuildingForm
                        title={"Thêm tòa nhà"}
                        initialValue={initialValue}
                    />
            }

        </>
    );
}