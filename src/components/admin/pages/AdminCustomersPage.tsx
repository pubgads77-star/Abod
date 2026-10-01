import React from 'react';
import { Users, Phone, ShoppingBag } from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';

export const AdminCustomersPage: React.FC = () => {
  const { customers } = useRestaurant();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1A120D]">سجل العملاء والمشتريات</h2>
          <p className="text-xs text-stone-500 mt-0.5">قاعدة بيانات زبائن الفرع والطلبات المتكررة</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {customers.map((c) => (
            <div key={c.id} className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-stone-50/80 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-900 font-black text-xs flex items-center justify-center">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#1A120D]">{c.name}</div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>{c.phone}</span>
                    {c.notes && <span>• {c.notes}</span>}
                  </div>
                </div>
              </div>

              <div className="text-left text-xs">
                <div className="font-black text-[#1A120D]">{c.totalSpent} ريال</div>
                <div className="text-[11px] text-stone-500">{c.ordersCount} طلبات مسجلة</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
