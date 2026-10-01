import React from 'react';
import { Truck, MapPin, Check } from 'lucide-react';
import { INITIAL_DELIVERY_ZONES } from '../../../data/restaurantData.ts';

export const AdminDeliveryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1A120D]">مناطق ورسوم التوصيل في محافظة عفيف</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            إدارة الأحياء المشمولة بالتوصيل، رسوم التوصيل، والحد الأدنى للطلب
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INITIAL_DELIVERY_ZONES.map((zone) => (
          <div
            key={zone.id}
            className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <h3 className="font-black text-xs text-[#1A120D] truncate">{zone.name}</h3>
            </div>

            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <span className="font-bold text-[#1A120D]">
                  {zone.deliveryFee === 0 ? 'مجاناً' : `${zone.deliveryFee} ر.س`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>الحد الأدنى:</span>
                <span className="font-bold text-[#1A120D]">{zone.minOrder} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>الوقت المتوقع:</span>
                <span className="font-bold text-[#1A120D]">{zone.estimatedMinutes} دقيقة</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                نطاق نشط
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
