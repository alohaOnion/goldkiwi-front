/**
 * GoldKiwi Sales API
 * 상품 관련 API
 */
const SALES_API_BASE =
  typeof window !== "undefined"
    ? "/api/sales"
    : process.env.NEXT_PUBLIC_SALES_API_URL ?? "http://localhost:3002";

/** 이미지 표시용 URL (전용 프록시 경로 /api/image 사용) */
export function getImageSrc(url: string | null | undefined): string {
  const placeholder = "/images/products/placeholder.svg";
  if (!url) return placeholder;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `/api/image${url}`;
  if (url.startsWith("/api/sales/uploads")) return `/api/image${url.replace("/api/sales", "")}`;
  if (url.startsWith("/api/image")) return url;
  return url;
}

export const salesApiFetchOptions: RequestInit = {
  credentials: "include",
};

export interface ProductListItem {
  id: string;
  title: string;
  price: number;
  location: string | null;
  createdAt: string;
  image: string | null;
  likes: number;
  isNew: boolean;
}

export interface ProductDetail {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  condition: string | null;
  description: string | null;
  location: string | null;
  createdAt: string;
  views: number;
  likes: number;
  isNew: boolean;
  sellerId: string;
  images: string[];
  tags: string[];
  workspaceId: string | null;
  categoryId: string | null;
}

export interface ProductListResponse {
  items: ProductListItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CreateProductBody {
  title: string;
  price: number;
  originalPrice?: number;
  condition?: string;
  description?: string;
  location?: string;
  isNew?: boolean;
  images?: string[];
  tags?: string[];
  workspaceId?: string;
  categoryId?: string;
}

export interface UpdateProductBody extends Partial<CreateProductBody> {}

async function salesFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${SALES_API_BASE}${path}`, {
    ...salesApiFetchOptions,
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.message ?? "요청에 실패했습니다.");
    (err as Error & { status?: number }).status = res.status;
    (err as Error & { info?: unknown }).info = data;
    throw err;
  }
  return data as T;
}

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  workspaceId?: string;
  categoryId?: string;
  sortBy?: "popular" | "latest";
}): Promise<ProductListResponse> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.workspaceId) search.set("workspaceId", params.workspaceId);
  if (params?.categoryId) search.set("categoryId", params.categoryId);
  if (params?.sortBy) search.set("sortBy", params.sortBy);
  const qs = search.toString();
  const res = await salesFetch(`/products${qs ? `?${qs}` : ""}`);
  return handleResponse(res);
}

export async function fetchProduct(id: string): Promise<ProductDetail> {
  const res = await salesFetch(`/products/${id}`);
  return handleResponse(res);
}

export async function fetchRelatedProducts(
  id: string
): Promise<ProductListItem[]> {
  const res = await salesFetch(`/products/${id}/related`);
  return handleResponse(res);
}

export async function createProduct(
  body: CreateProductBody
): Promise<ProductDetail> {
  const res = await salesFetch("/products", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function updateProduct(
  id: string,
  body: UpdateProductBody
): Promise<ProductDetail> {
  const res = await salesFetch(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${SALES_API_BASE}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "업로드에 실패했습니다.");
  }
  const url = data.url as string;
  return {
    url: url.startsWith("http") ? url : `/api/image${url}`,
  };
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await salesFetch(`/products/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    const err = new Error(data?.message ?? "삭제에 실패했습니다.");
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
}
