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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          created_at: string
          filter_type: string
          id: string
          is_active: boolean
          section_type: string
          slug: string
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string
          filter_type?: string
          id?: string
          is_active?: boolean
          section_type?: string
          slug: string
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string
          filter_type?: string
          id?: string
          is_active?: boolean
          section_type?: string
          slug?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          images: string[] | null
          is_available: boolean
          name: string
          original_price: number | null
          price: number
          show_in_slider: boolean
          sort_order: number | null
          specs: Json | null
          tier: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_available?: boolean
          name: string
          original_price?: number | null
          price?: number
          show_in_slider?: boolean
          sort_order?: number | null
          specs?: Json | null
          tier?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_available?: boolean
          name?: string
          original_price?: number | null
          price?: number
          show_in_slider?: boolean
          sort_order?: number | null
          specs?: Json | null
          tier?: string | null
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
        ]
      }
      site_features: {
        Row: {
          category_slug: string | null
          created_at: string
          description: string
          icon_name: string
          id: string
          is_active: boolean
          sort_order: number | null
          title: string
        }
        Insert: {
          category_slug?: string | null
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          sort_order?: number | null
          title: string
        }
        Update: {
          category_slug?: string | null
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          admin_email: string | null
          facebook_url: string | null
          google_drive_url: string | null
          hero_image_url: string | null
          hero_product_id: string | null
          id: string
          location_url: string | null
          logo_url: string | null
          phone: string | null
          phone2: string | null
          phone3: string | null
          site_name: string
          site_type: string
          slider_disabled: boolean
          theme_mode: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          admin_email?: string | null
          facebook_url?: string | null
          google_drive_url?: string | null
          hero_image_url?: string | null
          hero_product_id?: string | null
          id?: string
          location_url?: string | null
          logo_url?: string | null
          phone?: string | null
          phone2?: string | null
          phone3?: string | null
          site_name?: string
          site_type?: string
          slider_disabled?: boolean
          theme_mode?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          admin_email?: string | null
          facebook_url?: string | null
          google_drive_url?: string | null
          hero_image_url?: string | null
          hero_product_id?: string | null
          id?: string
          location_url?: string | null
          logo_url?: string | null
          phone?: string | null
          phone2?: string | null
          phone3?: string | null
          site_name?: string
          site_type?: string
          slider_disabled?: boolean
          theme_mode?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_hero_product_id_fkey"
            columns: ["hero_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      site_texts: {
        Row: {
          description: string | null
          id: string
          text_key: string
          text_value: string
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: string
          text_key: string
          text_value?: string
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          text_key?: string
          text_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_stats: {
        Row: {
          date: string
          id: string
          unique_visitors: number
          visits: number
        }
        Insert: {
          date?: string
          id?: string
          unique_visitors?: number
          visits?: number
        }
        Update: {
          date?: string
          id?: string
          unique_visitors?: number
          visits?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      track_visit: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
