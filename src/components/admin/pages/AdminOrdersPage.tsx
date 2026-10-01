import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Flame,
  Search,
  Filter,
  Phone,
  Printer,
  ChevronLeft,
  X,
  MessageCircle,
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { Order, OrderStatus } from '../../../types/index.ts';

interface AdminOrdersPageProps {
  selectedOrderId: string | null;
  onClearSelectedOrder: () => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  selectedOrderId,
  onClearSelectedOrder,
}) => {
  const { orders, updateOrderStatus, addAuditLog } = useRestaurant();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailOrder, setActiveDetailOrder] = useState<Order | null>(() => {
    if (selectedOrderId) {
      return orders.find((o) => o.id === selectedOrderId) || null;
    }
    return null;
  });

  const filteredOrders = orders.filter((ord) => {
    if (activeFilter !== 'all' && ord.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = String(ord.orderNumber).includes(q);
      const matchName = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.customerPhone.includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    addAuditLog('الكاشير', 'تحديث حالة طلب', `تم تغيير حالة الطلب ${orderId} إلى ${newStatus}`);
    if (activeDetailOrder && activeDetailOrder.id === orderId) {
      setActiveDetailOrder({ ...activeDetailOrder, status: newStatus });
    }
  };

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
      {/* Top Bar with Filter Pills & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[#1A120D]">إدارة ومعالجة الطلبات</h2>
            <p className="text-xs text-stone-500 mt-0.5">تأكيد، تجهيز، وتسليم طلبات الصالة والسفري والتوصيل</p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="بحث برقم الطلب أو الاسم أو الجوال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-3 pl-8 text-xs font-bold rounded-xl border border-stone-200 outline-none focus:border-amber-500 bg-stone-50"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `الكل (${orders.length})` },
            { id: 'pending', label: `جديد (${orders.filter((o) => o.status === 'pending').length})` },
            { id: 'preparing', label: `بالمطبخ (${orders.filter((o) => o.status === 'preparing').length})` },
            { id: 'ready', label: `جاهز (${orders.filter((o) => o.status === 'ready').length})` },
            { id: 'completed', label: `مكتمل (${orders.filter((o) => o.status === 'completed').length})` },
            { id: 'cancelled', label: `ملغي (${orders.filter((o) => o.status === 'cancelled').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`space-y-3 ${activeDetailOrder ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center text-stone-400 font-bold text-xs">
              لا توجد طلبات تطابق الفلتر المحدد
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setActiveDetailOrder(ord)}
                className={`bg-white p-4 sm:p-5 rounded-3xl border transition cursor-pointer hover:border-amber-400 ${
                  activeDetailOrder?.id === ord.id
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                    : 'border-stone-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3 border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-[#1A120D]">#{ord.orderNumber}</span>
                    <span className="text-[11px] text-stone-500 font-medium">{ord.createdAt}</span>
                  </div>
                  <div>{getStatusBadge(ord.status)}</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-[#1A120D]">{ord.customerName}</div>
                    <div className="text-[11px] text-stone-500">
                      {ord.orderType === 'dine_in'
                        ? `صالة (طاولة ${ord.tableNumber || '-'})`
                        : ord.orderType === 'takeaway'
                        ? 'استلام سفري'
                        : `توصيل: ${ord.deliveryAddress?.district || 'عفيف'}`}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-50">
                    <span className="font-black text-sm text-[#1A120D]">{ord.total} ريال</span>
                    <span className="text-amber-800 font-bold text-xs flex items-center gap-1">
                      <span>التفاصيل</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Order Detail Sidebar */}
        {activeDetailOrder && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-lg space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-black text-base text-[#1A120D]">
                  طلب #{activeDetailOrder.orderNumber}
                </h3>
                <span className="text-xs text-stone-500">{activeDetailOrder.createdAt}</span>
              </div>
              <button
                onClick={() => {
                  setActiveDetailOrder(null);
                  onClearSelectedOrder();
                }}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Status Control Buttons */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-stone-500 uppercase">تحديث حالة الطلب:</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(activeDetailOrder.id, 'confirmed')}
                  className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs transition cursor-pointer"
                >
                  ✓ تأكيد
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeDetailOrder.id, 'preparing')}
                  className="py-2 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs transition cursor-pointer"
                >
                  🔥 تجهيز
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeDetailOrder.id, 'ready')}
                  className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs transition cursor-pointer"
                >
                  📦 جاهز
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeDetailOrder.id, 'completed')}
                  className="py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs transition cursor-pointer"
                >
                  🎉 اكتمال
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 border-t border-stone-100 pt-3">
              <div className="text-xs font-black text-stone-800">الأصناف المطلوبة:</div>
              <div className="space-y-2">
                {activeDetailOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1.5 border-b border-stone-50">
                    <div>
                      <div className="font-bold text-[#1A120D]">
                        {it.name} <span className="text-amber-800">×{it.quantity}</span>
                      </div>
                      {it.optionName && <div className="text-[11px] text-stone-500">{it.optionName}</div>}
                      {it.addons && it.addons.length > 0 && (
                        <div className="text-[11px] text-stone-500">إضافات: {it.addons.join(', ')}</div>
                      )}
                      {it.notes && <div className="text-[11px] text-amber-700">ملاحظة: {it.notes}</div>}
                    </div>
                    <span className="font-black text-stone-900 whitespace-nowrap">{it.totalPrice} ر.س</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-stone-100 pt-3 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>المجموع الفرعي:</span>
                <span>{activeDetailOrder.subtotal} ريال</span>
              </div>
              {activeDetailOrder.deliveryFee > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>رسوم التوصيل:</span>
                  <span>{activeDetailOrder.deliveryFee} ريال</span>
                </div>
              )}
              {activeDetailOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم:</span>
                  <span>-{activeDetailOrder.discount} ريال</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#1A120D] pt-2 border-t border-stone-200">
                <span>الإجمالي:</span>
                <span>{activeDetailOrder.total} ريال</span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs space-y-1.5">
              <div className="font-bold text-[#1A120D]">{activeDetailOrder.customerName}</div>
              {activeDetailOrder.customerPhone && (
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>{activeDetailOrder.customerPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
