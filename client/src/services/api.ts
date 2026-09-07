const RAW_URL = import.meta.env.VITE_API_URL || 'https://kirvexa2-0-backend.vercel.app/api';
const cleanBase = RAW_URL.replace(/\/+$/, '');
const API_BASE_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;

export const checkMongoHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return { isConnected: false, database: 'Farma' };
    return await res.json();
  } catch (err: any) {
    return { isConnected: false, database: 'Farma', error: err?.message || String(err) };
  }
};

export const seedMongoDatabase = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/seed`, { method: 'POST' });
    return await res.json();
  } catch (err: any) {
    console.warn('[MongoDB Client API] Seed request failed:', err?.message || String(err));
    return null;
  }
};

// ─── In-memory request cache (30 second TTL for GET requests) ─────────────────
const CACHE_TTL_MS = 30_000; // 30 seconds
interface CacheEntry { data: any; expiresAt: number; }
const requestCache = new Map<string, CacheEntry>();

function getCached<T>(key: string): T | null {
  const entry = requestCache.get(key);
  if (entry && Date.now() < entry.expiresAt) return entry.data as T;
  requestCache.delete(key);
  return null;
}

function setCached(key: string, data: any): void {
  requestCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// Invalidate all cache entries that start with a given prefix (e.g. "/users")
function invalidateCache(prefix: string): void {
  for (const key of requestCache.keys()) {
    if (key.startsWith(prefix)) requestCache.delete(key);
  }
}

// Expose manual cache clear (useful after mutations from outside api.ts)
export const clearApiCache = () => requestCache.clear();
// ─────────────────────────────────────────────────────────────────────────────

// Generic API caller with in-memory GET cache + timeout controller
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const method = (options?.method || 'GET').toUpperCase();
  const isGet = method === 'GET';

  // Return cached response for GET requests if still fresh
  if (isGet) {
    const cached = getCached<T>(endpoint);
    if (cached !== null) return cached;
  }

  // On write operations, bust the cache for this resource type
  if (!isGet) {
    // Extract resource prefix e.g. "/users/123/approve" → "/users"
    const parts = endpoint.split('/');
    if (parts.length >= 2) invalidateCache(`/${parts[1]}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    const data = await res.json();
    // Cache only successful GET responses
    if (isGet) setCached(endpoint, data);
    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`[MongoDB Client API] Fetch failed for ${endpoint}:`, err?.message || String(err));
    return null;
  }
}

