// API Configuration and Service Layer
// DEPRECATED: This legacy API service is no longer used.
// All API calls should use the Supabase client from @/integrations/supabase/client
// This file is kept for reference only and should not be used in production.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    // Use Supabase session token instead of localStorage
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/admin/auth/logout', { method: 'POST' });
  }

  // Dashboard
  async getDashboardMetrics() {
    return this.request('/admin/dashboard/metrics');
  }

  async getSalesAnalytics(period: string) {
    return this.request(`/admin/dashboard/sales-analytics?period=${period}`);
  }

  // Users
  async getUsers(params: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${query}`);
  }

  async getUser(userId: string) {
    return this.request(`/admin/users/${userId}`);
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Products
  async getProducts(params: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/products?${query}`);
  }

  async createProduct(data: any) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(productId: string, data: any) {
    return this.request(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(productId: string) {
    return this.request(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories() {
    return this.request('/admin/categories');
  }

  async createCategory(data: any) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Orders
  async getOrders(params: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/orders?${query}`);
  }

  async getOrder(orderId: string) {
    return this.request(`/admin/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Wallet
  async getWalletTransactions(params: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/wallet/transactions?${query}`);
  }

  async adjustWallet(userId: string, amount: number, type: string, description: string) {
    return this.request('/admin/wallet/adjust', {
      method: 'POST',
      body: JSON.stringify({ userId, amount, type, description }),
    });
  }

  // Settings
  async getSettings() {
    return this.request('/admin/settings');
  }

  async updateSettings(data: any) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
