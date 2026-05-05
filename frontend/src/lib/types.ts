export interface ArtStyle {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tag: string;
  creditsRequired: number;
  prompt: string;
}

export interface Generation {
  _id: string;
  userId: string;
  styleId: string;
  styleName: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  prompt: string;
  creditsUsed: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface DashboardStats {
  user: {
    _id: string;
    name: string;
    email: string;
    credits: number;
  };
  stats: {
    totalGenerations: number;
    credits: number;
  };
  recentGenerations: Generation[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Record<string, string[]>;
}