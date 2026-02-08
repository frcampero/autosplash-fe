export type UserRole = "admin" | "editor";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface UserListResponse {
  results: User[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}
