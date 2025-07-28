import { getCurrentUser } from '@/lib/user';
import React from 'react'
interface DashboardLayoutProps {
  children: React.ReactElement;
  patientcard: React.ReactElement;
  medicalrecords: React.ReactElement;
  accessLog: React.ReactElement;
}
function DashboardLayout({
  children,
  medicalrecords,
  patientcard,
}:DashboardLayoutProps ) {
    const patient = await getCurrentUser()
  return (
    <div>
      {children}
      {patientcard  patient=patient }
      {medicalrecords}
    </div>
  );
}

export default DashboardLayout
