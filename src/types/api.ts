// Account types
export interface Account {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email: string;
  phone?: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  prefs: Record<string, any>;
}

export interface UpdateAccountRequest {
  name?: string;
  email?: string;
  password?: string;
}
