import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import voucherApi from "../../api/voucherApi";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { useAppSelector } from "../../app/hooks";
import { getVoucherInitialValue } from "../../utils/voucherUtils";
import VoucherForm from "./Components/VoucherForm";


interface Props {
    isEdit?: boolean,
}

const initialValue = {
    voucherName: '',
    startAt: new Date(),
    expiredAt: new Date(),
    amount: 0,
    percentage: undefined,
    maxDiscount: 0,
    apartments: [],
}

export default function CreateEditVoucher({ isEdit }: Props) {
    const { id } = useParams();
    const currentUser = useAppSelector(selectCurrentUser);

    const { data: voucherDetail } = useQuery(['voucherDetailForm', id], async ({ signal }) => {
        if (id && currentUser?.jwt) {
            return await voucherApi.getVoucherDetail(currentUser.jwt, parseInt(id));
        }
    }, {
        enabled: !!id,
        select: (res: any) => {        
            return getVoucherInitialValue(res.data);
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        cacheTime: 0,
    });

    return (
        <>
            {
                isEdit
                    ?
                    (
                        (voucherDetail && id) &&
                        <VoucherForm
                            isEdit
                            title={"Cập nhật mã giảm giá"}
                            initialValue={voucherDetail}
                            id={parseInt(id)}
                        />
                    )
                    :
                    <VoucherForm
                        title={"Thêm mã giảm giá"}
                        initialValue={initialValue}
                    />
            }

        </>
    );
}