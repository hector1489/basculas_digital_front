
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer' | 'employee' | 'guest';
  
}

export interface AuthContextType {
  user: User | null;
    login: (userData: User, userToken: string) => void;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isEmployee: boolean;
  token?: string | null;
}