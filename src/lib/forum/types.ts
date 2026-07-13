export interface ForumUser {
  id: string; username: string; avatar_url: string;
}

export interface ForumPost {
  id: string; title: string; content: string; author_id: string;
  category: string; likes: number; views: number; comment_count: number;
  pinned: number; created_at: string; updated_at: string;
  username?: string; avatar_url?: string;
}

export interface ForumComment {
  id: string; post_id: string; content: string; author_id: string;
  created_at: string; username?: string; avatar_url?: string;
}
