
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import { Role } from '../types';

const ReportPage: React.FC = () => {
    const { currentUser, customerData, users } = useAppContext();
    const isAdmin = currentUser?.role === Role.ADMIN;

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        userId: 'all',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredData = useMemo(() => {
        return customerData.filter(item => {
            const itemDate = new Date(item.date);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;
            
            if (startDate) {
                startDate.setHours(0,0,0,0);
                if(itemDate < startDate) return false;
            }

            if (endDate) {
                endDate.setHours(23,59,59,999);
                if(itemDate > endDate) return false;
            }

            if (isAdmin && filters.userId !== 'all' && item.createdBy !== filters.userId) return false;
            if (!isAdmin && item.createdBy !== currentUser?.userId) return false;
            
            return true;
        });
    }, [customerData, filters, isAdmin, currentUser]);

    return (
        <Layout>
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Data Report</h1>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        {isAdmin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Filter by User</label>
                                <select name="userId" value={filters.userId} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="all">All Users</option>
                                    {users.filter(u => u.role === Role.AGENT).map(user => (
                                        <option key={user.id} value={user.userId}>{user.staffName} ({user.userId})</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mobile}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        item.status === 'Interested' ? 'bg-blue-100 text-blue-800' :
                                        item.status === 'Appointment Fixed' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {item.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.createdBy}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                             {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">No data found for the selected filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default ReportPage;
