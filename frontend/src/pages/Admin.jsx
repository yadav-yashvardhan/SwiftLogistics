import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  Users, 
  Star, 
  AlertTriangle, 
  DollarSign, 
  Truck,
  Calendar,
  Target,
  Award,
  Activity,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const AdminAnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - in real app, this would come from API
  const dashboardStats = {
    totalShipments: 12456,
    totalRevenue: 2845670,
    delayedShipments: 234,
    customerSatisfaction: 4.7,
    activeDrivers: 145,
    pendingPickups: 89
  };

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 2100000, shipments: 8500 },
    { month: 'Feb', revenue: 2300000, shipments: 9200 },
    { month: 'Mar', revenue: 2650000, shipments: 10800 },
    { month: 'Apr', revenue: 2400000, shipments: 9800 },
    { month: 'May', revenue: 2900000, shipments: 11500 },
    { month: 'Jun', revenue: 3200000, shipments: 12800 },
    { month: 'Jul', revenue: 2845670, shipments: 12456 }
  ];

  const shipmentStatusData = [
    { name: 'Delivered', value: 8945, color: '#10B981' },
    { name: 'In Transit', value: 2234, color: '#3B82F6' },
    { name: 'Pending Pickup', value: 890, color: '#F59E0B' },
    { name: 'Delayed', value: 234, color: '#EF4444' },
    { name: 'Cancelled', value: 153, color: '#6B7280' }
  ];

  const dailyActivityData = [
    { day: 'Mon', pickups: 156, deliveries: 189, delays: 12 },
    { day: 'Tue', pickups: 178, deliveries: 165, delays: 8 },
    { day: 'Wed', pickups: 145, deliveries: 201, delays: 15 },
    { day: 'Thu', pickups: 198, deliveries: 176, delays: 6 },
    { day: 'Fri', pickups: 234, deliveries: 245, delays: 18 },
    { day: 'Sat', pickups: 189, deliveries: 198, delays: 9 },
    { day: 'Sun', pickups: 123, deliveries: 134, delays: 4 }
  ];

  const topRoutesData = [
    { route: 'Delhi → Mumbai', shipments: 1456, revenue: 345600 },
    { route: 'Bangalore → Chennai', shipments: 1234, revenue: 298700 },
    { route: 'Mumbai → Pune', shipments: 987, revenue: 187650 },
    { route: 'Delhi → Kolkata', shipments: 876, revenue: 234500 },
    { route: 'Chennai → Hyderabad', shipments: 654, revenue: 156780 }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'purple' }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`bg-${color}-100 p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">SwiftLogistics Admin Panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 3 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard 
            icon={Package} 
            title="Total Shipments" 
            value={dashboardStats.totalShipments.toLocaleString()} 
            trend={8.2}
            subtitle="This month"
          />
          <StatCard 
            icon={DollarSign} 
            title="Total Revenue" 
            value={`₹${(dashboardStats.totalRevenue / 100000).toFixed(1)}L`}
            trend={12.5}
            subtitle="This month"
            color="green"
          />
          <StatCard 
            icon={AlertTriangle} 
            title="Delayed Shipments" 
            value={dashboardStats.delayedShipments.toString()} 
            trend={-2.1}
            subtitle="1.9% of total"
            color="red"
          />
          <StatCard 
            icon={Star} 
            title="Customer Rating" 
            value={dashboardStats.customerSatisfaction.toString()} 
            trend={0.3}
            subtitle="Out of 5.0"
            color="yellow"
          />
          <StatCard 
            icon={Truck} 
            title="Active Drivers" 
            value={dashboardStats.activeDrivers.toString()} 
            trend={5.8}
            subtitle="Currently online"
            color="blue"
          />
          <StatCard 
            icon={Clock} 
            title="Pending Pickups" 
            value={dashboardStats.pendingPickups.toString()} 
            subtitle="Awaiting pickup"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue & Shipments Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue & Shipments Trend</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Monthly Data
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${(value / 100000).toFixed(1)}L` : value,
                    name === 'revenue' ? 'Revenue' : 'Shipments'
                  ]}
                />
                <Legend />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.3}
                  name="Revenue (₹)"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="shipments" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Shipments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Shipment Status Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Shipment Status Distribution</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Target className="h-4 w-4 mr-1" />
                Current Status
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={shipmentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {shipmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Shipments']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Activity & Performance */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Daily Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Daily Activity Overview</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Activity className="h-4 w-4 mr-1" />
                Last 7 Days
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pickups" fill="#8B5CF6" name="Pickups" />
                <Bar dataKey="deliveries" fill="#10B981" name="Deliveries" />
                <Bar dataKey="delays" fill="#EF4444" name="Delays" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">On-Time Delivery</span>
                  <span className="font-bold text-green-600">98.1%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '98.1%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-bold text-yellow-600">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Driver Efficiency</span>
                  <span className="font-bold text-blue-600">91.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '91.5%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Cost Efficiency</span>
                  <span className="font-bold text-purple-600">87.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '87.3%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Routes & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Routes Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Top Performing Routes</h3>
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Route</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700">Shipments</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topRoutesData.map((route, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{route.route}</td>
                      <td className="py-3 px-2 text-right text-gray-600">{route.shipments.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right font-semibold text-green-600">₹{(route.revenue / 1000).toFixed(0)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Real-time Alerts</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Shipment SWIFT-78602 delayed</p>
                  <p className="text-sm text-red-600">Expected delay: 2 hours due to traffic</p>
                  <p className="text-xs text-gray-500">5 min ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">89 packages pending pickup</p>
                  <p className="text-sm text-yellow-600">Schedule more drivers for peak hours</p>
                  <p className="text-xs text-gray-500">12 min ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Customer satisfaction up 0.3%</p>
                  <p className="text-sm text-green-600">Great job on service improvements!</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">New bulk order received</p>
                  <p className="text-sm text-blue-600">TechCorp - 250 packages to Mumbai</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid lg:grid-cols-1 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Monthly Revenue vs Shipments</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Revenue
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Shipments
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${(value / 100000).toFixed(1)}L` : value,
                    name === 'revenue' ? 'Revenue' : 'Shipments'
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  name="Revenue (₹)"
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="shipments" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Shipments"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Monthly Target</h4>
              <Target className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Revenue Target:</span>
                <span className="font-bold">₹30L</span>
              </div>
              <div className="flex justify-between">
                <span>Achieved:</span>
                <span className="font-bold">₹28.5L</span>
              </div>
              <div className="w-full bg-purple-400 rounded-full h-2 mt-3">
                <div className="bg-white h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
              <p className="text-sm text-purple-200">95% of monthly target achieved</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Cost Analysis</h4>
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Operating Cost:</span>
                <span className="font-bold">₹18.2L</span>
              </div>
              <div className="flex justify-between">
                <span>Profit Margin:</span>
                <span className="font-bold">36%</span>
              </div>
              <div className="flex justify-between">
                <span>Cost per Delivery:</span>
                <span className="font-bold">₹146</span>
              </div>
              <p className="text-sm text-green-200 mt-3">Profit margin improved by 3% this month</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Fleet Status</h4>
              <Truck className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Vehicles:</span>
                <span className="font-bold">245</span>
              </div>
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-bold">189</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance:</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-bold">44</span>
              </div>
              <p className="text-sm text-blue-200 mt-3">77% fleet utilization rate</p>
            </div>
          </div>
        </div>

        {/* Export & Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Export Reports</h3>
              <p className="text-gray-600">Download detailed analytics reports</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;