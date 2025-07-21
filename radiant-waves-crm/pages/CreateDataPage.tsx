
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import { CustomerData } from '../types';

const CreateDataPage: React.FC = () => {
    const { currentUser, addCustomerData } = useAppContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<CustomerData>>({
        date: new Date().toISOString().split('T')[0],
        createdBy: currentUser?.userId,
        connectionType: 'Home',
        status: 'Interested',
    });
    const [locationStatus, setLocationStatus] = useState('Fetching location...');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setLocationStatus('Location fetched automatically.');
            },
            () => {
                setLocationStatus('Could not fetch location. Please enter manually.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readEvent) => {
          setFormData(prev => ({
            ...prev,
            billFile: { name: file.name, content: readEvent.target?.result as string }
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.customerName || !formData.mobile) {
            alert('Customer Name and Mobile Number are required.');
            return;
        }
        addCustomerData(formData as CustomerData);
        setSuccessMessage('Data saved successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
    };

    return (
        <Layout>
            <div className="container mx-auto max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Create Data Entry</h1>
                    <button onClick={() => navigate(-1)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
                        <i className="fa-solid fa-arrow-left mr-2"></i>Back
                    </button>
                </div>

                {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-8">
                    {/* Auto-fetched Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" value={formData.date} disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Created By</label>
                            <input type="text" value={formData.createdBy} disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-800">Customer Information</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
                                <input type="text" name="customerName" value={formData.customerName || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
                                <input type="tel" name="mobile" value={formData.mobile || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                    </fieldset>
                    
                    {/* Address */}
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-800">Address</legend>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="houseNo" placeholder="House/Building No" value={formData.houseNo || ''} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm"/>
                            <input type="text" name="place" placeholder="Place" value={formData.place || ''} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm"/>
                            <input type="text" name="city" placeholder="City" value={formData.city || ''} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm"/>
                            <input type="text" name="district" placeholder="District" value={formData.district || ''} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm"/>
                            <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode || ''} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm"/>
                            <input type="text" name="state" placeholder="State" value={formData.state || ''} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm"/>
                            <div className="md:col-span-2">
                                <input type="text" name="landmark" placeholder="Landmark" value={formData.landmark || ''} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                    </fieldset>

                     {/* Connection Details */}
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-800">Connection Details</legend>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type of Connection</label>
                                <select name="connectionType" value={formData.connectionType} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option>Home</option>
                                    <option>Commercial</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">KWA</label>
                                <input type="text" name="kwa" value={formData.kwa || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Electricity Bill (Image/PDF)</label>
                                <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
                                {formData.billFile && <p className="text-xs text-gray-500 mt-1">File attached: {formData.billFile.name}</p>}
                            </div>
                        </div>
                    </fieldset>

                    {/* Status & Location */}
                    <fieldset className="space-y-4">
                         <legend className="text-lg font-semibold text-gray-800">Status & Location</legend>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Customer Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option>Interested</option>
                                    <option>Appointment Fixed</option>
                                    <option>Not Interested</option>
                                </select>
                            </div>
                            {formData.status === 'Appointment Fixed' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Appointment Date & Time</label>
                                    <input type="datetime-local" name="appointmentDateTime" value={formData.appointmentDateTime || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                                </div>
                            )}
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <p className="text-xs text-gray-500 mb-2">{locationStatus}</p>
                                <div className="flex space-x-4">
                                    <input type="number" step="any" name="latitude" placeholder="Latitude" value={formData.latitude || ''} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm"/>
                                    <input type="number" step="any" name="longitude" placeholder="Longitude" value={formData.longitude || ''} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm"/>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                                <textarea name="remarks" value={formData.remarks || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                        </div>
                    </fieldset>
                    
                    <div className="flex justify-end pt-6 border-t">
                        <button type="submit" className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 flex items-center">
                            <i className="fa-solid fa-save mr-2"></i> Submit Data
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreateDataPage;