export const api = {
  // Health & Seed
  checkHealth: checkMongoHealth,
  seedDatabase: seedMongoDatabase,

  // Users & Authentication
  loginAuth: (credentials: { phone?: string; email?: string; password?: string }) =>
    apiFetch<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  registerAuth: (userData: any) =>
    apiFetch<any>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  sendEmailCode: (email: string) =>
    apiFetch<any>('/auth/send-email-code', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyEmailCode: (email: string, code: string) =>
    apiFetch<any>('/auth/verify-email-code', { method: 'POST', body: JSON.stringify({ email, code }) }),
  resetPassword: (data: { identifier: string; newPassword: string }) =>
    apiFetch<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword?: string; newPassword: string }, token?: string) =>
    apiFetch<any>('/auth/change-password', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    }),
  getUsers: () => apiFetch<any[]>('/users'),
  getUserById: (id: string) => apiFetch<any>(`/users?id=${encodeURIComponent(id)}`),
  getUserByPhone: (phone: string) => apiFetch<any>(`/users?phone=${encodeURIComponent(phone)}`),
  saveUser: (user: any) => apiFetch<any>('/users', { method: 'POST', body: JSON.stringify(user) }),
  updateUser: (id: string, updated: any) => apiFetch<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(updated) }),
  deleteUser: (id: string) => apiFetch<any>(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // KCC
  getKccApplications: () => apiFetch<any[]>('/kcc'),
  submitKccApplication: (app: any) => apiFetch<any>('/kcc', { method: 'POST', body: JSON.stringify(app) }),
  approveKccApplication: (id: string, cardNumber?: string, creditLimit?: number) => apiFetch<any>(`/kcc/${id}/approve`, { method: 'PUT', body: JSON.stringify({ cardNumber, creditLimit }) }),
  rejectKccApplication: (id: string) => apiFetch<any>(`/kcc/${id}/reject`, { method: 'PUT' }),
  updateKccLimit: (data: { cardNumber?: string; phone?: string; id?: string; creditLimit: number }) => apiFetch<any>('/kcc/update-limit', { method: 'PUT', body: JSON.stringify(data) }),

  // Categories
  getCategories: () => apiFetch<any>('/categories'),

  // Products
  getProducts: (params?: { categoryId?: string; search?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number; all?: boolean }) => {
    const queryParts: string[] = [];
    if (params?.all) queryParts.push(`all=true`);
    if (params?.categoryId && params.categoryId !== "All") queryParts.push(`categoryId=${encodeURIComponent(params.categoryId)}`);
    if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params?.minPrice) queryParts.push(`minPrice=${params.minPrice}`);
    if (params?.maxPrice) queryParts.push(`maxPrice=${params.maxPrice}`);
    if (params?.page) queryParts.push(`page=${params.page}`);
    if (params?.limit) queryParts.push(`limit=${params.limit}`);
    const qs = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    return apiFetch<any>(`/products${qs}`);
  },
  getProductById: (id: string) => apiFetch<any>(`/products/${encodeURIComponent(id)}`),
  addProduct: (product: any) => apiFetch<any>('/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProduct: (id: string, updated: any) => apiFetch<any>(`/products/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(updated) }),
  deleteProduct: (id: string) => apiFetch<any>(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Crops
  getCrops: () => apiFetch<any[]>('/crops'),
  addCrop: (crop: any) => apiFetch<any>('/crops', { method: 'POST', body: JSON.stringify(crop) }),
  approveCrop: (id: string) => apiFetch<any>(`/crops/${id}/approve`, { method: 'PUT' }),
  rejectCrop: (id: string) => apiFetch<any>(`/crops/${id}/reject`, { method: 'PUT' }),
  deleteCrop: (id: string) => apiFetch<any>(`/crops/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Labour
  getLabourBookings: () => apiFetch<any[]>('/labour/bookings'),
  addLabourBooking: (booking: any) => apiFetch<any>('/labour/bookings', { method: 'POST', body: JSON.stringify(booking) }),
  assignLabours: (id: string, assignedLabours: any[], adminNotes?: string) => apiFetch<any>(`/labour/bookings/${id}/assign`, { method: 'PUT', body: JSON.stringify({ assignedLabours, adminNotes }) }),
  updateLabourBooking: (id: string, updated: any) => apiFetch<any>(`/labour/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(updated) }),
  deleteLabourBooking: (id: string) => apiFetch<any>(`/labour/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getLabourTypes: () => apiFetch<string[]>('/labour/types'),
  addLabourType: (type: string) => apiFetch<any>('/labour/types', { method: 'POST', body: JSON.stringify({ type }) }),
  removeLabourType: (type: string) => apiFetch<any>(`/labour/types/${encodeURIComponent(type)}`, { method: 'DELETE' }),

  // Machinery
  getMachineryBookings: () => apiFetch<any[]>('/machinery'),
  addMachineryBooking: (booking: any) => apiFetch<any>('/machinery', { method: 'POST', body: JSON.stringify(booking) }),
  allotMachinery: (id: string, machineDetails: string, adminNotes?: string) => apiFetch<any>(`/machinery/${id}/allot`, { method: 'PUT', body: JSON.stringify({ machineDetails, adminNotes }) }),
  rejectMachinery: (id: string) => apiFetch<any>(`/machinery/${id}/reject`, { method: 'PUT' }),
  updateMachineryBooking: (id: string, updated: any) => apiFetch<any>(`/machinery/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(updated) }),
  deleteMachineryBooking: (id: string) => apiFetch<any>(`/machinery/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Expert Advice
  getExpertQueries: () => apiFetch<any[]>('/expert'),
  addExpertQuery: (query: any) => apiFetch<any>('/expert', { method: 'POST', body: JSON.stringify(query) }),
  updateExpertQuery: (id: string, status: string, adminReply?: string) => apiFetch<any>(`/expert/${id}`, { method: 'PUT', body: JSON.stringify({ status, adminReply }) }),
  deleteExpertQuery: (id: string) => apiFetch<any>(`/expert/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Mandi Rates
  getMandiRates: () => apiFetch<any[]>('/mandi'),
  addMandiRate: (rate: any) => apiFetch<any>('/mandi', { method: 'POST', body: JSON.stringify(rate) }),
  updateMandiRate: (id: string, updated: any) => apiFetch<any>(`/mandi/${id}`, { method: 'PUT', body: JSON.stringify(updated) }),
  deleteMandiRate: (id: string) => apiFetch<any>(`/mandi/${id}`, { method: 'DELETE' }),

  // Dealer Listings
  getDealerListings: () => apiFetch<any[]>('/dealer/listings'),
  addDealerListing: (item: any) => apiFetch<any>('/dealer/listings', { method: 'POST', body: JSON.stringify(item) }),
  updateDealerListing: (id: string, updated: any) => apiFetch<any>(`/dealer/listings/${id}`, { method: 'PUT', body: JSON.stringify(updated) }),
  approveDealerListing: (id: string) => apiFetch<any>(`/dealer/listings/${id}/approve`, { method: 'PUT' }),
  rejectDealerListing: (id: string) => apiFetch<any>(`/dealer/listings/${id}/reject`, { method: 'PUT' }),
  deleteDealerListing: (id: string) => apiFetch<any>(`/dealer/listings/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  allotDealerCredentials: (data: { id?: string; phone?: string; email?: string; dealerId: string; password: string }) => apiFetch<any>('/dealer/allot-credentials', { method: 'POST', body: JSON.stringify(data) }),
  getDealerById: (dealerId: string) => apiFetch<any>(`/users/dealer/${encodeURIComponent(dealerId)}`),

  // Registered Farmers
  getRegisteredFarmers: () => apiFetch<any[]>('/farmers'),
  registerFarmer: (farmer: any) => apiFetch<any>('/farmers', { method: 'POST', body: JSON.stringify(farmer) }),

  // Orders
  getOrders: () => apiFetch<any[]>('/orders'),
  createOrder: (order: any) => apiFetch<any>('/orders', { method: 'POST', body: JSON.stringify(order) }),
  updateOrderStatus: (id: string, status: string) => apiFetch<any>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateOrder: (id: string, data: any) => apiFetch<any>(`/orders/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOrder: (id: string) => apiFetch<any>(`/orders/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Pathshala
  getPathshalaVideos: () => apiFetch<any[]>('/pathshala'),
  addPathshalaVideo: (video: any) => apiFetch<any>('/pathshala', { method: 'POST', body: JSON.stringify(video) }),
  deletePathshalaVideo: (id: string) => apiFetch<any>(`/pathshala/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => apiFetch<any[]>('/notifications'),
  addNotification: (notif: any) => apiFetch<any>('/notifications', { method: 'POST', body: JSON.stringify(notif) }),
  markNotificationRead: (id: string) => apiFetch<any>(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => apiFetch<any>('/notifications/read-all', { method: 'PUT' }),
  deleteNotification: (id: string) => apiFetch<any>(`/notifications/${id}`, { method: 'DELETE' }),
  clearAllNotifications: () => apiFetch<any>('/notifications', { method: 'DELETE' }),

  // Farmer Cards & Charging
  checkFarmerCardBalance: (cardNumber: string) => apiFetch<any>(`/cards/${encodeURIComponent(cardNumber)}`),
  chargeFarmerCard: (cardNumber: string, amount: number) => apiFetch<any>('/cards/charge', { method: 'POST', body: JSON.stringify({ cardNumber, amount }) }),

  // Payments & Financial Ledger
  getPayments: () => apiFetch<any[]>('/payments'),
  createPayment: (payment: any) => apiFetch<any>('/payments', { method: 'POST', body: JSON.stringify(payment) }),
  updatePayment: (id: string, updated: any) => apiFetch<any>(`/payments/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(updated) }),
  deletePayment: (id: string) => apiFetch<any>(`/payments/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
