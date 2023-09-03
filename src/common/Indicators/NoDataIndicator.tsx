import Typography from "@mui/material/Typography";
import { Color } from "../../styles/GlobalStyles";
import Center from "../StyledComponents/Center";

export default function NoDataIndicator() {
    return (
        <Center m={3}>
            <Typography color={Color.extraText} variant="body1">Không có dữ liệu</Typography>
        </Center>
    );
}