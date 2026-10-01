import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  MenuCategory,
  Order,
  OrderStatus,
  OrderType,
  CartItem,
  ProductOption,
  ProductAddon,
  Table,
  TableSession,
  Coupon,
  Customer,
  StaffMember,
  StaffRole,
  AdminNotification,
  RestaurantSettings,
  AuditLog,
  DiscountOffer,
} from '../types/index.ts';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_CATEGORIES,
  INITIAL_TABLES,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_STAFF,
  INITIAL_NOTIFICATIONS,
  INITIAL_RESTAURANT_SETTINGS,
  RESTAURANT_INFO,
} from '../data/restaurantData.ts';

interface RestaurantContextType {
  // Cart
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity: number,
    selectedOption?: ProductOption,
    selectedAddons?: ProductAddon[],
    excludedIngredients?: string[],
    notes?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartShake: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Financial calculations
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  minDeliveryAmount: number;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Order mode & Dine-in table session
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  currentTableSession: TableSession | null;
  activateTableSession: (tableNumber: number) => void;
  verifyAndStartTableSession: (tableNumber: number, pin: string) => { success: boolean; message: string };
  endTableSession: (tableNumber?: number) => void;

  // Orders
  orders: Order[];
  submitOrder: (orderData: Partial<Order>) => Promise<{ success: boolean; order?: Order; error?: string }>;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Products & Menu management
  menuItems: MenuItem[];
  categories: MenuCategory[];
  addProduct: (product: Omit<MenuItem, 'id'>) => MenuItem;
  updateProduct: (id: string, updates: Partial<MenuItem>) => void;
  deleteProduct: (id: string, force?: boolean) => { success: boolean; message: string };
  archiveProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
  bulkUpdateProducts: (ids: string[], updates: Partial<MenuItem>) => void;
  bulkDeleteProducts: (ids: string[]) => void;

  // Tables
  tables: Table[];
  updateTableStatus: (tableNumber: number, status: Table['status']) => void;
  resetTablePin: (tableNumber: number) => string;

