import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PricingPage from './prize';
import {
    ArrowLeft, Plus, Trash2, MapPin, Package,
    Upload, X, ArrowRight, ChevronDown, ChevronUp
} from 'lucide-react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from '../routes/RoutingMachine';
import { useAuth } from '../context/AuthContext';

const MapUpdater = ({ locations }) => {
    const map = useMap();
    useEffect(() => {
        const validLocations = locations.filter(loc => loc.lat && loc.lng);
        if (validLocations.length > 0) {
            const bounds = L.latLngBounds(validLocations.map(loc => [loc.lat, loc.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [locations, map]);
    return null;
};

const SchedulePickup = ({ onBack }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation(); // Added to access navigation state
    const [pickupLocations, setPickupLocations] = useState([{ id: 1, address: '', name: '', phone: '', items: [], lat: null, lng: null }]);
    const [dropLocations, setDropLocations] = useState([{ id: 1, address: '', name: '', phone: '', itemIds: [], lat: null, lng: null }]);
    const [items, setItems] = useState([]);
    const [nextItemId, setNextItemId] = useState(1);
    const [nextPickupId, setNextPickupId] = useState(2);
    const [nextDropId, setNextDropId] = useState(2);
    const [activePickupId, setActivePickupId] = useState(1);
    const [activeDropId, setActiveDropId] = useState(1);
    const [showAllPickups, setShowAllPickups] = useState(false);
    const [showAllDrops, setShowAllDrops] = useState(false);
    const [showPricing, setShowPricing] = useState(false);

    // Handle redirect from login to show pricing page
    useEffect(() => {
        if (location.state?.showPricing) {
            setShowPricing(true);
        }
    }, [location.state]);

    const handleBackNavigation = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/');
        }
    };

    const geocodeAddress = async (locationId, address, type) => {
        if (!address || address.length < 5) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newCoords = { lat: parseFloat(lat), lng: parseFloat(lon) };
                if (type === 'pickup') {
                    setPickupLocations(prev => prev.map(loc => loc.id === locationId ? { ...loc, ...newCoords } : loc));
                } else {
                    setDropLocations(prev => prev.map(loc => loc.id === locationId ? { ...loc, ...newCoords } : loc));
                }
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    };

    useEffect(() => {
        const activeLocation = pickupLocations.find(p => p.id === activePickupId);
        if (activeLocation && activeLocation.address) {
            const handler = setTimeout(() => {
                geocodeAddress(activeLocation.id, activeLocation.address, 'pickup');
            }, 1500);
            return () => clearTimeout(handler);
        }
    }, [pickupLocations.find(p => p.id === activePickupId)?.address, activePickupId]);

    useEffect(() => {
        const activeLocation = dropLocations.find(d => d.id === activeDropId);
        if (activeLocation && activeLocation.address) {
            const handler = setTimeout(() => {
                geocodeAddress(activeLocation.id, activeLocation.address, 'drop');
            }, 1500);
            return () => clearTimeout(handler);
        }
    }, [dropLocations.find(d => d.id === activeDropId)?.address, activeDropId]);

    const addItem = (pickupLocationId) => { const newItem = { id: nextItemId, pickupLocationId, name: '', weight: '', size: '', image: null, dropLocationId: null }; setItems([...items, newItem]); setNextItemId(nextItemId + 1); };
    const updateItem = (itemId, field, value) => { setItems(items.map(item => item.id === itemId ? { ...item, [field]: value } : item)); };
    const deleteItem = (itemId) => { setItems(items.filter(item => item.id !== itemId)); setDropLocations(dropLocations.map(loc => ({ ...loc, itemIds: loc.itemIds.filter(id => id !== itemId) }))); };
    const addPickupLocation = () => { const newLocation = { id: nextPickupId, address: '', name: '', phone: '', items: [], lat: null, lng: null }; setPickupLocations([...pickupLocations, newLocation]); setActivePickupId(nextPickupId); setNextPickupId(nextPickupId + 1); };
    const updatePickupLocation = (locationId, field, value) => { setPickupLocations(pickupLocations.map(loc => loc.id === locationId ? { ...loc, [field]: value } : loc)); };
    const deletePickupLocation = (locationId) => { if (pickupLocations.length > 1) { const itemsToDelete = items.filter(item => item.pickupLocationId === locationId); itemsToDelete.forEach(item => deleteItem(item.id)); const newPickupLocations = pickupLocations.filter(loc => loc.id !== locationId); setPickupLocations(newPickupLocations); if (activePickupId === locationId) { setActivePickupId(newPickupLocations[0]?.id || null) } } };
    const addDropLocation = () => { const newLocation = { id: nextDropId, address: '', name: '', phone: '', itemIds: [], lat: null, lng: null }; setDropLocations([...dropLocations, newLocation]); setActiveDropId(nextDropId); setNextDropId(nextDropId + 1); };
    const updateDropLocation = (locationId, field, value) => { setDropLocations(dropLocations.map(loc => loc.id === locationId ? { ...loc, [field]: value } : loc)); };
    const deleteDropLocation = (locationId) => { if (dropLocations.length > 1) { setItems(items.map(item => item.dropLocationId === locationId ? { ...item, dropLocationId: null } : item)); const newDropLocations = dropLocations.filter(loc => loc.id !== locationId); setDropLocations(newDropLocations); if (activeDropId === locationId) { setActiveDropId(newDropLocations[0]?.id || null) } } };
    const assignItemToDropLocation = (itemId, dropLocationId) => { setItems(items.map(item => item.id === itemId ? { ...item, dropLocationId: parseInt(dropLocationId) } : item)); };
    const handleImageUpload = (itemId, file) => { if (file && file.type.startsWith('image/')) { const reader = new FileReader(); reader.onloadend = () => updateItem(itemId, 'image', reader.result); reader.readAsDataURL(file); } };
    const getItemsForPickupLocation = (locationId) => items.filter(item => item.pickupLocationId === locationId);
    const getItemsForDropLocation = (locationId) => items.filter(item => item.dropLocationId === locationId);

    const displayedPickups = showAllPickups ? pickupLocations : pickupLocations.slice(0, 2);
    const displayedDrops = showAllDrops ? dropLocations : dropLocations.slice(0, 2);
    const allWaypoints = [
        ...pickupLocations.map((loc, index) => ({ ...loc, type: 'pickup', index: index + 1 })).filter(loc => loc.lat && loc.lng),
        ...dropLocations.map((loc, index) => ({ ...loc, type: 'drop', index: index + 1 })).filter(loc => loc.lat && loc.lng)
    ];

    if (showPricing) {
        return <PricingPage
            pickupLocations={pickupLocations}
            dropLocations={dropLocations}
            items={items}
            onBack={() => setShowPricing(false)}
        />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-purple-900 to-black text-white p-6">
                <div className="max-w-7xl mx-auto flex items-center">
                    <button onClick={handleBackNavigation} className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"><ArrowLeft className="h-6 w-6" /></button>
                    <h1 className="text-3xl font-bold">Schedule Pickup</h1>
                </div>
            </div>
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Pickup Locations</h2>
                                <button onClick={addPickupLocation} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"><Plus className="h-4 w-4 mr-2" />Add Location</button>
                            </div>
                            <div className="space-y-4">
                                {pickupLocations.map((location, index) => (
                                    <div key={location.id} className="bg-white rounded-xl shadow-lg transition-all duration-300">
                                        <div className="p-6 cursor-pointer" onClick={() => setActivePickupId(location.id === activePickupId ? null : location.id)}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center"><div className="bg-purple-100 p-2 rounded-lg mr-3"><MapPin className="h-5 w-5 text-purple-600" /></div><div className="flex-1"><h3 className="text-lg font-semibold">Pickup Location {index + 1}</h3>{(location.name || location.address) && (<p className="text-sm text-gray-500 truncate max-w-xs">{location.name || location.address}</p>)}</div></div>
                                                <div className="flex items-center">{pickupLocations.length > 1 && (<button onClick={(e) => { e.stopPropagation(); deletePickupLocation(location.id); }} className="text-red-500 hover:text-red-700 p-1 mr-2"><Trash2 className="h-5 w-5" /></button>)}{activePickupId === location.id ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}</div>
                                            </div>
                                        </div>
                                        {activePickupId === location.id && (
                                            <div className="p-6 border-t border-gray-200">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"><input type="text" placeholder="Full Name" value={location.name} onChange={(e) => updatePickupLocation(location.id, 'name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" /><input type="tel" placeholder="Phone Number" value={location.phone} onChange={(e) => updatePickupLocation(location.id, 'phone', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" /></div>
                                                <input type="text" placeholder="Enter pickup address" value={location.address} onChange={(e) => updatePickupLocation(location.id, 'address', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4" />
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between"><h4 className="font-semibold text-gray-700">Items to Pickup</h4><button onClick={() => addItem(location.id)} className="text-purple-600 hover:text-purple-700 flex items-center text-sm"><Plus className="h-4 w-4 mr-1" /> Add Item</button></div>
                                                    {getItemsForPickupLocation(location.id).map((item) => (<div key={item.id} className="border border-gray-200 rounded-lg p-4"><div className="flex justify-between items-start mb-3"><h5 className="font-medium text-gray-800">Item Details</h5><button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><input type="text" placeholder="Item name" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" /><div className="grid grid-cols-2 gap-2"><input type="text" placeholder="Weight (kg)" value={item.weight} onChange={(e) => updateItem(item.id, 'weight', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" /><input type="text" placeholder="Size (LxWxH)" value={item.size} onChange={(e) => updateItem(item.id, 'size', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" /></div></div><div className="mt-3"><label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label><div className="flex items-center gap-4"><label className="cursor-pointer bg-purple-100 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-200 transition-colors flex items-center"><Upload className="h-4 w-4 mr-2" /> Upload Image<input type="file" accept="image/*" onChange={(e) => handleImageUpload(item.id, e.target.files[0])} className="hidden" /></label>{item.image && <img src={item.image} alt="Item" className="h-16 w-16 object-cover rounded-md" />}</div></div><div className="mt-3"><label className="block text-sm font-medium text-gray-700 mb-2">Drop Location</label><select value={item.dropLocationId || ''} onChange={(e) => assignItemToDropLocation(item.id, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"><option value="">Select drop location</option>{dropLocations.map((dropLoc, idx) => (<option key={dropLoc.id} value={dropLoc.id}>Drop Location {idx + 1} {dropLoc.address && `- ${dropLoc.address}`}</option>))}</select></div></div>))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Drop Locations</h2>
                                <button onClick={addDropLocation} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"><Plus className="h-4 w-4 mr-2" />Add Location</button>
                            </div>
                            <div className="space-y-4">
                                {dropLocations.map((location, index) => (
                                    <div key={location.id} className="bg-white rounded-xl shadow-lg transition-all duration-300">
                                        <div className="p-6 cursor-pointer" onClick={() => setActiveDropId(location.id === activeDropId ? null : location.id)}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center"><div className="bg-green-100 p-2 rounded-lg mr-3"><MapPin className="h-5 w-5 text-green-600" /></div><div className="flex-1"><h3 className="text-lg font-semibold">Drop Location {index + 1}</h3>{(location.name || location.address) && (<p className="text-sm text-gray-500 truncate max-w-xs">{location.name || location.address}</p>)}</div></div>
                                                <div className="flex items-center">{dropLocations.length > 1 && (<button onClick={(e) => { e.stopPropagation(); deleteDropLocation(location.id); }} className="text-red-500 hover:text-red-700 p-1 mr-2"><Trash2 className="h-5 w-5" /></button>)}{activeDropId === location.id ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}</div>
                                            </div>
                                        </div>
                                        {activeDropId === location.id && (
                                            <div className="p-6 border-t border-gray-200">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"><input type="text" placeholder="Full Name" value={location.name} onChange={(e) => updateDropLocation(location.id, 'name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" /><input type="tel" placeholder="Phone Number" value={location.phone} onChange={(e) => updateDropLocation(location.id, 'phone', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" /></div>
                                                <input type="text" placeholder="Enter drop address" value={location.address} onChange={(e) => updateDropLocation(location.id, 'address', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4" />
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold text-gray-700">Items to Drop Here</h4>
                                                    {getItemsForDropLocation(location.id).length > 0 ? (<div className="space-y-2">{getItemsForDropLocation(location.id).map((item) => { const pickupIndex = pickupLocations.findIndex(loc => loc.id === item.pickupLocationId); return (<div key={item.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between"><div className="flex items-center space-x-3">{item.image && <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded" />}<div><p className="font-medium text-gray-800">{item.name || 'Unnamed Item'}</p><p className="text-sm text-gray-600">From Pickup Location {pickupIndex + 1}</p></div></div><div className="text-sm text-gray-600">{item.weight && `${item.weight} kg`}</div></div>); })}</div>) : (<p className="text-gray-500 text-sm italic">No items assigned to this location yet</p>)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-3 h-[600px] lg:h-auto rounded-xl shadow-lg overflow-hidden sticky top-6">
                        <MapContainer center={[28.6139, 77.2090]} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapUpdater locations={allWaypoints} />
                            <RoutingMachine waypoints={allWaypoints} />
                        </MapContainer>
                    </div>
                </div>
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Pickup Summary</h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-purple-800 mb-4 border-b pb-2">Pickup Details</h3>
                            <div className="space-y-4">
                                {displayedPickups.map((loc) => (<div key={loc.id} className="bg-purple-50 p-4 rounded-lg"><p className="font-bold text-gray-800">Pickup Location {pickupLocations.findIndex(p => p.id === loc.id) + 1}</p><p className="text-sm text-gray-600">{loc.name}, {loc.phone}</p><p className="text-sm text-gray-600">{loc.address}</p><div className="mt-2 text-sm"><p className="font-semibold">Items:</p><ul className="list-disc list-inside text-gray-700">{getItemsForPickupLocation(loc.id).length > 0 ? getItemsForPickupLocation(loc.id).map(item => <li key={item.id}>{item.name || 'Unnamed Item'}</li>) : <li>No items</li>}</ul></div></div>))}
                                {pickupLocations.length > 2 && (<button onClick={() => setShowAllPickups(!showAllPickups)} className="text-purple-600 font-semibold text-sm">{showAllPickups ? 'Show Less' : `+ Show ${pickupLocations.length - 2} More`}</button>)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-green-800 mb-4 border-b pb-2">Drop-off Details</h3>
                            <div className="space-y-4">
                                {displayedDrops.map((loc) => (<div key={loc.id} className="bg-green-50 p-4 rounded-lg"><p className="font-bold text-gray-800">Drop Location {dropLocations.findIndex(d => d.id === loc.id) + 1}</p><p className="text-sm text-gray-600">{loc.name}, {loc.phone}</p><p className="text-sm text-gray-600">{loc.address}</p><div className="mt-2 text-sm"><p className="font-semibold">Items:</p><ul className="list-disc list-inside text-gray-700">{getItemsForDropLocation(loc.id).length > 0 ? getItemsForDropLocation(loc.id).map(item => <li key={item.id}>{item.name || 'Unnamed Item'}</li>) : <li>No items</li>}</ul></div></div>))}
                                {dropLocations.length > 2 && (<button onClick={() => setShowAllDrops(!showAllDrops)} className="text-green-600 font-semibold text-sm">{showAllDrops ? 'Show Less' : `+ Show ${dropLocations.length - 2} More`}</button>)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-blue-800 mb-4 border-b pb-2">All Items ({items.length})</h3>
                            <div className="space-y-2">
                                {items.length > 0 ? items.map(item => { const pickupIndex = pickupLocations.findIndex(l => l.id === item.pickupLocationId); const dropIndex = dropLocations.findIndex(l => l.id === item.dropLocationId); return (<div key={item.id} className="bg-blue-50 p-3 rounded-lg flex justify-between items-center text-sm"><span className="font-semibold text-gray-800">{item.name || 'Unnamed Item'}</span><span className="text-gray-600">Pickup {pickupIndex + 1} &rarr; {item.dropLocationId ? `Drop ${dropIndex + 1}` : 'Not Assigned'}</span></div>); }) : <p className="text-sm text-gray-500 italic">No items added yet.</p>}
                            </div>
                        </div>
                    </div>
                    {items.some(item => !item.dropLocationId) && (<div className="mt-6 mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-yellow-800 flex items-center"><Package className="h-5 w-5 mr-2" />Some items haven't been assigned to drop locations yet.</p></div>)}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
                        <button onClick={handleBackNavigation} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                        <button 
                            onClick={() => {
                                const allItemsAssigned = items.every(item => item.dropLocationId);
                                const allPickupDetails = pickupLocations.every(loc => loc.address && loc.name && loc.phone);
                                const allDropDetails = dropLocations.every(loc => loc.address && loc.name && loc.phone);
                                const allItemsNamed = items.every(item => item.name.trim() !== '');

                                if (items.length === 0) {
                                    alert('Please add at least one item to ship.');
                                    return;
                                }
                                if (!allItemsNamed) {
                                    alert('Please provide a name for every item.');
                                    return;
                                }
                                if (!allItemsAssigned) {
                                    alert('Please assign all items to a drop location.');
                                    return;
                                }
                                if (!allPickupDetails || !allDropDetails) {
                                    alert('Please fill all name, phone, and address fields for all locations.');
                                    return;
                                }
                                if (!user) {
                                    navigate('/login', { state: { from: '/schedule-pickup', showPricing: true } });
                                    return;
                                }
                                setShowPricing(true);
                            }} 
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                        >
                            Confirm & View Price <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePickup;