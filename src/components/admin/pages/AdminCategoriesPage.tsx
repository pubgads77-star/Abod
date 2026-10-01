import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { MenuCategory } from '../../../types/index.ts';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, menuItems, addAuditLog } = useRestaurant();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1A120D]">أقسام وتصنيفات المنيو</h2>
          <p className="text-xs text-stone-500 mt-0.5">تنظيم وترتيب مجموعات الوجبات والمشروبات الشعبية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const itemCount = cat.id === 'all'
            ? menuItems.length
            : menuItems.filter((m) => m.category === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between gap-3"
            >
              <div>
                <h3 className="font-black text-sm text-[#1A120D]">{cat.name}</h3>
                <span className="text-xs text-stone-500 font-medium">
                  {itemCount} أصناف مسجلة
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                مفعّل
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
