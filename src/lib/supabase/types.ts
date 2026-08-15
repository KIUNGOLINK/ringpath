export type Stance = "ORTHODOX" | "SOUTHPAW";
export type SessionType = "Technical" | "Pads" | "Sparring" | "Conditioning" | "Roadwork" | "Recovery";
export type Role = "boxer" | "coach";

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
          created_at: string;
        };
        Insert: {
          id: string;
          role: Role;
          first_name?: string;
          last_name?: string;
        };
        Update: Partial<{
          first_name: string;
          last_name: string;
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
          created_at: string;
        };
        Insert: {
          profile_id: string;
          weight_kg?: number | null;
          stance?: Stance | null;
          coach_id?: string | null;
          wins?: number;
          losses?: number;
        };
        Update: Partial<{
          weight_kg: number | null;
          stance: Stance | null;
          coach_id: string | null;
          wins: number;
          losses: number;
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
        };
        Update: Partial<{
          title: string;
          subtitle: string;
          session_type: SessionType;
          completed: boolean;
          energy: number | null;
          difficulty: number | null;
        }>;
        Relationships: [];
      };
    };
  };
}
