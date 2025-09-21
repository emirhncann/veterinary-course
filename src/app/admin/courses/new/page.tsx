'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Save, X } from 'lucide-react';

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [categories, setCategories] = React.useState<any[]>([]);
  const [instructors, setInstructors] = React.useState<any[]>([]);
  
  const [formData, setFormData] = React.useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    cover_image_base64: '',
    cover_image_mime_type: '',
    price: '',
    original_price: '',
    level: 'beginner',
    language: 'tr',
    duration: '',
    total_lessons: '',
    rating: '',
    total_ratings: '',
    total_students: '',
    instructor_id: '',
    category_id: '',
    is_featured: false,
    is_published: true,
    is_free: false,
    tags: [] as string[],
    requirements: [] as string[],
    what_you_will_learn: [] as string[]
  });

  const [newTag, setNewTag] = React.useState('');
  const [newRequirement, setNewRequirement] = React.useState('');
  const [newLearning, setNewLearning] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState<string>('');

  React.useEffect(() => {
    // Kategorileri ve eğitmenleri yükle
    loadCategories();
    loadInstructors();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('https://api.vetmedipedia.com/categories');
      const data = await response.json();
      if (data.status === 'success') {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Kategoriler yüklenemedi:', err);
    }
  };

  const loadInstructors = async () => {
    try {
      const response = await fetch('https://api.vetmedipedia.com/instructors');
      const data = await response.json();
      if (data.status === 'success') {
        setInstructors(data.data || []);
      }
    } catch (err) {
      console.error('Eğitmenler yüklenemedi:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Form verilerini API formatına çevir (database şemasına uygun)
      const courseData = {
        title: formData.title,
        slug: formData.slug || null, // Boşsa API'de title'dan türetilecek
        summary: formData.summary || null,
        description: formData.description || null,
        cover_image_base64: formData.cover_image_base64 || null,
        cover_image_mime_type: formData.cover_image_mime_type || null,
        price: formData.price ? parseFloat(formData.price) : 0,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        level: formData.level,
        language: formData.language,
        duration: formData.duration ? parseInt(formData.duration) : null,
        total_lessons: formData.total_lessons ? parseInt(formData.total_lessons) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        total_ratings: formData.total_ratings ? parseInt(formData.total_ratings) : null,
        total_students: formData.total_students ? parseInt(formData.total_students) : null,
        instructor_id: parseInt(formData.instructor_id),
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        is_free: formData.is_free,
        tags: formData.tags.length > 0 ? JSON.stringify(formData.tags) : null,
        requirements: formData.requirements.length > 0 ? JSON.stringify(formData.requirements) : null,
        what_you_will_learn: formData.what_you_will_learn.length > 0 ? JSON.stringify(formData.what_you_will_learn) : null
      };

      console.log('Kurs verisi gönderiliyor:', courseData);

      const response = await fetch('https://api.vetmedipedia.com/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data.status === 'success') {
        alert('✅ Kurs başarıyla oluşturuldu!');
        router.push('/admin/courses');
      } else {
        throw new Error(data.message || 'Kurs oluşturulamadı');
      }
    } catch (err) {
      console.error('Kurs oluşturma hatası:', err);
      setError(err instanceof Error ? err.message : 'Kurs oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası seçin!');
      return;
    }

    // Dosya boyutu kontrolü (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Resim boyutu 5MB\'dan küçük olmalıdır!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      // Base64 string'ini temizle (data:image/... kısmını kaldır)
      const base64String = result.split(',')[1];
      
      setFormData(prev => ({
        ...prev,
        cover_image_base64: base64String,
        cover_image_mime_type: file.type
      }));
      
      // Önizleme için tam data URL'yi sakla
      setImagePreview(result);
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      cover_image_base64: '',
      cover_image_mime_type: ''
    }));
    setImagePreview('');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addLearning = () => {
    if (newLearning.trim() && !formData.what_you_will_learn.includes(newLearning.trim())) {
      setFormData(prev => ({
        ...prev,
        what_you_will_learn: [...prev.what_you_will_learn, newLearning.trim()]
      }));
      setNewLearning('');
    }
  };

  const removeLearning = (index: number) => {
    setFormData(prev => ({
      ...prev,
      what_you_will_learn: prev.what_you_will_learn.filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
            onClick={() => router.push('/admin/courses')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#475569'
          }}
        >
          <ArrowLeft size={16} />
            Geri Dön
        </button>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
              Yeni Kurs Oluştur
            </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{ color: '#dc2626', margin: 0, fontSize: '14px' }}>
            ❌ {error}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Temel Bilgiler */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>
            Temel Bilgiler
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Kurs Başlığı *
              </label>
              <input
                type="text"
                name="title"
                    value={formData.title}
                onChange={handleInputChange}
                    required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="Kurs başlığını girin"
                  />
                </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Slug (URL)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="kurs-url-slug (boş bırakılırsa başlıktan türetilir)"
                  />
                </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Özet
              </label>
              <textarea
                name="summary"
                  value={formData.summary}
                onChange={handleInputChange}
                  rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical'
                }}
                placeholder="Kurs özetini girin"
                />
              </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Açıklama
              </label>
              <textarea
                name="description"
                  value={formData.description}
                onChange={handleInputChange}
                rows={5}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical'
                }}
                placeholder="Detaylı kurs açıklamasını girin"
                />
              </div>

            {/* Resim Yükleme */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Kurs Kapak Resmi
              </label>
              
              {!imagePreview ? (
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onClick={() => document.getElementById('image-upload')?.click()}>
                  <div style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '12px' }}>📷</div>
                  <p style={{ fontSize: '16px', color: '#374151', margin: '0 0 8px 0' }}>
                    Resim yüklemek için tıklayın
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    PNG, JPG, JPEG (Max 5MB)
                  </p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img
                    src={imagePreview}
                    alt="Kurs kapak resmi"
                    style={{
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb'
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}
                  >
                    ×
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {formData.cover_image_mime_type}
                  </div>
                </div>
              )}
            </div>
                </div>
              </div>

        {/* Kurs Detayları */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>
            Kurs Detayları
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Eğitmen *
              </label>
              <select
                name="instructor_id"
                value={formData.instructor_id}
                onChange={handleInputChange}
                  required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                <option value="">Eğitmen seçin</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.user?.first_name} {instructor.user?.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Kategori
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                <option value="">Kategori seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Fiyat (₺)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="0.00"
                />
              </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Orijinal Fiyat (₺)
              </label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="0.00"
                        />
                      </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Seviye
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                <option value="beginner">Başlangıç</option>
                <option value="intermediate">Orta</option>
                <option value="advanced">İleri</option>
              </select>
                    </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Dil
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
                          </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Süre (dakika)
              </label>
              <input
                                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                                placeholder="0"
                              />
                            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Toplam Ders Sayısı
              </label>
              <input
                type="number"
                name="total_lessons"
                value={formData.total_lessons}
                onChange={handleInputChange}
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="0"
                              />
                            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Puan (0-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="0.0"
              />
                          </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Toplam Puan Sayısı
              </label>
              <input
                type="number"
                name="total_ratings"
                value={formData.total_ratings}
                onChange={handleInputChange}
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="0"
                            />
                          </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Toplam Öğrenci Sayısı
              </label>
                            <input
                type="number"
                name="total_students"
                value={formData.total_students}
                onChange={handleInputChange}
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="0"
              />
            </div>
                          </div>
                        </div>

        {/* Etiketler ve Gereksinimler */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>
            Etiketler ve Gereksinimler
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Etiketler */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Etiketler
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="Etiket ekle"
                />
                <button
                  type="button"
                  onClick={addTag}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      backgroundColor: '#eff6ff',
                      color: '#1e40af',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#1e40af'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Gereksinimler */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Gereksinimler
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="Gereksinim ekle"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {formData.requirements.map((req, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <span style={{ flex: 1 }}>{req}</span>
                    <button
                        type="button"
                      onClick={() => removeRequirement(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#dc2626'
                      }}
                    >
                      <X size={16} />
                    </button>
                    </div>
                ))}
              </div>
            </div>

            {/* Öğrenilecekler */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Ne Öğreneceksiniz?
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={newLearning}
                  onChange={(e) => setNewLearning(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearning())}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="Öğrenilecek konu ekle"
                />
                <button
                  type="button"
                  onClick={addLearning}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {formData.what_you_will_learn.map((learning, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#faf5ff',
                      border: '1px solid #d8b4fe',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <span style={{ flex: 1 }}>{learning}</span>
                    <button
                type="button"
                      onClick={() => removeLearning(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#dc2626'
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ayarlar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>
            Ayarlar
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>Öne çıkan kurs</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleInputChange}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>Yayınla</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="is_free"
                checked={formData.is_free}
                onChange={handleInputChange}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>Ücretsiz kurs</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button
              type="button"
              onClick={() => router.push('/admin/courses')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#475569'
            }}
            >
              İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Save size={16} />
                Kursu Oluştur
              </>
            )}
          </button>
          </div>
        </form>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      </div>
  );
}