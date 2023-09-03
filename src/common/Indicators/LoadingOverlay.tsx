import { CircularProgress } from "@mui/material";
import Center from "../StyledComponents/Center";

export default function LoadingOverlay() {
    return (
        <Center sx={{
            backgroundColor: 'rgba(16, 24, 40, 0.25)',
            zIndex: 2,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        }}>
            <CircularProgress />
        </Center>
    );
}