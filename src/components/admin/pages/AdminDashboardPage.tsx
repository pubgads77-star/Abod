import React from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  Flame,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Users,
  Store,
  DollarSign,
  UtensilsCrossed,
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { AdminTab } from '../AdminSidebar.tsx';
import { OrderStatus } from '../../../types/index.ts';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddProduct: () => void;
  onSelectOrder: (orderId: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateTab,
  onOpenAddProduct,
  onSelectOrder,
}) => {
  const {
    orders,
    menuItems,
    tables,
    settings,
    customers,
  } = useRestaurant();

  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrders = orders.filter((o) =>
    ['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
  );
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const topProducts = menuItems.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-black px-2.5 py-0.5 rounded-full text-[10px]">جديد بانتظار التأكيد</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">مؤكد</span>;
      case 'preparing':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">قيد التجهيز</span>;
      case 'ready':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">جاهز للاستلام</span>;
      case 'out_for_delivery':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">مع المندوب</span>;
      case 'completed':
        return <span className="bg-stone-100 text-stone-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">مكتمل</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">ملغي</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner if Emergency or Closed */}
      {(!settings.isRestaurantOpen || settings.emergencyPauseOrders) && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 font-bold animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-black text-sm block">
                {!settings.isRestaurantOpen ? 'المطعم مغلق حالياً أمام الزبائن' : 'الطلبات متوقفة مؤقتاً عبر الموقع'}
              </span>
              <span className="font-normal text-stone-700">
                {!settings.isRestaurantOpen ? 'لا يمكن للزبائن إتمام طلبات حتى إعادة فتح المطعم في الإعدادات.' : settings.emergencyMessage}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Sales */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">إجمالي المبيعات</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold text-xs">
              ر.س
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">
              {totalSales} <span className="text-xs font-bold text-stone-500">ريال</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{completedOrders.length} طلبات منجزة</span>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className={`bg-white rounded-3xl p-5 border shadow-xs flex flex-col justify-between cursor-pointer transition hover:scale-101 ${
            pendingOrders.length > 0 ? 'border-amber-400 bg-amber-50/40' : 'border-stone-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">طلبات جديدة</span>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
              pendingOrders.length > 0 ? 'bg-red-500 text-white animate-bounce' : 'bg-stone-100 text-stone-600'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">
              {pendingOrders.length}
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">
              {pendingOrders.length > 0 ? 'تتطلب تأكيد الكاشير' : 'لا توجد طلبات معلقة'}
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between cursor-pointer transition hover:scale-101"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">طلبات بالمطبخ</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center">
              <Flame className="w-4 h-4 text-purple-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">
              {activeOrders.length}
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">
              قيد الطبخ والتجهيز
            </div>
          </div>
        </div>

        {/* Available Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between cursor-pointer transition hover:scale-101"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">أصناف المنيو</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">
              {menuItems.length}
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">
              {menuItems.filter((m) => m.isAvailable).length} صنف متوفر الآن
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-black text-base text-[#1A120D]">أحدث الطلبات الواردة</h3>
              <p className="text-xs text-stone-500 mt-0.5">متابعة فورية ومباشرة للطلبات المسجلة</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs font-bold">
              لا توجد طلبات مسجلة حتى الآن
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => onSelectOrder(ord.id)}
                  className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-stone-50/80 px-2 rounded-2xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center font-black text-xs text-stone-800">
                      #{ord.orderNumber}
                    </div>
                    <div>
                      <div className="font-black text-xs sm:text-sm text-[#1A120D]">
                        {ord.customerName}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {ord.orderType === 'dine_in'
                          ? `صالة (طاولة ${ord.tableNumber || '-'})`
                          : ord.orderType === 'takeaway'
                          ? 'استلام سفري'
                          : 'توصيل بعفيف'} • {ord.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="text-left flex items-center gap-3">
                    {getStatusBadge(ord.status)}
                    <div className="font-black text-xs sm:text-sm text-[#1A120D] whitespace-nowrap">
                      {ord.total} ريال
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <h3 className="font-black text-base text-[#1A120D]">الأصناف الأكثر طلباً</h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900"
            >
              المنيو
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.map((prod) => (
              <div key={prod.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-[#1A120D] truncate">{prod.name}</div>
                  <div className="text-[11px] text-amber-800 font-extrabold">{prod.basePrice} ر.س</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenAddProduct}
            className="w-full mt-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs"
          >
            + إضافة صنف جديد للمنيو
          </button>
        </div>
      </div>
    </div>
  );
};
