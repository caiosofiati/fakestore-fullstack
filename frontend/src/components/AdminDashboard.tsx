import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types';
import './AdminDashboard.css';

export function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });

  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/products');
      const json = await res.json();
      setProducts(json.data || json);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    return {
      total: products.length,
      categories: categories.size,
      totalValue,
    };
  }, [products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !token) return;
    const file = e.target.files[0];
    const formDataPayload = new FormData();
    formDataPayload.append('file', file);

    setUploadingImg(true);
    try {
      const res = await fetch('http://localhost:3000/api/products/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataPayload,
      });
      if (!res.ok) throw new Error('Falha no upload');
      const data = await res.json();
      setFormData(prev => ({ ...prev, image: data.url || data.data?.url }));
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar a imagem.');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      description: product.description || '',
      category: product.category,
      image: product.image,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', price: '', description: '', category: '', image: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!formData.image) {
      alert('A imagem é obrigatória. Faça o upload de um arquivo.');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:3000/api/products/${editingId}`
      : 'http://localhost:3000/api/products';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (res.ok) {
        await fetchProducts();
        handleCancel();
      } else {
        alert('Erro ao salvar produto');
      }
    } catch (err) {
      console.error(err);
      alert('Erro inesperado');
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchProducts();
      } else {
        alert('Erro ao excluir');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir');
    }
  };

  if (loading) return <div className="page-container">Carregando painel admin...</div>;

  return (
    <div className="page-container admin-dashboard">
      <div className="admin-header">
        <h1>Painel de Administração</h1>
        <p>Gerencie o catálogo de produtos da loja</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon blue">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Produtos</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🏷️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.categories}</span>
            <span className="stat-label">Categorias</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-info">
            <span className="stat-value">R$ {stats.totalValue.toFixed(0)}</span>
            <span className="stat-label">Valor Total</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Form Card */}
        <div className="admin-card">
          <div className="card-header">
            <h2>
              <span>{editingId ? '✏️' : '➕'}</span>
              {editingId ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            {editingId && <span className="card-badge">Editando #{editingId}</span>}
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Título do Produto</label>
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Ex: Monitor 4K LG" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preço (R$)</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="999.00" required />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <input name="category" value={formData.category} onChange={handleInputChange} placeholder="Ex: electronics" required />
              </div>
            </div>

            <div className="form-group">
              <label>Imagem do Produto</label>
              <div className="image-upload-wrapper">
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="image-preview" />
                )}
                <div className="image-upload-controls">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="imageUpload" className={`upload-btn ${uploadingImg ? 'loading' : ''}`}>
                    {uploadingImg ? '⏳ Enviando...' : (formData.image ? '🔄 Trocar' : '📁 Selecionar')}
                  </label>
                  {!formData.image && <span className="upload-hint">PNG, JPG ou WEBP</span>}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Especificações do produto..." />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit" disabled={uploadingImg}>
                {editingId ? '💾 Salvar' : '➕ Adicionar'}
              </button>
            </div>
          </form>
        </div>

        {/* Products Table Card */}
        <div className="admin-card">
          <div className="card-header">
            <h2>
              <span>📋</span>
              Produtos
            </h2>
            <span className="card-badge">{products.length} itens</span>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Capa</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td data-label="ID">
                      <span className="product-id-badge">#{p.id}</span>
                    </td>
                    <td data-label="Capa">
                      <img src={p.image} alt={p.title} className="admin-product-img" loading="lazy" />
                    </td>
                    <td data-label="Produto" className="product-title-cell" title={p.title}>{p.title}</td>
                    <td data-label="Categoria">
                      <span className="product-category-badge">{p.category}</span>
                    </td>
                    <td data-label="Preço" className="product-price-cell">R$ {p.price.toFixed(2)}</td>
                    <td data-label="Ações">
                      <div className="actions-cell" style={{ justifyContent: 'center' }}>
                        <button className="btn-icon edit" title="Editar" onClick={() => handleEdit(p)}>✏️</button>
                        <button className="btn-icon delete" title="Excluir" onClick={() => handleDelete(p.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="admin-empty-state">
                <span className="empty-icon">📦</span>
                <h3>Nenhum produto cadastrado</h3>
                <p>Use o formulário ao lado para adicionar o primeiro.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
