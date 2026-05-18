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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          body_markdown: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          og_image_url: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          body_markdown?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          og_image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          body_markdown?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          og_image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      click_events: {
        Row: {
          created_at: string
          element_tag: string | null
          element_text: string | null
          id: string
          page_path: string
          viewport_w: number | null
          visitor_id: string | null
          x_pct: number
          y_pct: number
        }
        Insert: {
          created_at?: string
          element_tag?: string | null
          element_text?: string | null
          id?: string
          page_path: string
          viewport_w?: number | null
          visitor_id?: string | null
          x_pct: number
          y_pct: number
        }
        Update: {
          created_at?: string
          element_tag?: string | null
          element_text?: string | null
          id?: string
          page_path?: string
          viewport_w?: number | null
          visitor_id?: string | null
          x_pct?: number
          y_pct?: number
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          col_no: number | null
          created_at: string
          error_type: string
          id: string
          line_no: number | null
          message: string
          metadata: Json | null
          page_url: string | null
          source: string | null
          stack: string | null
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          col_no?: number | null
          created_at?: string
          error_type?: string
          id?: string
          line_no?: number | null
          message: string
          metadata?: Json | null
          page_url?: string | null
          source?: string | null
          stack?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          col_no?: number | null
          created_at?: string
          error_type?: string
          id?: string
          line_no?: number | null
          message?: string
          metadata?: Json | null
          page_url?: string | null
          source?: string | null
          stack?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: Json
          created_at: string
          id: string
          page_slug: string
          section_key: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          page_slug: string
          section_key: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          page_slug?: string
          section_key?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          author_name: string
          body: string
          city: string | null
          created_at: string
          id: string
          is_approved: boolean
          is_featured: boolean
          language: string
          product_id: string
          rating: number
          title: string | null
          updated_at: string
          verified_buyer: boolean
        }
        Insert: {
          author_name: string
          body: string
          city?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          language?: string
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string
          verified_buyer?: boolean
        }
        Update: {
          author_name?: string
          body?: string
          city?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          language?: string
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string
          verified_buyer?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          buy_link: string
          category: string
          created_at: string
          description: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          is_active: boolean
          is_hot_selling: boolean
          name: string
          og_image_url: string | null
          original_price: number | null
          price: number
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          buy_link?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean
          is_hot_selling?: boolean
          name: string
          og_image_url?: string | null
          original_price?: number | null
          price: number
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          buy_link?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean
          is_hot_selling?: boolean
          name?: string
          og_image_url?: string | null
          original_price?: number | null
          price?: number
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_analytics: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          event_type: string
          id: string
          ip_address: string | null
          language: string | null
          metadata: Json
          os: string | null
          page_path: string
          referrer: string | null
          region: string | null
          screen_width: number | null
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          language?: string | null
          metadata?: Json
          os?: string | null
          page_path: string
          referrer?: string | null
          region?: string | null
          screen_width?: number | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          language?: string | null
          metadata?: Json
          os?: string | null
          page_path?: string
          referrer?: string | null
          region?: string | null
          screen_width?: number | null
          user_agent?: string | null
          visitor_id?: string | null
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
    }
    Views: {
      product_rating_stats: {
        Row: {
          avg_rating: number | null
          count_1: number | null
          count_2: number | null
          count_3: number | null
          count_4: number | null
          count_5: number | null
          product_id: string | null
          review_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
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
