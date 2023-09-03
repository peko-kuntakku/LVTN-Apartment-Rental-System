import { Color } from "../../../styles/GlobalStyles";

const labels = {
    boxWidth: 20,
    pointStyle: 'circle',
    usePointStyle: true,
    font: {
        size: 12,
    }
}

const layout = {
    padding: 30
}

export const pieOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
            align: 'center' as const,
            labels: labels,
        },
    },
    layout: layout,
};

export const doughnutOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
            align: 'center' as const,
            labels: labels,
        },
    },
    cutout: '65%',
    layout: layout,
};

export const backgroundColor = [
    Color.chart.primaryBg,
    Color.chart.warningBg,
    Color.chart.extraTextBg,
    Color.chart.successBg,
    Color.chart.errorBg,
];

export const borderColor = [
    Color.primary,
    Color.warning,
    Color.extraText,
    Color.success,
    Color.error,
];

export const barOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        // title: {
        //     display: true,
        //     text: 'Chart.js Bar Chart',
        // },
    },
}