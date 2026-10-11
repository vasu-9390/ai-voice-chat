import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeApi } from '@/services/api/knowledgeApi';
import { KnowledgeArticle } from '@/types';
import {
  BookOpen,
  Search,
  Plus,
  Upload,
  FileText,
  FileCode,
  Tag,
  CheckCircle2,
  Clock,
  Layers,
  Trash2,
  Edit3,
  ExternalLink,
  Cpu,
  FolderTree,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatTimeAgo } from '@/utils';

export const KnowledgeBasePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  // Form states for creating article
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Product Documentation');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Support, Guide, FAQ');

  // File upload state
  const [uploadCategory, setUploadCategory] = useState('Product Documentation');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const categories = [
    'All',
    'Billing & Invoicing',
    'Technical Support',
    'Refund Request',
    'Product Documentation',
    'Terms & Conditions',
  ];

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['knowledge-articles', selectedCategory, searchQuery],
    queryFn: () => knowledgeApi.getArticles(selectedCategory, searchQuery),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: () =>
      knowledgeApi.createArticle({
        title: newTitle,
        category: newCategory,
        content: newContent,
        tags: newTags.split(',').map((t) => t.trim()),
        documentType: 'ARTICLE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles'] });
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewContent('');
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!uploadFile) throw new Error('No file selected');
      return knowledgeApi.uploadDocument(uploadFile, uploadCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles'] });
      setIsUploadModalOpen(false);
      setUploadFile(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => knowledgeApi.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles'] });
      setSelectedArticle(null);
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Knowledge Base & Vector Store
            <Badge variant="purple" className="text-xs">RAG Embeddings</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage documentation, upload unstructured manuals (PDF/DOCX/TXT/MD), and monitor semantic chunk embeddings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload Document
          </Button>
          <Button
            variant="glow"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Article
          </Button>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles & vectorized chunks..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Grid: Articles with Status & Vector Embedding Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((art) => (
          <Card
            key={art.id}
            hover
            onClick={() => setSelectedArticle(art)}
            className="p-5 flex flex-col justify-between cursor-pointer border border-slate-800/80 bg-slate-900/60"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold border border-slate-700/60">
                  {art.documentType}
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="success" className="text-[9px]">
                    {art.embeddingStatus}
                  </Badge>
                  <Badge variant="outline" className="text-[9px]">
                    {art.chunkCount} Chunks
                  </Badge>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white line-clamp-2 hover:text-indigo-400 transition-colors">
                {art.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                {art.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>{art.category}</span>
              <span>Updated {formatTimeAgo(art.updatedAt)}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Article Detail & Preview Modal */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
          description={`Category: ${selectedArticle.category} • Format: ${selectedArticle.documentType}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            {/* Metadata Pills */}
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Embedding Status: <strong className="text-emerald-400">{selectedArticle.embeddingStatus}</strong></span>
              <span>•</span>
              <span className="text-slate-400">Vector Chunks: <strong className="text-indigo-400">{selectedArticle.chunkCount}</strong></span>
              <span>•</span>
              <span className="text-slate-400">Processing: <strong className="text-slate-200">{selectedArticle.processingStatus}</strong></span>
            </div>

            {/* Document Content View */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap font-sans">
              {selectedArticle.content}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {selectedArticle.tags.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                  {t}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteMutation.mutate(selectedArticle.id)}
                isLoading={deleteMutation.isPending}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete Document
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedArticle(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Article Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Knowledge Base Article"
        description="Write text instructions and policies to be vectorized for autonomous AI answering"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          className="space-y-4 text-xs"
        >
          <Input
            label="Article Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Return Policy for Damaged Electronics"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
            >
              {categories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Input
            label="Tags (comma separated)"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            placeholder="Warranty, Hardware, SLA"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Article Content / Policy Text</label>
            <textarea
              rows={6}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Paste or write detailed knowledge content..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="glow" size="sm" type="submit" isLoading={createMutation.isPending}>
              Create & Vectorize
            </Button>
          </div>
        </form>
      </Modal>

      {/* Upload Document Modal (PDF, DOCX, TXT, MD) */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Unstructured Document"
        description="Supported formats: PDF, DOCX, TXT, Markdown"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            uploadMutation.mutate();
          }}
          className="space-y-4 text-xs"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Destination Category</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
            >
              {categories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/40">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="hidden"
              id="doc-upload-input"
            />
            <label htmlFor="doc-upload-input" className="cursor-pointer">
              <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">
                {uploadFile ? uploadFile.name : 'Click to select PDF, DOCX, TXT, or MD'}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {uploadFile ? `${(uploadFile.size / 1024).toFixed(1)} KB` : 'Maximum file size 25MB'}
              </p>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="glow"
              size="sm"
              type="submit"
              disabled={!uploadFile}
              isLoading={uploadMutation.isPending}
            >
              Start Chunking & Vectorize
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
