import { Root } from "../../common/StyledComponents/ItemList";
import DashboardGroupOne from "./Groups/DashboardGroupOne";
import DashboardGroupTwo from "./Groups/Group2/DashboardGroupTwo";

export default function Dashboard() {
    return (
        <Root>
            <DashboardGroupOne />
            <DashboardGroupTwo />
        </Root>
    );
}