  // Customers, Staff & System
  customers: Customer[];
  notifications: AdminNotification[];
  currentStaffUser: StaffMember;
  switchStaffRole: (role: StaffRole) => void;
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;
  toggleRestaurantOpen: () => void;
  toggleEmergencyPause: (message?: string) => void;
  toggleOrderChannel: (channel: keyof RestaurantSettings['orderChannels']) => void;
  auditLogs: AuditLog[];
  addAuditLog: (user: string, action: string, details: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state (stored in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shuaa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartShake, setCartShake] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('dine_in');

  // Coupon state
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Table session state
  const [currentTableSession, setCurrentTableSession] = useState<TableSession | null>(() => {
    try {
      const saved = localStorage.getItem('shuaa_table_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Settings
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    try {
      const saved = localStorage.getItem('shuaa_settings');
      return saved ? { ...INITIAL_RESTAURANT_SETTINGS, ...JSON.parse(saved) } : INITIAL_RESTAURANT_SETTINGS;
    } catch {
      return INITIAL_RESTAURANT_SETTINGS;
    }
  });

  // Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('shuaa_menu_items');
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  // Categories
  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    try {
      const saved = localStorage.getItem('shuaa_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Tables
  const [tables, setTables] = useState<Table[]>(() => {
    try {
      const saved = localStorage.getItem('shuaa_tables');
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('shuaa_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Staff & Role
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffMember>(INITIAL_STAFF[0]);

  // Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('shuaa_audit_logs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'log-1',
          timestamp: new Date().toLocaleTimeString('ar-SA'),
          user: 'النظام',
          action: 'تشغيل المنصة',
          details: 'بدء تشغيل نظام الطلبات بنجاح',
        }
      ];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('shuaa_orders');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ORD-1048',
          orderNumber: 1048,
          orderType: 'dine_in',
          status: 'preparing',
          createdAt: 'اليوم، 11:30 ص',
          estimatedMinutes: 20,
          customerName: 'سلطان الروقي',
          customerPhone: '0555319888',
          tableNumber: 4,
          subtotal: 70,
          deliveryFee: 0,
          discount: 0,
          total: 70,
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          items: [
            {
              menuItemId: 'tannour-fish',
              name: 'سمك تنور طازج بالخلطة الحارة',
              quantity: 1,
              unitPrice: 48,
              totalPrice: 48,
              optionName: 'حجم وسط (شخصين)',
            },
            {
              menuItemId: 'adeni-tea',
              name: 'شاي عدني بالحليب والهيل',
              quantity: 2,
              unitPrice: 5,
              totalPrice: 10,
            },
            {
              menuItemId: 'french-fries',
              name: 'بطاطس مقلية ذهبية',
              quantity: 2,
              unitPrice: 6,
              totalPrice: 12,
            },
          ],
        },
      ];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shuaa_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('shuaa_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('shuaa_menu_items', JSON.stringify(menuItems));
    } catch {
      // ignore
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('shuaa_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('shuaa_tables', JSON.stringify(tables));
    } catch {
      // ignore
    }
  }, [tables]);

  // Cart operations
  const addToCart = (
    item: MenuItem,
    quantity: number,
    selectedOption?: ProductOption,
    selectedAddons: ProductAddon[] = [],
    excludedIngredients: string[] = [],
    notes: string = ''
  ) => {
    const optPrice = selectedOption ? selectedOption.priceModifier : 0;
    const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = item.basePrice + optPrice + addonsPrice;
    const totalPrice = unitPrice * quantity;

    // Check if identical configuration exists
    const existingIndex = cart.findIndex((c) => {
      if (c.menuItem.id !== item.id) return false;
      if (c.selectedOption?.id !== selectedOption?.id) return false;
      if (c.notes !== notes) return false;
      if (c.selectedAddons.length !== selectedAddons.length) return false;
      if (c.excludedIngredients.length !== excludedIngredients.length) return false;
      const sameAddons = selectedAddons.every((a) => c.selectedAddons.some((ca) => ca.id === a.id));
      const sameExcludes = excludedIngredients.every((e) => c.excludedIngredients.includes(e));
      return sameAddons && sameExcludes;
    });

    if (existingIndex > -1) {
      const updated = [...cart];
      const newQty = updated[existingIndex].quantity + quantity;
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].totalPrice = newQty * unitPrice;
      setCart(updated);
    } else {
      const newCartItem: CartItem = {
        cartItemId: 'ci-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        menuItem: item,
        quantity,
        selectedOption,
        selectedAddons,
        excludedIngredients,
        notes,
        unitPrice,
        totalPrice,
      };
      setCart([...cart, newCartItem]);
    }

    setCartShake(true);
    setTimeout(() => setCartShake(false), 500);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) =>
        c.cartItemId === cartItemId
          ? { ...c, quantity, totalPrice: c.unitPrice * quantity }
          : c
      )
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((c) => c.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  // Delivery fee logic
  const minDeliveryAmount = RESTAURANT_INFO.minDeliveryAmount;
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    deliveryFee = subtotal >= RESTAURANT_INFO.freeDeliveryThreshold ? 0 : RESTAURANT_INFO.deliveryFee;
  }

  // Coupon calculations
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountAmount) {
      discount = Math.min(appliedCoupon.discountAmount, subtotal);
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const applyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.trim().toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!found) {
      return { success: false, message: 'رمز الكوبون غير صحيح أو غير مفعّل' };
    }
    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `الحد الأدنى لتطبيق هذا الكوبون هو ${found.minOrderAmount} ريال`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `تم تفعيل خصم: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Table session
  const activateTableSession = (tableNumber: number) => {
    const session: TableSession = {
      sessionId: 'sess-' + Date.now(),
      tableNumber,
      token: 'tok-' + Math.random().toString(36).substring(2, 9),
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    };
    setCurrentTableSession(session);
    setOrderType('dine_in');
    try {
      localStorage.setItem('shuaa_table_session', JSON.stringify(session));
    } catch {
      // ignore
    }
    setTables((prev) =>
      prev.map((t) =>
        t.tableNumber === tableNumber
          ? { ...t, status: 'active', activeSessionId: session.sessionId }
          : t
      )
    );
  };

  const verifyAndStartTableSession = (tableNumber: number, pin: string) => {
    const table = tables.find((t) => t.tableNumber === tableNumber);
    if (!table) {
      return { success: false, message: 'رقم الطاولة غير موجود في النظام' };
    }
    if (table.currentPin !== pin.trim()) {
      return { success: false, message: 'رمز PIN الخاص بالطاولة غير صحيح' };
    }

    activateTableSession(tableNumber);
    return { success: true, message: `أهلاً بك! تم الاتصال بطاولة رقم ${tableNumber}` };
  };

  const endTableSession = (tableNumber?: number) => {
    const targetTableNum = tableNumber || currentTableSession?.tableNumber;
    if (targetTableNum) {
      setTables((prev) =>
        prev.map((t) =>
          t.tableNumber === targetTableNum
            ? { ...t, status: 'available', activeSessionId: undefined }
            : t
        )
      );
    }
    setCurrentTableSession(null);
    try {
      localStorage.removeItem('shuaa_table_session');
    } catch {
      // ignore
    }
  };

  // Submit Order
  const submitOrder = async (orderData: Partial<Order>): Promise<{ success: boolean; order?: Order; error?: string }> => {
    try {
      const newOrderNumber = orders.length > 0 ? Math.max(...orders.map((o) => o.orderNumber)) + 1 : 1050;
      const newOrder: Order = {
        id: `ORD-${newOrderNumber}`,
        orderNumber: newOrderNumber,
        orderType: orderData.orderType || orderType,
        status: 'pending',
        createdAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        estimatedMinutes: orderData.orderType === 'delivery' ? 35 : 15,
        items: cart.map((c) => ({
          menuItemId: c.menuItem.id,
          name: c.menuItem.name,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          totalPrice: c.totalPrice,
          optionName: c.selectedOption?.name,
          addons: c.selectedAddons.map((a) => a.name),
          excluded: c.excludedIngredients,
          notes: c.notes,
        })),
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod: orderData.paymentMethod || 'cash',
        paymentStatus: 'pending',
        tableNumber: orderData.tableNumber || currentTableSession?.tableNumber,
        customerName: orderData.customerName || 'زبون عبر الموقع',
        customerPhone: orderData.customerPhone || '',
        customerNotes: orderData.customerNotes || '',
        pickupTime: orderData.pickupTime,
        deliveryAddress: orderData.deliveryAddress,
      };

      setOrders((prev) => [newOrder, ...prev]);

      // Add notification
      const newNotif: AdminNotification = {
        id: 'notif-' + Date.now(),
        title: 'طلب جديد وارد',
        message: `تم استلام طلب جديد #${newOrderNumber} بقيمة ${total} ريال`,
        type: 'order',
        timestamp: 'الآن',
        isRead: false,
        linkToTab: 'orders',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      // Clear cart
      clearCart();

      return { success: true, order: newOrder };
    } catch (err: any) {
      return { success: false, error: err?.message || 'حدث خطأ غير متوقع' };
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Product CRUD
  const addProduct = (product: Omit<MenuItem, 'id'>): MenuItem => {
    const newItem: MenuItem = {
      ...product,
      id: 'item-' + Date.now(),
    };
    setMenuItems((prev) => [newItem, ...prev]);
    addAuditLog('المدير', 'إضافة صنف', `تمت إضافة الصنف "${newItem.name}" بنجاح`);
    return newItem;
  };

  const updateProduct = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
    );
  };

  const deleteProduct = (id: string, force?: boolean): { success: boolean; message: string } => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    addAuditLog('المدير', 'حذف صنف', `تم حذف الصنف من النظام`);
    return { success: true, message: 'تم حذف الصنف بنجاح' };
  };

  const archiveProduct = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'archived', isAvailable: false } : m))
    );
  };

  const duplicateProduct = (id: string) => {
    const source = menuItems.find((m) => m.id === id);
    if (!source) return;
    const duplicated: MenuItem = {
      ...source,
      id: 'item-' + Date.now(),
      name: `${source.name} (نسخة)`,
    };
    setMenuItems((prev) => [duplicated, ...prev]);
  };

  const toggleProductAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, basePrice: newPrice } : m))
    );
  };

  const bulkUpdateProducts = (ids: string[], updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((m) => (ids.includes(m.id) ? { ...m, ...updates } : m))
    );
  };

  const bulkDeleteProducts = (ids: string[]) => {
    setMenuItems((prev) => prev.filter((m) => !ids.includes(m.id)));
  };

  // Tables
  const updateTableStatus = (tableNumber: number, status: Table['status']) => {
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, status } : t))
    );
  };

  const resetTablePin = (tableNumber: number): string => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, currentPin: newPin } : t))
    );
    return newPin;
  };

  // Staff
  const switchStaffRole = (role: StaffRole) => {
    const staff = INITIAL_STAFF.find((s) => s.role === role) || {
      id: 'staff-dyn',
      name: role === 'manager' ? 'المدير' : role === 'cashier' ? 'الكاشير' : 'الموظف',
      phone: '0555000000',
      role,
      status: 'active',
    };
    setCurrentStaffUser(staff);
  };

  // Settings
  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleRestaurantOpen = () => {
    setSettings((prev) => {
      const nextOpen = !prev.isRestaurantOpen;
      addAuditLog(
        currentStaffUser.name,
        nextOpen ? 'فتح المطعم' : 'إغلاق المطعم',
        nextOpen ? 'تم فتح المطعم واستقبال الطلبات' : 'تم إغلاق المطعم مؤقتاً'
      );
      return { ...prev, isRestaurantOpen: nextOpen };
    });
  };

  const toggleEmergencyPause = (message?: string) => {
    setSettings((prev) => ({
      ...prev,
      emergencyPauseOrders: !prev.emergencyPauseOrders,
      emergencyMessage: message || prev.emergencyMessage,
    }));
  };

  const toggleOrderChannel = (channel: keyof RestaurantSettings['orderChannels']) => {
    setSettings((prev) => ({
      ...prev,
      orderChannels: {
        ...prev.orderChannels,
        [channel]: !prev.orderChannels[channel],
      },
    }));
  };

  const addAuditLog = (user: string, action: string, details: string) => {
    const log: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('ar-SA'),
      user,
      action,
      details,
    };
    setAuditLogs((prev) => [log, ...prev.slice(0, 50)]);
    try {
      localStorage.setItem('shuaa_audit_logs', JSON.stringify([log, ...auditLogs.slice(0, 50)]));
    } catch {
      // ignore
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartShake,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        deliveryFee,
        discount,
        total,
        minDeliveryAmount,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orderType,
        setOrderType,
        currentTableSession,
        activateTableSession,
        verifyAndStartTableSession,
        endTableSession,
        orders,
        submitOrder,
        getOrderById,
        updateOrderStatus,
        menuItems,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        archiveProduct,
        duplicateProduct,
        toggleProductAvailability,
        updateProductPrice,
        bulkUpdateProducts,
        bulkDeleteProducts,
        tables,
        updateTableStatus,
        resetTablePin,
        customers,
        notifications,
        currentStaffUser,
        switchStaffRole,
        settings,
        updateSettings,
        toggleRestaurantOpen,
        toggleEmergencyPause,
        toggleOrderChannel,
        auditLogs,
        addAuditLog,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
