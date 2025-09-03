import React, { useState } from 'react';
import { User, Home, FileText, Truck, Phone } from 'lucide-react';

const DriverProfileForm = ({ initialData, onSubmit, isLoading, submitButtonText }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        address: initialData?.address || '',
        licenseNumber: initialData?.licenseNumber || '',
        vehicleType: initialData?.vehicleType || 'Bike',
        vehicleNumber: initialData?.vehicleNumber || '',
        phone: initialData?.phone || '',
        gender: initialData?.gender || 'Male',
        experience: initialData?.experience || 0,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 p-2 border rounded-md" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700">Full Address</label>
                <div className="relative mt-1">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 p-2 border rounded-md" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700">Driving License Number</label>
                 <div className="relative mt-1">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="w-full pl-10 p-2 border rounded-md" required />
                </div>
            </div>


 {/* Naye Fields */}
            <div>
                <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 p-2 border rounded-md" required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Experience (Years)</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
                </div>
            </div>


            <div>
                <label className="block text-sm font-semibold text-gray-700">Vehicle Type</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                    <option value="Bike">Bike</option>
                    <option value="Small Truck">Small Truck</option>
                    <option value="Large Truck">Large Truck</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700">Vehicle Number</label>
                 <div className="relative mt-1">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full pl-10 p-2 border rounded-md" placeholder="e.g., DL 1AB 1234" required />
                </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50">
                {isLoading ? 'Saving...' : submitButtonText}
            </button>
        </form>
    );
};

export default DriverProfileForm;