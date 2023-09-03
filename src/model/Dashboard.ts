export interface DashboardBuildingModel {
    allBuildings: number,
    apartmentsByLocation: apartmentsByLocationModel[],
}

interface apartmentsByLocationModel {
    location: string,
    apartments: number,
}

export interface DashboardApartmentModel {
    total: number,
    apartmentsByStatus: ChartDataModel[],
}

export interface ChartDataModel {
    label: string,
    value: number,
}

export interface DashboardCustomerModel {
    total: number,
    customersByStatus: ChartDataModel[],
}

export interface DashboardRevenueInMonthModel {
    total: number,
    chartData: ChartDataModel[],
}