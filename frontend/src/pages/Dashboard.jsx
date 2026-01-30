import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Users, 
  Car, 
  Store, 
  MapPin, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { mockChartData } from '../mock/data';

const StatCard = ({ title, value, icon: Icon, change, changeType, color }) => (
  <Card className="bg-[#18181b] border-white/10 card-hover" data-testid={`stat-${title.replace(/\s/g, '-').toLowerCase()}`}>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              changeType === 'up' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {changeType === 'up' ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{change}%</span>
              <span className="text-zinc-500">من الشهر الماضي</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const MiniChart = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((value, i) => (
        <div
          key={i}
          className={`w-3 rounded-t transition-all duration-300 hover:opacity-80 ${color}`}
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { stats } = useAdmin();

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">لوحة التحكم</h1>
          <p className="text-zinc-500 mt-1">نظرة عامة على أداء التطبيق</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">النظام يعمل</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          change={12.5}
          changeType="up"
          color="bg-indigo-500/20 text-indigo-400"
        />
        <StatCard
          title="السائقين النشطين"
          value={stats.activeDrivers}
          icon={Car}
          change={8.2}
          changeType="up"
          color="bg-emerald-500/20 text-emerald-400"
        />
        <StatCard
          title="إجمالي المطاعم"
          value={stats.totalRestaurants}
          icon={Store}
          change={5.1}
          changeType="up"
          color="bg-amber-500/20 text-amber-400"
        />
        <StatCard
          title="الإيرادات (ر.س)"
          value={stats.totalRevenue.toLocaleString()}
          icon={DollarSign}
          change={15.3}
          changeType="up"
          color="bg-pink-500/20 text-pink-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="bg-[#18181b] border-white/10" data-testid="weekly-chart">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
              <span>النشاط الأسبوعي</span>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-zinc-400">الرحلات</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-zinc-400">الطلبات</span>
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockChartData.weekly.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-16 text-xs text-zinc-500">{item.day}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${(item.rides / 1000) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-xs text-indigo-400 text-left">{item.rides}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${(item.orders / 1000) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-xs text-amber-400 text-left">{item.orders}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="bg-[#18181b] border-white/10" data-testid="revenue-chart">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
              <span>الإيرادات الشهرية</span>
              <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15.3%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 pt-4">
              {mockChartData.monthly.map((item, i) => {
                const maxRevenue = Math.max(...mockChartData.monthly.map(m => m.revenue));
                const height = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full px-1">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-500 hover:from-indigo-500 hover:to-indigo-300 cursor-pointer"
                        style={{ height: `${height * 1.5}px` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#18181b] border-white/10" data-testid="today-rides">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">رحلات اليوم</p>
                <p className="text-3xl font-bold text-white">{stats.todayRides}</p>
              </div>
              <MiniChart 
                data={mockChartData.weekly.map(d => d.rides)} 
                color="bg-indigo-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-white/10" data-testid="today-orders">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">طلبات اليوم</p>
                <p className="text-3xl font-bold text-white">{stats.todayOrders}</p>
              </div>
              <MiniChart 
                data={mockChartData.weekly.map(d => d.orders)} 
                color="bg-amber-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-white/10" data-testid="pending-orders">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">طلبات معلقة</p>
                <p className="text-3xl font-bold text-amber-400">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
