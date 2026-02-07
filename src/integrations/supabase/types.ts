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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          service: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id: string
          service: string
          updated_at: string
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          service?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_snapshots: {
        Row: {
          chart_type: string
          config: Json
          conversation_id: string
          conversation_type: string
          created_at: string
          data: Json | null
          id: string
          source_element_id: string | null
          source_type: string
          url: string
          user_id: string
        }
        Insert: {
          chart_type: string
          config: Json
          conversation_id: string
          conversation_type: string
          created_at?: string
          data?: Json | null
          id: string
          source_element_id?: string | null
          source_type: string
          url: string
          user_id: string
        }
        Update: {
          chart_type?: string
          config?: Json
          conversation_id?: string
          conversation_type?: string
          created_at?: string
          data?: Json | null
          id?: string
          source_element_id?: string | null
          source_type?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_events: {
        Row: {
          actor: string
          conversation_id: string
          conversation_type: string
          created_at: string
          event_type: string
          id: string
          payload: Json
          research_session_id: string | null
          user_id: string
        }
        Insert: {
          actor: string
          conversation_id: string
          conversation_type: string
          created_at?: string
          event_type: string
          id: string
          payload: Json
          research_session_id?: string | null
          user_id: string
        }
        Update: {
          actor?: string
          conversation_id?: string
          conversation_type?: string
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          research_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      google_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id: string
          refresh_token: string
          updated_at: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          conversation_type: string
          created_at: string
          id: string
          metadata: Json | null
          model_used: string | null
          role: string
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id: string
          conversation_type: string
          created_at?: string
          id: string
          metadata?: Json | null
          model_used?: string | null
          role: string
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string
          conversation_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          model_used?: string | null
          role?: string
          tokens_used?: number | null
        }
        Relationships: []
      }
      page_snapshots: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          meta: Json | null
          project_id: string | null
          text: string | null
          title: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id: string
          meta?: Json | null
          project_id?: string | null
          text?: string | null
          title?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          meta?: Json | null
          project_id?: string | null
          text?: string | null
          title?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_conversations: {
        Row: {
          created_at: string
          id: string
          pinned: boolean
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          pinned?: boolean
          project_id: string
          title: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          pinned?: boolean
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_memory: {
        Row: {
          created_at: string
          fact: string
          id: string
          importance: number
          project_id: string
          source_conversation_id: string | null
          source_type: string
        }
        Insert: {
          created_at?: string
          fact: string
          id: string
          importance?: number
          project_id: string
          source_conversation_id?: string | null
          source_type?: string
        }
        Update: {
          created_at?: string
          fact?: string
          id?: string
          importance?: number
          project_id?: string
          source_conversation_id?: string | null
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_memory_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          context_summary: string | null
          created_at: string
          description: string | null
          firecrawl_crawl_id: string | null
          id: string
          instructions: string | null
          is_active: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_summary?: string | null
          created_at?: string
          description?: string | null
          firecrawl_crawl_id?: string | null
          id: string
          instructions?: string | null
          is_active?: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Update: {
          context_summary?: string | null
          created_at?: string
          description?: string | null
          firecrawl_crawl_id?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          completion_tokens: number | null
          created_at: string
          id: string
          model: string | null
          prompt_text: string
          prompt_tokens: number | null
          response_text: string | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string
          id?: string
          model?: string | null
          prompt_text: string
          prompt_tokens?: number | null
          response_text?: string | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string
          id?: string
          model?: string | null
          prompt_text?: string
          prompt_tokens?: number | null
          response_text?: string | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      research_sessions: {
        Row: {
          accepted: boolean | null
          completed_at: string | null
          conversation_id: string
          conversation_type: string
          created_at: string
          current_plan_item: number | null
          firecrawl_job_id: string | null
          id: string
          plan: Json | null
          query: string
          sources: Json | null
          status: string
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted?: boolean | null
          completed_at?: string | null
          conversation_id: string
          conversation_type: string
          created_at?: string
          current_plan_item?: number | null
          firecrawl_job_id?: string | null
          id: string
          plan?: Json | null
          query: string
          sources?: Json | null
          status?: string
          summary?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          accepted?: boolean | null
          completed_at?: string | null
          conversation_id?: string
          conversation_type?: string
          created_at?: string
          current_plan_item?: number | null
          firecrawl_job_id?: string | null
          id?: string
          plan?: Json | null
          query?: string
          sources?: Json | null
          status?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      research_steps: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          error: string | null
          id: string
          metadata: Json | null
          order: number
          session_id: string
          started_at: string | null
          status: string
          title: string
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          error?: string | null
          id: string
          metadata?: Json | null
          order: number
          session_id: string
          started_at?: string | null
          status?: string
          title: string
          type: string
          updated_at: string
          url?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          error?: string | null
          id?: string
          metadata?: Json | null
          order?: number
          session_id?: string
          started_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_steps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "research_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      selected_elements: {
        Row: {
          bounding_box: Json | null
          conversation_id: string
          conversation_type: string
          created_at: string
          element_class: string | null
          element_id: string | null
          html_snippet: string | null
          id: string
          role_hint: string
          text_snippet: string | null
          url: string
          user_id: string
        }
        Insert: {
          bounding_box?: Json | null
          conversation_id: string
          conversation_type: string
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          html_snippet?: string | null
          id: string
          role_hint: string
          text_snippet?: string | null
          url: string
          user_id: string
        }
        Update: {
          bounding_box?: Json | null
          conversation_id?: string
          conversation_type?: string
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          html_snippet?: string | null
          id?: string
          role_hint?: string
          text_snippet?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "selected_elements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          ended_at: string | null
          id: string
          request_count: number | null
          source: string | null
          started_at: string
          user_id: string
        }
        Insert: {
          ended_at?: string | null
          id?: string
          request_count?: number | null
          source?: string | null
          started_at?: string
          user_id: string
        }
        Update: {
          ended_at?: string | null
          id?: string
          request_count?: number | null
          source?: string | null
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      standalone_conversations: {
        Row: {
          created_at: string
          id: string
          project_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          project_id?: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "standalone_conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standalone_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          polar_customer_id: string | null
          polar_subscription_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          polar_customer_id?: string | null
          polar_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          polar_customer_id?: string | null
          polar_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      token_usage: {
        Row: {
          completion_tokens: number | null
          created_at: string
          date: string
          id: string
          prompt_tokens: number | null
          total_requests: number | null
          total_tokens: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string
          date?: string
          id?: string
          prompt_tokens?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string
          date?: string
          id?: string
          prompt_tokens?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_memory: {
        Row: {
          content: string
          created_at: string
          id: string
          kind: string
          source_conversation_id: string | null
          source_project_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id: string
          kind: string
          source_conversation_id?: string | null
          source_project_id?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          kind?: string
          source_conversation_id?: string | null
          source_project_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_memory_source_project_id_fkey"
            columns: ["source_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_memory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          default_language: string
          id: string
          max_tokens: number
          theme: string
          updated_at: string
          user_id: string
          writing_style: string
        }
        Insert: {
          created_at?: string
          default_language?: string
          id: string
          max_tokens?: number
          theme?: string
          updated_at: string
          user_id: string
          writing_style?: string
        }
        Update: {
          created_at?: string
          default_language?: string
          id?: string
          max_tokens?: number
          theme?: string
          updated_at?: string
          user_id?: string
          writing_style?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          name?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_token_usage: {
        Args: {
          p_completion_tokens?: number
          p_prompt_tokens?: number
          p_tokens: number
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
