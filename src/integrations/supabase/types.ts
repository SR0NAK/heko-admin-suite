export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          action_type: string | null
          action_value: string | null
          active: boolean | null
          created_at: string
          display_order: number | null
          end_date: string | null
          id: string
          image: string
          start_date: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          action_type?: string | null
          action_value?: string | null
          active?: boolean | null
          created_at?: string
          display_order?: number | null
          end_date?: string | null
          id?: string
          image: string
          start_date?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          action_type?: string | null
          action_value?: string | null
          active?: boolean | null
          created_at?: string
          display_order?: number | null
          end_date?: string | null
          id?: string
          image?: string
          start_date?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean | null
          created_at: string
          display_order: number | null
          id: string
          image: string | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          display_order?: number | null
          id?: string
          image?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          display_order?: number | null
          id?: string
          image?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          accepted_at: string | null
          assigned_at: string | null
          created_at: string
          delivered_at: string | null
          delivery_address: string
          delivery_partner_id: string | null
          id: string
          order_id: string
          otp: string
          picked_at: string | null
          pickup_address: string
          status: Database["public"]["Enums"]["delivery_status"] | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_address: string
          delivery_partner_id?: string | null
          id?: string
          order_id: string
          otp: string
          picked_at?: string | null
          pickup_address: string
          status?: Database["public"]["Enums"]["delivery_status"] | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_address?: string
          delivery_partner_id?: string | null
          id?: string
          order_id?: string
          otp?: string
          picked_at?: string | null
          pickup_address?: string
          status?: Database["public"]["Enums"]["delivery_status"] | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "delivery_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_items: {
        Row: {
          created_at: string
          delivery_id: string
          id: string
          order_item_id: string
        }
        Insert: {
          created_at?: string
          delivery_id: string
          id?: string
          order_item_id: string
        }
        Update: {
          created_at?: string
          delivery_id?: string
          id?: string
          order_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_items_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_partners: {
        Row: {
          active_deliveries: number | null
          completed_deliveries: number | null
          created_at: string
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string
          rating: number | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string
          user_id: string | null
          vehicle_number: string | null
          vehicle_type: string | null
        }
        Insert: {
          active_deliveries?: number | null
          completed_deliveries?: number | null
          created_at?: string
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone: string
          rating?: number | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string
          user_id?: string | null
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Update: {
          active_deliveries?: number | null
          completed_deliveries?: number | null
          created_at?: string
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string
          user_id?: string | null
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          status: Database["public"]["Enums"]["item_status"] | null
          total_price: number
          unit_price: number
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity: number
          status?: Database["public"]["Enums"]["item_status"] | null
          total_price: number
          unit_price: number
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          status?: Database["public"]["Enums"]["item_status"] | null
          total_price?: number
          unit_price?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          created_at: string
          delivery_fee: number | null
          delivery_window_end: string | null
          delivery_window_start: string | null
          discount: number | null
          id: string
          notes: string | null
          order_number: string
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
          wallet_used: number | null
        }
        Insert: {
          address_id?: string | null
          created_at?: string
          delivery_fee?: number | null
          delivery_window_end?: string | null
          delivery_window_start?: string | null
          discount?: number | null
          id?: string
          notes?: string | null
          order_number: string
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at?: string
          user_id?: string | null
          wallet_used?: number | null
        }
        Update: {
          address_id?: string | null
          created_at?: string
          delivery_fee?: number | null
          delivery_window_end?: string | null
          delivery_window_start?: string | null
          discount?: number | null
          id?: string
          notes?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
          wallet_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          discount: number | null
          id: string
          images: string[] | null
          in_stock: boolean | null
          ingredients: string | null
          mrp: number
          name: string
          nutrition: Json | null
          price: number
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number | null
          subcategory_id: string | null
          tags: string[] | null
          unit: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount?: number | null
          id?: string
          images?: string[] | null
          in_stock?: boolean | null
          ingredients?: string | null
          mrp: number
          name: string
          nutrition?: Json | null
          price: number
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          subcategory_id?: string | null
          tags?: string[] | null
          unit: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount?: number | null
          id?: string
          images?: string[] | null
          in_stock?: boolean | null
          ingredients?: string | null
          mrp?: number
          name?: string
          nutrition?: Json | null
          price?: number
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          subcategory_id?: string | null
          tags?: string[] | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          actual_wallet: number
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          referral_code: string
          referred_by: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          virtual_wallet: number
        }
        Insert: {
          actual_wallet?: number
          created_at?: string
          email?: string | null
          id: string
          name: string
          phone: string
          referral_code: string
          referred_by?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          virtual_wallet?: number
        }
        Update: {
          actual_wallet?: number
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          referral_code?: string
          referred_by?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          virtual_wallet?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["referral_code"]
          },
        ]
      }
      referral_conversions: {
        Row: {
          conversion_attempted_at: string | null
          converted: boolean | null
          converted_at: string | null
          created_at: string
          failure_reason: string | null
          id: string
          order_id: string
          order_value: number
          referee_id: string
          referrer_id: string
          reward_amount: number
        }
        Insert: {
          conversion_attempted_at?: string | null
          converted?: boolean | null
          converted_at?: string | null
          created_at?: string
          failure_reason?: string | null
          id?: string
          order_id: string
          order_value: number
          referee_id: string
          referrer_id: string
          reward_amount: number
        }
        Update: {
          conversion_attempted_at?: string | null
          converted?: boolean | null
          converted_at?: string | null
          created_at?: string
          failure_reason?: string | null
          id?: string
          order_id?: string
          order_value?: number
          referee_id?: string
          referrer_id?: string
          reward_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "referral_conversions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      return_items: {
        Row: {
          created_at: string
          id: string
          order_item_id: string
          quantity: number
          return_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_item_id: string
          quantity: number
          return_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_item_id?: string
          quantity?: number
          return_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          order_id: string
          picked_up_at: string | null
          pickup_otp: string | null
          pickup_scheduled_at: string | null
          reason: string
          refund_amount: number | null
          status: Database["public"]["Enums"]["return_status"] | null
          updated_at: string
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          order_id: string
          picked_up_at?: string | null
          pickup_otp?: string | null
          pickup_scheduled_at?: string | null
          reason: string
          refund_amount?: number | null
          status?: Database["public"]["Enums"]["return_status"] | null
          updated_at?: string
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          order_id?: string
          picked_up_at?: string | null
          pickup_otp?: string | null
          pickup_scheduled_at?: string | null
          reason?: string
          refund_amount?: number | null
          status?: Database["public"]["Enums"]["return_status"] | null
          updated_at?: string
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          active: boolean | null
          category_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string
          id: string
          is_default: boolean | null
          label: string | null
          latitude: number | null
          longitude: number | null
          pincode: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          pincode: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          pincode?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_products: {
        Row: {
          id: string
          is_available: boolean | null
          product_id: string
          stock_quantity: number | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          id?: string
          is_available?: boolean | null
          product_id: string
          stock_quantity?: number | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          id?: string
          is_available?: boolean | null
          product_id?: string
          stock_quantity?: number | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          acceptance_rate: number | null
          address: string
          business_name: string
          completed_orders: number | null
          created_at: string
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          owner_name: string
          phone: string
          rating: number | null
          service_radius: number | null
          status: Database["public"]["Enums"]["user_status"] | null
          total_orders: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          address: string
          business_name: string
          completed_orders?: number | null
          created_at?: string
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner_name: string
          phone: string
          rating?: number | null
          service_radius?: number | null
          status?: Database["public"]["Enums"]["user_status"] | null
          total_orders?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          address?: string
          business_name?: string
          completed_orders?: number | null
          created_at?: string
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner_name?: string
          phone?: string
          rating?: number | null
          service_radius?: number | null
          status?: Database["public"]["Enums"]["user_status"] | null
          total_orders?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          kind: Database["public"]["Enums"]["transaction_kind"]
          order_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          kind: Database["public"]["Enums"]["transaction_kind"]
          order_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["transaction_kind"]
          order_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
          wallet_type?: Database["public"]["Enums"]["wallet_type"]
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_roles_with_details: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          name: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "vendor" | "delivery_partner" | "customer"
      delivery_status:
        | "assigned"
        | "accepted"
        | "picked"
        | "out_for_delivery"
        | "delivered"
        | "failed"
      item_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "preparing"
        | "out_for_delivery"
        | "delivered"
        | "unfulfillable"
        | "canceled"
      order_status:
        | "placed"
        | "processing"
        | "partially_accepted"
        | "preparing"
        | "out_for_delivery"
        | "delivered"
        | "partially_delivered"
        | "unfulfillable"
        | "canceled"
        | "failed"
      product_status: "active" | "paused" | "stopped"
      return_status:
        | "requested"
        | "approved"
        | "rejected"
        | "pickup_scheduled"
        | "picked_up"
        | "completed"
      transaction_kind:
        | "cashback"
        | "referral_reward"
        | "refund"
        | "order_payment"
        | "adjustment"
      transaction_type: "credit" | "debit"
      user_status: "active" | "blocked" | "inactive"
      wallet_type: "virtual" | "actual"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "vendor", "delivery_partner", "customer"],
      delivery_status: [
        "assigned",
        "accepted",
        "picked",
        "out_for_delivery",
        "delivered",
        "failed",
      ],
      item_status: [
        "pending",
        "accepted",
        "rejected",
        "preparing",
        "out_for_delivery",
        "delivered",
        "unfulfillable",
        "canceled",
      ],
      order_status: [
        "placed",
        "processing",
        "partially_accepted",
        "preparing",
        "out_for_delivery",
        "delivered",
        "partially_delivered",
        "unfulfillable",
        "canceled",
        "failed",
      ],
      product_status: ["active", "paused", "stopped"],
      return_status: [
        "requested",
        "approved",
        "rejected",
        "pickup_scheduled",
        "picked_up",
        "completed",
      ],
      transaction_kind: [
        "cashback",
        "referral_reward",
        "refund",
        "order_payment",
        "adjustment",
      ],
      transaction_type: ["credit", "debit"],
      user_status: ["active", "blocked", "inactive"],
      wallet_type: ["virtual", "actual"],
    },
  },
} as const
