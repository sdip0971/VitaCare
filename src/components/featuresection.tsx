import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
function Featuresection() {
  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose VitaCare?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to meet the needs of patients, healthcare
              providers, and hospital administrators with powerful features and
              intuitive interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Secure Record Management
              </h3>
              <p className="text-gray-600">
                Store all your medical records in one secure location with
                granular access controls and complete audit trails.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Seamless Collaboration
              </h3>
              <p className="text-gray-600">
                Enable efficient communication between patients and healthcare
                providers with real-time information sharing.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tailored for Everyone
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              VitaCare provides specialized dashboards and functionality for
              different user roles in the healthcare ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Patients */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-blue-700 mb-4">
                For Patients
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  View complete medical history
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Control privacy settings
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Manage access requests
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Schedule appointments
                </li>
              </ul>
              <Link href="/auth?tab=register&role=patient">
                <Button className="w-full mt-6" variant="outline">
                  Register as Patient
                </Button>
              </Link>
            </div>

            {/* For Doctors */}
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-sm border border-green-100">
              <h3 className="text-xl font-bold text-green-700 mb-4">
                For Doctors
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Request patient records
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Manage appointments
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Create medical records
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Search patient database
                </li>
              </ul>
              <Link href="/auth?tab=register&role=doctor">
                <Button className="w-full mt-6" variant="outline">
                  Register as Doctor
                </Button>
              </Link>
            </div>

            {/* For Administrators */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-sm border border-purple-100">
              <h3 className="text-xl font-bold text-purple-700 mb-4">
                For Administrators
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-purple-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Manage staff accounts
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-purple-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Monitor system access
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-purple-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  View analytics dashboard
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-purple-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Configure system settings
                </li>
              </ul>
              <Link href="/auth?tab=register&role=admin">
                <Button className="w-full mt-6" variant="outline">
                  Register as Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Featuresection;