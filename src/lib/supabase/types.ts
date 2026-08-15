export type Stance = "ORTHODOX" | "SOUTHPAW";
export type SessionType = "Technical" | "Pads" | "Sparring" | "Conditioning" | "Roadwork" | "Recovery";
export type Role = "boxer" | "coach";
export type AppMode = "compet" | "spar";
export type SparMode = "OPEN_ROUNDS" | "CAMP_SPAR";
export type SparSessionStatus = "OPEN" | "FULL" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type SparIntensity = "TECHNICAL" | "MODERATE" | "COMPETITION_PREP";
export type SparJoinRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";
export type SparParticipantRole = "HOST" | "PARTICIPANT";

export interface Database {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: Role;
          first_name: string;
          last_name: string;
          last_app_mode: AppMode;
          created_at: string;
        };
        Insert: {
          id: string;
          role: Role;
          first_name?: string;
          last_name?: string;
          last_app_mode?: AppMode;
        };
        Update: Partial<{
          first_name: string;
          last_name: string;
          last_app_mode: AppMode;
        }>;
        Relationships: [];
      };
      coaches: {
        Row: {
          profile_id: string;
          club_name: string;
          club_code: string;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          club_name?: string;
          club_code: string;
        };
        Update: Partial<{
          club_name: string;
        }>;
        Relationships: [];
      };
      boxers: {
        Row: {
          profile_id: string;
          weight_kg: number | null;
          stance: Stance | null;
          coach_id: string | null;
          wins: number;
          losses: number;
          photo_url: string | null;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          weight_kg?: number | null;
          stance?: Stance | null;
          coach_id?: string | null;
          wins?: number;
          losses?: number;
          photo_url?: string | null;
        };
        Update: Partial<{
          weight_kg: number | null;
          stance: Stance | null;
          coach_id: string | null;
          wins: number;
          losses: number;
          photo_url: string | null;
        }>;
        Relationships: [];
      };
      camps: {
        Row: {
          id: string;
          boxer_id: string;
          opponent_name: string;
          fight_date: string | null;
          week_current: number;
          week_total: number;
          objectives: string[];
          created_at: string;
        };
        Insert: {
          boxer_id: string;
          opponent_name?: string;
          fight_date?: string | null;
          week_current?: number;
          week_total?: number;
          objectives?: string[];
        };
        Update: Partial<{
          opponent_name: string;
          fight_date: string | null;
          week_current: number;
          week_total: number;
          objectives: string[];
        }>;
        Relationships: [];
      };
      sessions: {
        Row: {
          id: string;
          camp_id: string;
          scheduled_for: string;
          title: string;
          subtitle: string;
          session_type: SessionType;
          completed: boolean;
          energy: number | null;
          difficulty: number | null;
          duration_minutes: number | null;
          objective: string | null;
          created_at: string;
        };
        Insert: {
          camp_id: string;
          scheduled_for?: string;
          title: string;
          subtitle?: string;
          session_type?: SessionType;
          completed?: boolean;
          energy?: number | null;
          difficulty?: number | null;
          duration_minutes?: number | null;
          objective?: string | null;
        };
        Update: Partial<{
          title: string;
          subtitle: string;
          session_type: SessionType;
          completed: boolean;
          energy: number | null;
          difficulty: number | null;
          duration_minutes: number | null;
          objective: string | null;
        }>;
        Relationships: [];
      };
      spar_sessions: {
        Row: {
          id: string;
          host_id: string;
          mode: SparMode;
          status: SparSessionStatus;
          title: string | null;
          description: string | null;
          session_date: string;
          start_time: string;
          duration_minutes: number | null;
          city: string;
          venue_name: string | null;
          min_weight_kg: number | null;
          max_weight_kg: number | null;
          requested_stance: Stance | "ANY" | null;
          level: string | null;
          intensity: SparIntensity;
          target_rounds: number | null;
          max_participants: number;
          camp_id: string | null;
          venue_price_eur: number | null;
          payment_link_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          host_id: string;
          mode: SparMode;
          status?: SparSessionStatus;
          title?: string | null;
          description?: string | null;
          session_date: string;
          start_time: string;
          duration_minutes?: number | null;
          city: string;
          venue_name?: string | null;
          min_weight_kg?: number | null;
          max_weight_kg?: number | null;
          requested_stance?: Stance | "ANY" | null;
          level?: string | null;
          intensity?: SparIntensity;
          target_rounds?: number | null;
          max_participants?: number;
          camp_id?: string | null;
          venue_price_eur?: number | null;
          payment_link_url?: string | null;
        };
        Update: Partial<{
          status: SparSessionStatus;
          title: string | null;
          description: string | null;
          session_date: string;
          start_time: string;
          duration_minutes: number | null;
          city: string;
          venue_name: string | null;
          min_weight_kg: number | null;
          max_weight_kg: number | null;
          venue_price_eur: number | null;
          payment_link_url: string | null;
          requested_stance: Stance | "ANY" | null;
          level: string | null;
          intensity: SparIntensity;
          target_rounds: number | null;
          max_participants: number;
          camp_id: string | null;
        }>;
        Relationships: [];
      };
      spar_join_requests: {
        Row: {
          id: string;
          spar_session_id: string;
          requester_id: string;
          message: string | null;
          status: SparJoinRequestStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          spar_session_id: string;
          requester_id: string;
          message?: string | null;
          status?: SparJoinRequestStatus;
        };
        Update: Partial<{
          message: string | null;
          status: SparJoinRequestStatus;
        }>;
        Relationships: [];
      };
      spar_participants: {
        Row: {
          id: string;
          spar_session_id: string;
          user_id: string;
          role: SparParticipantRole;
          payment_confirmed: boolean;
          joined_at: string;
        };
        Insert: {
          spar_session_id: string;
          user_id: string;
          role?: SparParticipantRole;
          payment_confirmed?: boolean;
        };
        Update: Partial<{
          role: SparParticipantRole;
          payment_confirmed: boolean;
        }>;
        Relationships: [];
      };
      spar_feedback: {
        Row: {
          id: string;
          spar_session_id: string;
          author_id: string;
          target_id: string;
          would_spar_again: boolean;
          respectful: boolean | null;
          controlled_intensity: boolean | null;
          on_time: boolean | null;
          matched_description: boolean | null;
          safe_partner: boolean | null;
          good_communication: boolean | null;
          private_comment: string | null;
          created_at: string;
        };
        Insert: {
          spar_session_id: string;
          author_id: string;
          target_id: string;
          would_spar_again: boolean;
          respectful?: boolean | null;
          controlled_intensity?: boolean | null;
          on_time?: boolean | null;
          matched_description?: boolean | null;
          safe_partner?: boolean | null;
          good_communication?: boolean | null;
          private_comment?: string | null;
        };
        Update: Partial<Record<string, never>>;
        Relationships: [];
      };
      spar_reports: {
        Row: {
          id: string;
          spar_session_id: string | null;
          reporter_id: string;
          reported_id: string | null;
          reason: string;
          details: string | null;
          created_at: string;
        };
        Insert: {
          spar_session_id?: string | null;
          reporter_id: string;
          reported_id?: string | null;
          reason: string;
          details?: string | null;
        };
        Update: Partial<Record<string, never>>;
        Relationships: [];
      };
    };
  };
}
