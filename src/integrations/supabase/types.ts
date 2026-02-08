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
      ApiKey: {
        Row: {
          apiKey: string
          createdAt: string
          id: string
          service: string
          updatedAt: string
          userId: string
        }
        Insert: {
          apiKey: string
          createdAt?: string
          id: string
          service: string
          updatedAt: string
          userId: string
        }
        Update: {
          apiKey?: string
          createdAt?: string
          id?: string
          service?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ApiKey_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_snapshots: {
        Row: {
          chartType: string
          config: Json
          createdAt: string
          id: string
          userId: string
        }
        Insert: {
          chartType: string
          config: Json
          createdAt?: string
          id: string
          userId: string
        }
        Update: {
          chartType?: string
          config?: Json
          createdAt?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ChartSnapshot_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ConversationEvent: {
        Row: {
          actor: string | null
          conversationId: string | null
          conversationType: string | null
          createdAt: string
          id: string
          payload: Json
          researchSessionId: string | null
          type: string
          userId: string
        }
        Insert: {
          actor?: string | null
          conversationId?: string | null
          conversationType?: string | null
          createdAt?: string
          id: string
          payload: Json
          researchSessionId?: string | null
          type: string
          userId: string
        }
        Update: {
          actor?: string | null
          conversationId?: string | null
          conversationType?: string | null
          createdAt?: string
          id?: string
          payload?: Json
          researchSessionId?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ConversationEvent_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      GoogleToken: {
        Row: {
          accessToken: string
          createdAt: string
          expiresAt: string
          id: string
          refreshToken: string
          updatedAt: string
          userId: string
        }
        Insert: {
          accessToken: string
          createdAt?: string
          expiresAt: string
          id: string
          refreshToken: string
          updatedAt: string
          userId: string
        }
        Update: {
          accessToken?: string
          createdAt?: string
          expiresAt?: string
          id?: string
          refreshToken?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "GoogleToken_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversationId: string
          conversationType: string
          createdAt: string
          id: string
          metadata: Json | null
          modelUsed: string | null
          role: string
          tokensUsed: number | null
        }
        Insert: {
          content: string
          conversationId: string
          conversationType: string
          createdAt?: string
          id: string
          metadata?: Json | null
          modelUsed?: string | null
          role: string
          tokensUsed?: number | null
        }
        Update: {
          content?: string
          conversationId?: string
          conversationType?: string
          createdAt?: string
          id?: string
          metadata?: Json | null
          modelUsed?: string | null
          role?: string
          tokensUsed?: number | null
        }
        Relationships: []
      }
      page_snapshots: {
        Row: {
          createdAt: string
          id: string
          text: string | null
          title: string | null
          url: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          text?: string | null
          title?: string | null
          url: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          text?: string | null
          title?: string | null
          url?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "PageSnapshot_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Project: {
        Row: {
          contextSummary: string | null
          createdAt: string
          description: string | null
          firecrawl_crawl_id: string | null
          id: string
          instructions: string | null
          isActive: boolean
          title: string
          updatedAt: string
          userId: string
        }
        Insert: {
          contextSummary?: string | null
          createdAt?: string
          description?: string | null
          firecrawl_crawl_id?: string | null
          id: string
          instructions?: string | null
          isActive?: boolean
          title: string
          updatedAt: string
          userId: string
        }
        Update: {
          contextSummary?: string | null
          createdAt?: string
          description?: string | null
          firecrawl_crawl_id?: string | null
          id?: string
          instructions?: string | null
          isActive?: boolean
          title?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Project_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_memory: {
        Row: {
          createdAt: string
          fact: string
          id: string
          importance: number
          projectId: string
          sourceConversationId: string | null
          sourceType: string
        }
        Insert: {
          createdAt?: string
          fact: string
          id: string
          importance?: number
          projectId: string
          sourceConversationId?: string | null
          sourceType?: string
        }
        Update: {
          createdAt?: string
          fact?: string
          id?: string
          importance?: number
          projectId?: string
          sourceConversationId?: string | null
          sourceType?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_memory_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
        ]
      }
      ProjectConversation: {
        Row: {
          createdAt: string
          id: string
          pinned: boolean
          projectId: string
          title: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          pinned?: boolean
          projectId: string
          title: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          pinned?: boolean
          projectId?: string
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ProjectConversation_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
        ]
      }
      Prompt: {
        Row: {
          completionTokens: number | null
          createdAt: string
          id: string
          model: string | null
          promptText: string
          promptTokens: number | null
          responseText: string | null
          tokensUsed: number | null
          userId: string
        }
        Insert: {
          completionTokens?: number | null
          createdAt?: string
          id: string
          model?: string | null
          promptText: string
          promptTokens?: number | null
          responseText?: string | null
          tokensUsed?: number | null
          userId: string
        }
        Update: {
          completionTokens?: number | null
          createdAt?: string
          id?: string
          model?: string | null
          promptText?: string
          promptTokens?: number | null
          responseText?: string | null
          tokensUsed?: number | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Prompt_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ResearchSession: {
        Row: {
          accepted: boolean | null
          completedAt: string | null
          conversationId: string | null
          conversationType: string | null
          createdAt: string
          currentPlanItem: number | null
          firecrawlJobId: string | null
          id: string
          plan: Json | null
          query: string
          sources: Json | null
          status: string
          summary: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          accepted?: boolean | null
          completedAt?: string | null
          conversationId?: string | null
          conversationType?: string | null
          createdAt?: string
          currentPlanItem?: number | null
          firecrawlJobId?: string | null
          id: string
          plan?: Json | null
          query: string
          sources?: Json | null
          status?: string
          summary?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          accepted?: boolean | null
          completedAt?: string | null
          conversationId?: string | null
          conversationType?: string | null
          createdAt?: string
          currentPlanItem?: number | null
          firecrawlJobId?: string | null
          id?: string
          plan?: Json | null
          query?: string
          sources?: Json | null
          status?: string
          summary?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ResearchSession_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ResearchStep: {
        Row: {
          completedAt: string | null
          createdAt: string
          description: string | null
          error: string | null
          id: string
          metadata: Json | null
          order: number
          sessionId: string
          startedAt: string | null
          status: string
          title: string
          type: string
          updatedAt: string
          url: string | null
        }
        Insert: {
          completedAt?: string | null
          createdAt?: string
          description?: string | null
          error?: string | null
          id: string
          metadata?: Json | null
          order: number
          sessionId: string
          startedAt?: string | null
          status?: string
          title: string
          type: string
          updatedAt: string
          url?: string | null
        }
        Update: {
          completedAt?: string | null
          createdAt?: string
          description?: string | null
          error?: string | null
          id?: string
          metadata?: Json | null
          order?: number
          sessionId?: string
          startedAt?: string | null
          status?: string
          title?: string
          type?: string
          updatedAt?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ResearchStep_sessionId_fkey"
            columns: ["sessionId"]
            isOneToOne: false
            referencedRelation: "ResearchSession"
            referencedColumns: ["id"]
          },
        ]
      }
      SelectedElement: {
        Row: {
          createdAt: string
          id: string
          roleHint: string
          url: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          roleHint: string
          url: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          roleHint?: string
          url?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "SelectedElement_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Session: {
        Row: {
          endedAt: string | null
          id: string
          requestCount: number | null
          source: string | null
          startedAt: string
          userId: string
        }
        Insert: {
          endedAt?: string | null
          id: string
          requestCount?: number | null
          source?: string | null
          startedAt?: string
          userId: string
        }
        Update: {
          endedAt?: string | null
          id?: string
          requestCount?: number | null
          source?: string | null
          startedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      StandaloneConversation: {
        Row: {
          createdAt: string
          id: string
          projectId: string | null
          title: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          projectId?: string | null
          title: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          projectId?: string | null
          title?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "StandaloneConversation_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "StandaloneConversation_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Subscription: {
        Row: {
          createdAt: string
          currentPeriodEnd: string | null
          currentPeriodStart: string | null
          id: string
          plan: string
          polarCustomerId: string | null
          polarSubscriptionId: string | null
          status: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          currentPeriodEnd?: string | null
          currentPeriodStart?: string | null
          id: string
          plan?: string
          polarCustomerId?: string | null
          polarSubscriptionId?: string | null
          status?: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          currentPeriodEnd?: string | null
          currentPeriodStart?: string | null
          id?: string
          plan?: string
          polarCustomerId?: string | null
          polarSubscriptionId?: string | null
          status?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Subscription_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      TokenUsage: {
        Row: {
          completionTokens: number | null
          createdAt: string
          date: string
          id: string
          promptTokens: number | null
          totalRequests: number | null
          totalTokens: number | null
          updatedAt: string
          userId: string
        }
        Insert: {
          completionTokens?: number | null
          createdAt?: string
          date: string
          id: string
          promptTokens?: number | null
          totalRequests?: number | null
          totalTokens?: number | null
          updatedAt: string
          userId: string
        }
        Update: {
          completionTokens?: number | null
          createdAt?: string
          date?: string
          id?: string
          promptTokens?: number | null
          totalRequests?: number | null
          totalTokens?: number | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "TokenUsage_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_memory: {
        Row: {
          content: string
          createdAt: string
          id: string
          kind: string
          sourceConversationId: string | null
          sourceProjectId: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          id: string
          kind: string
          sourceConversationId?: string | null
          sourceProjectId?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          kind?: string
          sourceConversationId?: string | null
          sourceProjectId?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserMemory_sourceProjectId_fkey"
            columns: ["sourceProjectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserMemory_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatarUrl: string | null
          createdAt: string
          email: string | null
          fullName: string | null
          id: string
          updatedAt: string
        }
        Insert: {
          avatarUrl?: string | null
          createdAt?: string
          email?: string | null
          fullName?: string | null
          id: string
          updatedAt: string
        }
        Update: {
          avatarUrl?: string | null
          createdAt?: string
          email?: string | null
          fullName?: string | null
          id?: string
          updatedAt?: string
        }
        Relationships: []
      }
      UserSettings: {
        Row: {
          createdAt: string
          defaultLanguage: string
          maxTokens: number
          theme: string
          updatedAt: string
          userId: string
          writingStyle: string
        }
        Insert: {
          createdAt?: string
          defaultLanguage?: string
          maxTokens?: number
          theme?: string
          updatedAt: string
          userId: string
          writingStyle?: string
        }
        Update: {
          createdAt?: string
          defaultLanguage?: string
          maxTokens?: number
          theme?: string
          updatedAt?: string
          userId?: string
          writingStyle?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserSettings_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
