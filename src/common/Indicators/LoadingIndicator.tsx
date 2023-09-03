import CircularProgress from "@mui/material/CircularProgress"
import Center from "../StyledComponents/Center"

export default function LoadingIndicator() {
    return (
        <Center mt={3} mb={3}>
            <CircularProgress />
        </Center>
    )
}