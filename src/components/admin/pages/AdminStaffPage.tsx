import React from 'react';
import { ShieldCheck, Phone, UserCheck } from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { INITIAL_STAFF } from '../../../data/restaurantData.ts';

export const AdminStaffPage: React.FC = () => {
  const { currentStaffUser, switchStaffRole } = useRestaurant();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'manager':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">المدير العام</span>;
      case 'cashier':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">الكاشير</span>;
      case 'kitchen':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">المطبخ والتنور</span>;
      case 'waiter':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">كابتن الصالة</span>;
      case 'delivery':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">سائق التوصيل</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1A120D]">فريق العمل والصلاحيات</h2>
          <p className="text-xs text-stone-500 mt-0.5">طاقم إدارة الفرع، الكاشير، الطهاة، ومندوبي التوصيل</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INITIAL_STAFF.map((staff) => {
          const isCurrentActive = currentStaffUser.role === staff.role;
          return (
            <div
              key={staff.id}
              className={`bg-white p-5 rounded-3xl border shadow-xs space-y-3 flex flex-col justify-between ${
                isCurrentActive ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-[#1A120D]">{staff.name}</h3>
                  {getRoleBadge(staff.role)}
                </div>

                <div className="text-xs text-stone-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{staff.phone}</span>
                </div>
                {staff.lastLogin && (
                  <div className="text-[11px] text-stone-400 mt-1">
                    آخر تسجيل: {staff.lastLogin}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100">
                <button
                  onClick={() => switchStaffRole(staff.role)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isCurrentActive
                      ? 'bg-amber-500 text-stone-950 font-black'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  {isCurrentActive ? '✓ الدور النشط حالياً' : 'تجربة الواجهة بهذا الدور'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
