import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './features/authentication/LoginPage'
import { ThemeProvider } from '@mui/material'
import { customTheme } from './styles/customTheme'
import MiniDrawer from './common/Navigation/Drawer'
import Dashboard from './features/dashboard/Dashboard'
import ApartmentList from './features/apartment/ApartmentList'
import BuildingList from './features/building/BuildingList'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './common/Navigation/ProjectedRoute'
import Box from '@mui/material/Box';
import Building from './features/building'
import BuildingDetail from './features/building/BuildingDetail'
import CreateEditBuilding from './features/building/CreateEditBuilding'
import Apartment from './features/apartment'
import CreateEditApartment from './features/apartment/CreateEditApartment'
import ApartmentDetail from './features/apartment/ApartmentDetail'
import Voucher from './features/voucher'
import CreateEditVoucher from './features/voucher/CreateEditVoucher'
import VoucherList from './features/voucher/VoucherList'
import Contract from './features/contract'
import ContractList from './features/contract/ContractList'
import Invoice from './features/invoice'
import InvoiceList from './features/invoice/InvoiceList'
import Request from './features/request'
import RequestList from './features/request/RequestList'
import Customer from './features/customer'
import Employee from './features/employee'
import Service from './features/buildingService'
import ServiceList from './features/buildingService/ServiceList'
import CreateEditService from './features/buildingService/CreateEditService'
import Property from './features/property'
import PropertyList from './features/property/PropertyList'
import CreateEditProperty from './features/property/CreateEditProperty'
import ComplexApartment from './features/complexApartment'
import ComplexApartmentList from './features/complexApartment/ComplexApartmentList'
import CreateEditComplexApartment from './features/complexApartment/CreateEditComplexApartment'
import ComplexApartmentDetail from './features/complexApartment/ComplexApartmentDetail'
import CreateEmployee from './features/employee/CreateEmployee'
import EmployeeList from './features/employee/EmployeeList'
import EditEmployeeDetail from './features/employee/EditEmployeeDetail'
import CustomerList from './features/customer/CustomerList'
import ContractDetail from './features/contract/ContractDetail'
import InvoiceDetail from './features/invoice/InvoiceDetail'
import Attendance from './features/attendance'
import AttendanceList from './features/attendance/AttendanceList'
import Notification from './features/notification'
import NotificationList from './features/notification/NotificationList'
import RequestDetail from './features/request/RequestDetail'
import CreateInvoiceForm2 from './features/invoice/CreateInvocieForm2'
import CreateInvoiceForm1 from './features/invoice/CreateInvoiceForm1'

function App() {

  return (
    <ThemeProvider theme={customTheme}>
      <Routes>
        <Route path='/' element={<Navigate to="/dashboard" />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={
          <ProtectedRoute>
            <Box>
              <MiniDrawer />
            </Box>
          </ProtectedRoute>
        }>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='buildings' element={<Building />} >
            <Route path='' element={<BuildingList />} />
            <Route path='add-building' element={<CreateEditBuilding />} />
            <Route path='edit-building/:id' element={<CreateEditBuilding isEdit />} />
            <Route path=':id' element={<BuildingDetail />} />
          </Route>
          <Route path='services' element={<Service />} >
            <Route path='' element={<ServiceList />} />
            <Route path='add-service' element={<CreateEditService/>} />
            <Route path='edit-service/:id' element={<CreateEditService isEdit />} />
            {/* <Route path=':id' element={<BuildingDetail />} /> */}
          </Route>
          <Route path='apartments' element={<Apartment />}>
            <Route path='' element={<ApartmentList isApartmentList />} />
            <Route path='add-apartment' element={<CreateEditApartment />} />
            <Route path='edit-apartment/:id' element={<CreateEditApartment isEdit />} />
            <Route path=':id' element={<ApartmentDetail />} />
          </Route>
          <Route path='complex-apartments' element={<ComplexApartment />}>
            <Route path='' element={<ComplexApartmentList isApartmentList />} />
            <Route path='add-apartment' element={<CreateEditComplexApartment />} />
            <Route path='edit-apartment/:id' element={<CreateEditComplexApartment isEdit />} />
            <Route path=':id' element={<ComplexApartmentDetail />} />
          </Route>
          <Route path='properties' element={<Property />}>
            <Route path='' element={<PropertyList />} />
            <Route path='add-property' element={<CreateEditProperty />} />
            <Route path='edit-property/:id' element={<CreateEditProperty isEdit />} />
            {/* <Route path=':id' element={<ApartmentDetail />} /> */}
          </Route>
          <Route path='vouchers' element={<Voucher />}>
            <Route path='' element={<VoucherList />} />
            <Route path='add-voucher' element={<CreateEditVoucher />} />
            <Route path='edit-voucher/:id' element={<CreateEditVoucher isEdit />} />
            {/* <Route path=':id' element={<ApartmentDetail />} /> */}
          </Route>
          <Route path='contracts' element={<Contract />}>
            <Route path='' element={<ContractList />} />
            <Route path=':id' element={<ContractDetail />} />
            <Route path=':id/add-invoice' element={<CreateInvoiceForm1 />} />
          </Route>
          <Route path='invoices' element={<Invoice />}>
            <Route path='' element={<InvoiceList />} />
            <Route path=':id' element={<InvoiceDetail />} />
            <Route path='add-invoice' element={<CreateInvoiceForm2 />} />
          </Route>
          <Route path='requests' element={<Request />}>
            <Route path='' element={<RequestList />} />
            <Route path=':id' element={<RequestDetail />} />
            <Route path=':id/add-invoice' element={<CreateInvoiceForm1 />} />
          </Route>
          <Route path='customers' element={<Customer />}>
            <Route path='' element={<CustomerList />} />
          </Route>
          <Route path='employee' element={<Employee />}>
            <Route path='' element={<EmployeeList />} />
            <Route path='add-employee' element={<CreateEmployee />} />
            <Route path='edit-employee/:accountId' element={<EditEmployeeDetail />} />
          </Route>
          <Route path='attendances' element={<Attendance />}>
            <Route path='' element={<AttendanceList />} />
          </Route>
          <Route path='notifications' element={<Notification />}>
            <Route path='' element={<NotificationList />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  )
}

export default App
