import React from 'react';
import { Sliders, Plus, Check } from 'lucide-react';
import { INITIAL_MODIFIER_GROUPS } from '../../../data/restaurantData.ts';

export const AdminModifiersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1A120D]">الخيارات والإضافات (Modifiers)</h2>
          <p className="text-xs text-stone-500 mt-0.5">تعديل مجموعات الأحجام، درجات الحرارة، والإضافات الخاصة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INITIAL_MODIFIER_GROUPS.map((mod) => (
          <div key={mod.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="border-b border-stone-100 pb-2">
              <h3 className="font-black text-sm text-[#1A120D]">{mod.name}</h3>
              <div className="text-[11px] text-stone-500 mt-0.5">
                {mod.isRequired ? 'إجباري الاختيار' : 'اختياري'} • الحد الأقصى: {mod.maxSelections}
              </div>
            </div>

            <div className="space-y-2">
              {mod.options.map((opt) => (
                <div
                  key={opt.id}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex justify-between items-center"
                >
                  <span className="font-bold text-stone-800">{opt.name}</span>
                  <span className="font-mono font-black text-amber-800">
                    {opt.price > 0 ? `+${opt.price} ر.س` : 'مجاني'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
