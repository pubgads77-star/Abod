import React, { useState } from 'react';
import { QrCode, RefreshCw, KeyRound, ExternalLink, Printer } from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { PrintableTableCardModal } from '../../PrintableTableCardModal.tsx';
import { Table } from '../../../types/index.ts';

interface AdminTablesPageProps {
  onSimulateTable: (tableNumber: number) => void;
}

export const AdminTablesPage: React.FC<AdminTablesPageProps> = ({ onSimulateTable }) => {
  const { tables, resetTablePin, updateTableStatus, addAuditLog } = useRestaurant();
  const [selectedTableForPrint, setSelectedTableForPrint] = useState<Table | null>(null);

  const handleResetPin = (tblNum: number) => {
    const newPin = resetTablePin(tblNum);
    addAuditLog('مشرف الصالة', 'تغيير رمز الطاولة', `تم إنشاء رمز PIN جديد للطاولة ${tblNum}: ${newPin}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1A120D]">إدارة طاولات الصالة ورموز QR</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            التحكم بطاولات المطعم الـ 12 ورموز PIN الخاصة بها مع إمكانية طباعة كروت الـ QR
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((t) => (
          <div
            key={t.id}
            className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-black text-base text-[#1A120D]">طاولة رقم {t.tableNumber}</span>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    t.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : t.status === 'occupied'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {t.status === 'active' ? 'مشغولة حالياً' : 'متاحة'}
                </span>
              </div>

              {/* PIN Box */}
              <div className="mt-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-stone-500 font-bold">رمز PIN السري:</span>
                </div>
                <span className="font-mono font-black text-sm text-stone-900 tracking-widest">
                  {t.currentPin}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100">
              <button
                onClick={() => onSimulateTable(t.tableNumber)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>تجربة طلب الطاولة</span>
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSelectedTableForPrint(t)}
                  className="py-1.5 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-600" />
                  <span>طباعة كرت</span>
                </button>
                <button
                  onClick={() => handleResetPin(t.tableNumber)}
                  className="py-1.5 px-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  title="توليد رمز PIN جديد"
                >
                  <RefreshCw className="w-3 h-3 text-stone-500" />
                  <span>تجديد PIN</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTableForPrint && (
        <PrintableTableCardModal
          table={selectedTableForPrint}
          onClose={() => setSelectedTableForPrint(null)}
        />
      )}
    </div>
  );
};
