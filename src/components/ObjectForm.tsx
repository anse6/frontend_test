import React, { useState, useRef } from 'react';
import { createObject } from '../services/api';
import { UploadCloud, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export const ObjectForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', file);
      await createObject(formData);
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error creating object:', error);
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border border-purple-100 bg-white">
        <CardHeader className="bg-purple-800 rounded-t-xl">
          <CardTitle className="text-xl text-white">Ajouter un Objet</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-purple-800">Titre</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nom de l'objet"
                className="border-purple-200 focus:ring-purple-800"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-purple-800">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description détaillée"
                className="border-purple-200 focus:ring-purple-800"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-purple-800">Image</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  preview
                    ? 'border-purple-800 bg-purple-50'
                    : 'border-purple-200 hover:border-purple-800 hover:bg-purple-50'
                }`}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="h-32 object-contain rounded-lg" />
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-purple-800 mb-2" />
                    <span className="text-sm text-purple-800">Cliquez pour ajouter une image</span>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-800 hover:bg-purple-700 text-white"
              disabled={loading || !title || !description || !file}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? 'Publication...' : 'Publier'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};