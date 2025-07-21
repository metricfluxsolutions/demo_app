
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import { User, Role } from '../types';

const UserFormModal: React.FC<{ isOpen: boolean, onClose: () => void, userToEdit: User | null }> = ({ isOpen, onClose, userToEdit }) => {
    const { addUser, updateUser } = useAppContext();
    const [formData, setFormData] = useState<Partial<User>>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (userToEdit) {
            setFormData(userToEdit);
        } else {
            setFormData({
                role: Role.AGENT,
                joiningDate: new Date().toISOString().split('T')[0]
            });
        }
        setErrors({});
    }, [userToEdit, isOpen]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.staffName) newErrors.staffName = 'Staff name is required';
        if (!formData.designation) newErrors.designation = 'Designation is required';
        if (!formData.empId) newErrors.empId = 'Employee ID is required';
        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number';
        if (!formData.salary) newErrors.salary = 'Salary is required';
        if (!formData.userId) {
            newErrors.userId = 'User ID is required';
        } else if (formData.userId.length < 4) { // Simplified validation
            newErrors.userId = 'User ID must be at least 4 characters long.';
        }
        if (!userToEdit && !formData.password) { // Password required only for new users
            newErrors.password = 'Password is required';
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (userToEdit) {
                updateUser(formData as User);
            } else {
                addUser(formData as User);
            }
            onClose();
        }
    };
    
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'salary' ? Number(value) : value }));
    }

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{userToEdit ? 'Edit User' : 'Create New User'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Form fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Staff Name</label>
                        <input type="text" name="staffName" value={formData.staffName || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        {errors.staffName && <p className="text-red-500 text-xs mt-1">{errors.staffName}</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <input type="text" name="designation" value={formData.designation || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Emp ID</label>
                        <input type="text" name="empId" value={formData.empId || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        {errors.empId && <p className="text-red-500 text-xs mt-1">{errors.empId}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Joining Date</label>
                        <input type="date" name="joiningDate" value={formData.joiningDate || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input type="text" name="mobile" value={formData.mobile || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select name="role" value={formData.role || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option value={Role.ADMIN}>Admin</option>
                            <option value={Role.AGENT}>Agent</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Salary</label>
                        <input type="number" name="salary" value={formData.salary || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User ID</label>
                        <input type="text" name="userId" value={formData.userId || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Password {userToEdit && '(leave blank to keep unchanged)'}</label>
                        <input type="password" name="password" value={formData.password || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const UserManagementPage: React.FC = () => {
    const { users, deleteUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const handleCreate = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleDelete = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(userId);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                    <button onClick={handleCreate} className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 flex items-center">
                        <i className="fa-solid fa-plus mr-2"></i> Create User
                    </button>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.staffName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.empId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === Role.ADMIN ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobile}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900"><i className="fa-solid fa-pen-to-square"></i></button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900"><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userToEdit={userToEdit} />
        </Layout>
    );
};

export default UserManagementPage;
