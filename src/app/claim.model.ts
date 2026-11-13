export interface Claim {
  id: number;
  employee: string;
  category: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface NewClaim {
  employee: string;
  category: string;
  amount: number;
  description: string;
}

/** Error body returned by the API for 4xx and 5xx responses. */
export interface ApiErrors {
  errors: string[];
}
