import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout   from './AdminLayout';
import Overview      from './Overview';
import CarsAdmin     from './CarsAdmin';
import BookingsAdmin from './BookingsAdmin';
import CustomersAdmin from './CustomersAdmin';
import DriversAdmin  from './DriversAdmin';
import DriverApplications from './DriverApplications';
import RevenueReport from './RevenueReport';

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  if (!user || user.role !== 'Admin') return <Navigate to="/" replace />;

  const TABS = {
  overview:     <Overview />,
  cars:         <CarsAdmin />,
  bookings:     <BookingsAdmin />,
  customers:    <CustomersAdmin />,
  drivers:      <DriversAdmin />,
 'driver-apps': <DriverApplications />,
  reports:      <RevenueReport />,
};

  return (
    <AdminLayout activeTab={tab} onTabChange={setTab}>
      <div className="fade-up">
        {TABS[tab] || <Overview />}
      </div>
    </AdminLayout>
  );
}
