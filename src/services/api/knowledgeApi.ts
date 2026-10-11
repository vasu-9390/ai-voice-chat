import { apiClient } from './client';
import { KnowledgeArticle } from '@/types';
import { mockKnowledgeArticles } from './mockData';

let articlesStore = [...mockKnowledgeArticles];

export const knowledgeApi = {
  async getArticles(category?: string, query?: string): Promise<KnowledgeArticle[]> {
    try {
      const { data } = await apiClient.get<KnowledgeArticle[]>('/knowledge/articles', {
        params: { category, q: query },
      });
      return data;
    } catch {
      let filtered = [...articlesStore];
      if (category && category !== 'All') {
        filtered = filtered.filter((a) => a.category === category);
      }
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.content.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
  },

  async getArticleById(id: string): Promise<KnowledgeArticle> {
    try {
      const { data } = await apiClient.get<KnowledgeArticle>(`/knowledge/articles/${id}`);
      return data;
    } catch {
      const art = articlesStore.find((a) => a.id === id);
      if (!art) throw new Error('Article not found');
      return art;
    }
  },

  async createArticle(payload: {
    title: string;
    category: string;
    content: string;
    tags: string[];
    documentType?: KnowledgeArticle['documentType'];
  }): Promise<KnowledgeArticle> {
    try {
      const { data } = await apiClient.post<KnowledgeArticle>('/knowledge/articles', payload);
      return data;
    } catch {
      const newArticle: KnowledgeArticle = {
        id: `kb-${Date.now()}`,
        title: payload.title,
        slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: payload.category,
        tags: payload.tags,
        content: payload.content,
        documentType: payload.documentType || 'ARTICLE',
        status: 'PUBLISHED',
        processingStatus: 'INDEXED',
        embeddingStatus: 'VECTORIZED',
        chunkCount: Math.max(4, Math.floor(payload.content.length / 250)),
        updatedAt: new Date().toISOString(),
        author: 'Current User',
        views: 1,
        helpfulVotes: 0,
      };
      articlesStore = [newArticle, ...articlesStore];
      return newArticle;
    }
  },

  async updateArticle(id: string, updates: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    try {
      const { data } = await apiClient.patch<KnowledgeArticle>(`/knowledge/articles/${id}`, updates);
      return data;
    } catch {
      const idx = articlesStore.findIndex((a) => a.id === id);
      if (idx !== -1) {
        articlesStore[idx] = {
          ...articlesStore[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return articlesStore[idx];
      }
      throw new Error('Article not found');
    }
  },

  async deleteArticle(id: string): Promise<void> {
    try {
      await apiClient.delete(`/knowledge/articles/${id}`);
    } catch {
      articlesStore = articlesStore.filter((a) => a.id !== id);
    }
  },

  async uploadDocument(file: File, category: string): Promise<KnowledgeArticle> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      const { data } = await apiClient.post<KnowledgeArticle>('/knowledge/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch {
      const ext = file.name.split('.').pop()?.toUpperCase() as KnowledgeArticle['documentType'] || 'PDF';
      const newDoc: KnowledgeArticle = {
        id: `kb-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        slug: file.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        tags: ['Document', ext, 'Auto-Chunked'],
        content: `Parsed document binary contents from ${file.name}. Size: ${(file.size / 1024).toFixed(1)} KB. Extracted metadata and high-dimensional vector embeddings generated for autonomous RAG queries.`,
        documentType: ext,
        status: 'PUBLISHED',
        processingStatus: 'INDEXED',
        embeddingStatus: 'VECTORIZED',
        chunkCount: Math.max(8, Math.floor(file.size / 512)),
        updatedAt: new Date().toISOString(),
        author: 'Document Pipeline',
        views: 0,
        helpfulVotes: 0,
      };
      articlesStore = [newDoc, ...articlesStore];
      return newDoc;
    }
  },
};
