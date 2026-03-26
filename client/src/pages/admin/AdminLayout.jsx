import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout   from './AdminLayout';
import Overview      from './Overview';
import CarsAdmin     from './CarsAdmin';
import BookingsAdmin from './BookingsAdmin';
import CustomersAdmin from './CustomersAdmin';
import DriversAdmin  from './DriversAdmin';
import RevenueReport from './RevenueReport';

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  if (!user || user.role !== 'Admin') return <Navigate to="/" replace />;

  const TABS = {
    overview:  <Overview />,
    cars:      <CarsAdmin />,
    bookings:  <BookingsAdmin />,
    customers: <CustomersAdmin />,
    drivers:   <DriversAdmin />,
    reports:   <RevenueReport />,
  };

  const NAV = [
  { id: 'overview',    label: 'Overview',       icon: '▦' },
  { id: 'cars',        label: 'Cars',           icon: '🚗' },
  { id: 'bookings',    label: 'Bookings',       icon: '📋' },
  { id: 'customers',   label: 'Customers',      icon: '👤' },
  { id: 'drivers',     label: 'Drivers',        icon: '👨‍✈️' },
  { id: 'driver-apps', label: 'Applications',   icon: '📝' }, 
  { id: 'reports',     label: 'Revenue Report', icon: '📊' },
];

  return (
    <AdminLayout activeTab={tab} onTabChange={setTab}>
      <div className="fade-up">
        {TABS[tab] || <Overview />}
      </div>
    </AdminLayout>
  );
}
