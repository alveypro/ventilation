import { apiClient } from './apiClient'
import type { Product, Review, Disease, Tutorial, Brand } from '@/types'

export const productApi = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: number) => apiClient.get<Product>(`/products/${id}`),
  search: (query: string) => apiClient.get<Product[]>('/products/search', { params: { q: query } }),
  create: (data: Product) => apiClient.post<Product>('/products', data),
  update: (id: number, data: Partial<Product>) => apiClient.put<Product>(`/products/${id}`, data),
  delete: (id: number) => apiClient.delete(`/products/${id}`),
}

export const reviewApi = {
  getAll: () => apiClient.get<Review[]>('/reviews'),
  getById: (id: number) => apiClient.get<Review>(`/reviews/${id}`),
  create: (data: Review) => apiClient.post<Review>('/reviews', data),
  update: (id: number, data: Partial<Review>) => apiClient.put<Review>(`/reviews/${id}`, data),
  delete: (id: number) => apiClient.delete(`/reviews/${id}`),
}

export const diseaseApi = {
  getAll: () => apiClient.get<Disease[]>('/diseases'),
  getById: (id: number) => apiClient.get<Disease>(`/diseases/${id}`),
}

export const tutorialApi = {
  getAll: () => apiClient.get<Tutorial[]>('/tutorials'),
  getById: (id: number) => apiClient.get<Tutorial>(`/tutorials/${id}`),
}

export const brandApi = {
  getAll: () => apiClient.get<Brand[]>('/brands'),
  getById: (id: number) => apiClient.get<Brand>(`/brands/${id}`),
}

export const selectorApi = {
  recommend: (data: {
    disease?: string
    severity?: 'mild' | 'moderate' | 'severe'
    budget?: number
    portability?: 'low' | 'medium' | 'high'
    noiseSensitive?: boolean
    humidification?: boolean
    useCase?: 'home' | 'travel' | 'mixed'
    experience?: 'beginner' | 'advanced'
  }) => apiClient.post('/selector', data),
}
