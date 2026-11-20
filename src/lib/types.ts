export type Role = "client" | "worker" | "admin";

export type TimestampLike = { seconds: number; nanoseconds?: number; toDate?: () => Date } | Date | null | undefined;

export type Subscription = {
  status: "inactive" | "active" | "expired";
  plan?: "client" | "worker" | null;
  paidAt?: TimestampLike;
  expiresAt?: TimestampLike; // null = lifetime
};

export type Verification = {
  status: "not_submitted" | "pending" | "verified" | "rejected";
  idProofUrl?: string;
  workPhotos?: string[];
  note?: string;
};

export type UserProfile = {
  uid: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  workType?: string;
  experience?: string;
  about?: string;
  subscription: Subscription;
  verification?: Verification;
  createdAt?: TimestampLike;
};

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  service: string;
  requirement: string;
  status: "new" | "contacted" | "closed";
  createdAt?: TimestampLike;
};

export type RequestStatus =
  | "new"
  | "contacted"
  | "assigned"
  | "in_progress"
  | "work_submitted"
  | "completed"
  | "cancelled";

export type ServiceRequest = {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  problem: string;
  description: string;
  preferredTime?: string;
  images: string[];
  status: RequestStatus;
  assignedWorkerId?: string | null;
  assignedWorkerName?: string | null;
  workerImages?: string[];
  workerNote?: string;
  adminNote?: string;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
};

export type Payment = {
  id: string;
  uid: string;
  name?: string;
  email?: string;
  plan: "client" | "worker";
  amount: number;
  orderId: string;
  paymentId: string;
  status: "paid" | "manual";
  createdAt?: TimestampLike;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  author?: string;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
};

export type WorkType = { id: string; name: string; active: boolean; order?: number };
