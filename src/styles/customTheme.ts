import { createTheme } from "@mui/material";
import { Color } from "./GlobalStyles";
import { viVN } from '@mui/material/locale';

declare module '@mui/material/styles' {
    interface TypographyVariants {
        displayLg: React.CSSProperties;
        displayMd: React.CSSProperties;
        displaySm: React.CSSProperties;
        textXl: React.CSSProperties;
        textLg: React.CSSProperties;
        textMd: React.CSSProperties;
        textSm: React.CSSProperties;
        textXs: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        displayLg?: React.CSSProperties;
        displayMd: React.CSSProperties;
        displaySm: React.CSSProperties;
        textXl: React.CSSProperties;
        textLg: React.CSSProperties;
        textMd: React.CSSProperties;
        textSm: React.CSSProperties;
        textXs: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        displayLg: true;
        displayMd: true;
        displaySm: true;
        textXl: true;
        textLg: true;
        textMd: true;
        textSm: true;
        textXs: true;
    }
}

export const customTheme = createTheme(
    {
        typography: {
            displayLg: {
                fontSize: 48,
            },
            displayMd: {
                fontSize: 36
            },
            displaySm: {
                fontSize: 24
            },
            textXl: {
                fontSize: 20
            },
            textLg: {
                fontSize: 18
            },
            textMd: {
                fontSize: 16
            },
            textSm: {
                fontSize: 14
            },
            textXs: {
                fontSize: 12
            },
        },
        palette: {
            primary: {
                main: Color.primary,
            },
            error: {
                main: Color.error,
            },
            background: {
                default: Color.bodyBgColor,
            }
        }
    },
    viVN,
);