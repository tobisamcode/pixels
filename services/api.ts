// MockAPI.io endpoints - Replace with your actual MockAPI project URL
// To set up your own MockAPI:
// 1. Go to https://mockapi.io/ and create an account
// 2. Create a project and add resources for 'users' and 'bankAccounts'
// 3. Replace this URL with your MockAPI project URL
const BASE_URL = "https://your-project-id.mockapi.io/api/v1";

// For demo purposes, we'll use a fallback mock implementation
const USE_MOCK_FALLBACK = true;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  name: string;
  email: string;
  token: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: "Checking" | "Savings" | "Credit";
  balance: number;
  currency: string;
  cardColor: string;
  bankName: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// Mock data for fallback
const MOCK_USERS: LoginResponse[] = [
  {
    id: "1",
    username: "john.doe",
    name: "John Doe",
    email: "john.doe@example.com",
    token: "",
  },
  {
    id: "2",
    username: "jane.smith",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    token: "",
  },
  {
    id: "3",
    username: "demo",
    name: "Demo User",
    email: "demo@example.com",
    token: "",
  },
];

const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "1",
    userId: "1",
    accountNumber: "****1234",
    accountType: "Checking",
    balance: 5420.5,
    currency: "USD",
    cardColor: "#6366f1",
    bankName: "Premier Bank",
  },
  {
    id: "2",
    userId: "1",
    accountNumber: "****5678",
    accountType: "Savings",
    balance: 12750.0,
    currency: "USD",
    cardColor: "#10b981",
    bankName: "Premier Bank",
  },
  {
    id: "3",
    userId: "1",
    accountNumber: "****9012",
    accountType: "Credit",
    balance: -2340.75,
    currency: "USD",
    cardColor: "#f59e0b",
    bankName: "Premier Credit",
  },
  {
    id: "4",
    userId: "2",
    accountNumber: "****3456",
    accountType: "Checking",
    balance: 8720.25,
    currency: "USD",
    cardColor: "#8b5cf6",
    bankName: "Metro Bank",
  },
  {
    id: "5",
    userId: "2",
    accountNumber: "****7890",
    accountType: "Savings",
    balance: 25430.8,
    currency: "USD",
    cardColor: "#06b6d4",
    bankName: "Metro Bank",
  },
  {
    id: "6",
    userId: "3",
    accountNumber: "****1111",
    accountType: "Checking",
    balance: 1250.0,
    currency: "USD",
    cardColor: "#ef4444",
    bankName: "City Bank",
  },
];

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (USE_MOCK_FALLBACK) {
      // Use mock data for demo
      return this.mockRequest<T>(endpoint, options);
    }

    const url = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        throw {
          message: errorData || `HTTP ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  private async mockRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const method = options.method || "GET";

    if (endpoint === "/users" && method === "GET") {
      return MOCK_USERS as T;
    }

    if (endpoint === "/bankAccounts" && method === "GET") {
      return MOCK_BANK_ACCOUNTS as T;
    }

    // For other endpoints, return empty response
    return {} as T;
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // For demo purposes, we'll simulate authentication by finding a user
    // In a real scenario, this would be a POST to /auth/login
    const users = await this.request<LoginResponse[]>("/users");

    const user = users.find(
      (u) => u.username.toLowerCase() === credentials.username.toLowerCase()
    );

    if (!user) {
      throw {
        message: "Invalid username or password",
        status: 401,
      } as ApiError;
    }

    // In a real app, you'd verify the password here
    // For demo, we'll accept any password for existing users
    return {
      ...user,
      token: `mock_token_${user.id}_${Date.now()}`,
    };
  }

  async getUsers(): Promise<LoginResponse[]> {
    return this.request<LoginResponse[]>("/users");
  }

  async createUser(
    userData: Omit<LoginResponse, "id" | "token">
  ): Promise<LoginResponse> {
    return this.request<LoginResponse>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Bank Account endpoints
  async getBankAccounts(userId: string): Promise<BankAccount[]> {
    const accounts = await this.request<BankAccount[]>("/bankAccounts");
    return accounts.filter((account) => account.userId === userId);
  }

  async createBankAccount(
    accountData: Omit<BankAccount, "id">
  ): Promise<BankAccount> {
    return this.request<BankAccount>("/bankAccounts", {
      method: "POST",
      body: JSON.stringify(accountData),
    });
  }

  async updateBankAccount(
    accountId: string,
    updates: Partial<BankAccount>
  ): Promise<BankAccount> {
    return this.request<BankAccount>(`/bankAccounts/${accountId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteBankAccount(accountId: string): Promise<void> {
    await this.request(`/bankAccounts/${accountId}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
