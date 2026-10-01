import React from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, PieChart } from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';

export const AdminReportsPage: React.FC = () => {
  const { orders } = useRestaurant();

  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const dineInCount = orders.filter((o) => o.orderType === 'dine_in').length;
  const takeawayCount = orders.filter((o) => o.orderType === 'takeaway').length;
  const deliveryCount = orders.filter((o) => o.orderType === 'delivery').length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1A120D]">التقارير والمؤشرات المالية</h2>
          <p className="text-xs text-stone-500 mt-0.5">تحليلات المبيعات ونسب القنوات ومتوسط قيمة السلة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-500">إجمالي المبيعات المكتملة</span>
          <div className="text-3xl font-black text-[#1A120D]">{totalSales} ريال</div>
          <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{orders.length} طلبات مسجلة بالمجموع</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-500">متوسط قيمة الطلب</span>
          <div className="text-3xl font-black text-[#1A120D]">
            {orders.length > 0 ? Math.round(totalSales / orders.length) : 0} ريال
          </div>
          <div className="text-xs text-stone-500 font-medium">سلة مناسبة وموزونة</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-500">نسبة طلبات الصالة</span>
          <div className="text-3xl font-black text-amber-900">
            {orders.length > 0 ? Math.round((dineInCount / orders.length) * 100) : 0}%
          </div>
          <div className="text-xs text-stone-500 font-medium">
            صالة ({dineInCount}) • سفري ({takeawayCount}) • توصيل ({deliveryCount})
          </div>
        </div>
      </div>
    </div>
  );
};
