import {
    Typography, Stepper, Step, StepLabel
} from "@mui/material";
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import BackButton from "../../common/StyledComponents/BackButton";
import CreateAccountForm from "./Components/CreateAccountForm";
import { useEffect, useState } from "react";
import EmployeeDetailForm from "./Components/EmployeeDetailForm";

interface FormProps {

}

const steps = [
    'Tạo tài khoản nhân viên',
    'Thêm thông tin chi tiết',
];

export default function CreateEmployee({ }: FormProps) {
    const currentUser = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [accountId, setAccountId] = useState<number>();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleUpdateId = (id: number) => {
        setAccountId(id);
    };

    useEffect(() => {
        if (activeStep === 2) {
            navigate(-1);
        }
    }, [activeStep])

    return (
        <Root>
            <BackButton />
            <Typography variant="h6" fontWeight="600"></Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {
                activeStep === 0 &&
                <CreateAccountForm updateStep={handleNext}  updateAccountId={handleUpdateId} />
            }
            {
                (activeStep === 1 && accountId) &&
                <EmployeeDetailForm updateStep={handleNext} accountId={accountId} />
            }
        </Root>
    );
}