import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../Inputs/CustomButton";

export default function BackButton() {
    const navigate = useNavigate();
    return (
        <CustomButton
            buttonName="Quay lại"
            size="small"
            startIcon={<ArrowBack />}
            variant='text'
            fullWidth={false}
            onClick={() => navigate(-1)}
            sx={{ marginBottom: 2 }}
        />
    );
}