import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/Login';
import { AdminLayout } from './mainLayout/Layout';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import Settings from './Pages/Settings';
import Reports from './Pages/Reports';
import WorkPlaces from './Pages/WorkPlaces';
import Departments from './Pages/Departments';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import SignUp from './Pages/SignUp';
import { LoadingProvider } from './context/LoadingContext';
import UserDetails from './Pages/UserDetails';
import ReportDetails from './Pages/ReportDetails';
import Regions from './Pages/Regions';
import CreateReport from './Pages/CreateReport';
import EditReport from './Pages/EditReport';
import CreateUser from './Pages/CreateUser';
import EditUser from './Pages/EditUser';
import CreateDepartment from './Pages/CreateDepartment';
import EditDepartment from './Pages/EditDepartment';
import CreateWorkPlace from './Pages/CreateWorkPlace';
import EditWorkPlace from './Pages/EditWorkPlace';
import CreateRegion from './Pages/CreateRegion';
import EditRegion from './Pages/EditRegion';

function App() {
  return (
    <LoadingProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Routes>
                    {/* Barcha rollar uchun */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Faqat admin va super_admin uchun */}
                    <Route
                      path="/departments"
                      element={
                        <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
                          <Departments />
                        </RoleBasedRoute>
                      }
                    />

                    {/* Faqat super_admin uchun */}
                    <Route
                      path="/users"
                      element={
                        <RoleBasedRoute allowedRoles={['super_admin']}>
                          <Users />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/workplaces"
                      element={
                        <RoleBasedRoute allowedRoles={['super_admin']}>
                          <WorkPlaces />
                        </RoleBasedRoute>
                      }
                    />
                  </Routes>
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <RoleBasedRoute allowedRoles={['super_admin']}>
                <UserDetails />
              </RoleBasedRoute>
            }
          />
          <Route path="/reports/:id" element={<ReportDetails />} />
          <Route
            path="/regions"
            element={
              <RoleBasedRoute allowedRoles={['super_admin']}>
                <Regions />
              </RoleBasedRoute>
            }
          />
          <Route path="/reports/create" element={<CreateReport />} />
          <Route path="/reports/edit/:id" element={<EditReport />} />
          <Route
            path="/users/create"
            element={
              <RoleBasedRoute allowedRoles={['super_admin']}>
                <CreateUser />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <RoleBasedRoute allowedRoles={['super_admin']}>
                <EditUser />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/departments/create"
            element={
              <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
                <CreateDepartment />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/departments/edit/:id"
            element={
              <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
                <EditDepartment />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/workplaces/create"
            element={
              <RoleBasedRoute allowedRoles={['super_admin']}>
                <CreateWorkPlace />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/workplaces/edit/:id"
            element={
              <RoleBasedRoute allowedRoles={['super_admin']}>
                <EditWorkPlace />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/regions/create"
            element={
              <RoleBasedRoute allowedRoles={['super_admin']}>
                <CreateRegion />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/regions/edit/:id"
            element={
              <RoleBasedRoute allowedRoles={['super_admin']}>
                <EditRegion />
              </RoleBasedRoute>
            }
          />
        </Routes>
      </Router>
    </LoadingProvider>
  );
}

export default App;

