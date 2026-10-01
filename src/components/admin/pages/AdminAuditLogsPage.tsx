import React from 'react';
import { History, Shield, Clock } from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = useRestaurant();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1A120D]">سجل العمليات والتدقيق (Audit Logs)</h2>
          <p className="text-xs text-stone-500 mt-0.5">تتبع عمليات تسجيل الدخول والتعديلات وتغيير الأسعار</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-stone-400 font-bold text-xs">
              لا توجد سجلات مسجلة
            </div>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-stone-50/80 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#1A120D]">{log.action}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{log.details}</div>
                  </div>
                </div>

                <div className="text-left text-xs shrink-0">
                  <div className="font-bold text-stone-800">{log.user}</div>
                  <div className="text-[11px] text-stone-400">{log.timestamp}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
