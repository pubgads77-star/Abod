import React from 'react';
import { Tag, Percent, Plus, Check } from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { INITIAL_DISCOUNT_OFFERS } from '../../../data/restaurantData.ts';

export const AdminOffersPage: React.FC = () => {
  const { coupons } = useRestaurant();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1A120D]">العروض والكوبونات الترويجية</h2>
          <p className="text-xs text-stone-500 mt-0.5">أكواد الخصم والخصومات المئوية والمباشرة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Coupons */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-[#1A120D] border-b border-stone-100 pb-2">
            كوبونات الخصم النشطة
          </h3>
          <div className="space-y-3">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-mono font-black text-base text-amber-900 tracking-wider">
                    {c.code}
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">{c.description}</div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    الحد الأدنى: {c.minOrderAmount} ريال
                  </div>
                </div>
                <span className="font-black text-xs px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800">
                  مفعّل
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Offers */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-[#1A120D] border-b border-stone-100 pb-2">
            العروض التلقائية
          </h3>
          <div className="space-y-3">
            {INITIAL_DISCOUNT_OFFERS.map((off) => (
              <div
                key={off.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-black text-xs text-[#1A120D]">{off.title}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    الحد الأدنى للطلب: {off.minOrderAmount || 0} ريال
                  </div>
                </div>
                <span className="font-black text-xs px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950">
                  {off.type === 'percentage' ? `${off.value}%` : `${off.value} ر.س`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
