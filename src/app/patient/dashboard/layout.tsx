import React, { ReactElement } from "react";

interface DashboardLayoutProps {
  children: ReactElement;
  patientcard: ReactElement;
  medicalrecords: ReactElement;
  accesslog: ReactElement;
}

export default function DashboardLayout({
  children,
  medicalrecords,
  patientcard,
  accesslog,
}: DashboardLayoutProps) {
  return (
    <div className="container w-full mx-auto p-4">
      <div className="w-full">{patientcard}</div>
      <div className="grid  md:grid-row-3 gap-4">
        <div className="md:col-span-2">
          {/* Main content and other slots will go here */}

          <div className="mt-4 flex w-full gap-4">
            <div className="w-1/2">{medicalrecords}</div>
            <div className="w-1/2">{accesslog}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
