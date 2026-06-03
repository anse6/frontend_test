import React, { useEffect, useState } from 'react';
import { fetchObjectById, updateObject, deleteObject } from '@/services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, Save, ArrowLeft, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface ObjectData {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export const ObjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [object, setObject] = useState<ObjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image: null as File | null });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await fetchObjectById(id);
        setObject(data);
        setForm({ title: data.title, description: data.description, image: null });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    if (name === 'image' && files && files[0]) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    setSaving(true);
    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('description', form.description);
    if (form.image) payload.append('image', form.image);
    try {
      await updateObject(id, payload);
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la modification');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Supprimer cet objet ?')) {
      await deleteObject(id);
      navigate('/');
    }
  };

  const getImageSrc = () => {
    if (preview) return preview;
    if (!object?.imageUrl) return '';
    if (object.imageUrl.startsWith('http')) return object.imageUrl;
    return `${import.meta.env.VITE_API_URL}${object.imageUrl}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-800" />
      </div>
    );
  }

  if (!object) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-4">
        <p className="text-xl text-purple-800">Objet non trouvé</p>
        <Button onClick={() => navigate('/')} className="bg-purple-800 hover:bg-purple-700 text-white">
          Retour au dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-purple-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <Layers className="w-6 h-6 text-white" />
          <h1 className="text-xl font-bold text-white">Projet Test</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-800 border-white bg-white hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="border border-purple-100 shadow-xl bg-white">
            <CardHeader className="bg-purple-800 rounded-t-xl">
              <CardTitle className="text-2xl font-bold text-white">
                {editMode ? "Modifier l'objet" : object.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="rounded-xl overflow-hidden border border-purple-100">
                <img src={getImageSrc()} alt={object.title} className="w-full h-72 object-cover" />
              </div>

              {editMode ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-purple-800">Titre</label>
                    <Input name="title" value={form.title} onChange={handleChange} className="border-purple-200 focus:ring-purple-800" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-purple-800">Description</label>
                    <Textarea name="description" value={form.description} onChange={handleChange} className="border-purple-200 focus:ring-purple-800 min-h-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-purple-800">Nouvelle image (optionnelle)</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-800 file:text-white hover:file:bg-purple-700"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleUpdate} disabled={saving} className="bg-purple-800 hover:bg-purple-700 text-white flex-1">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button variant="outline" onClick={() => { setEditMode(false); setPreview(null); }} className="flex-1 border-purple-800 text-purple-800 hover:bg-purple-50">
                      Annuler
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 leading-relaxed">{object.description}</p>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => setEditMode(true)} className="bg-purple-800 hover:bg-purple-700 text-white flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};