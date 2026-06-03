import React from 'react';
import type { ObjectData } from '../types';
import { deleteObject } from '../services/api';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface ObjectListProps {
  objects: ObjectData[];
}

export const ObjectList: React.FC<ObjectListProps> = ({ objects }) => {
  const navigate = useNavigate();

  // Guard : si objects n'est pas un tableau, on affiche rien
  if (!Array.isArray(objects)) return null;

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Voulez-vous vraiment supprimer cet objet ?')) {
      try {
        await deleteObject(id);
      } catch (error) {
        console.error('Error deleting object:', error);
      }
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {objects.map((obj) => (
          <motion.div
            key={obj._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate(`/object/${obj._id}`)}
            className="cursor-pointer"
          >
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border border-purple-100 shadow-md">
              <div className="relative h-48 overflow-hidden bg-purple-50">
                <img
                  src={getImageUrl(obj.imageUrl)}
                  alt={obj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => handleDelete(obj._id, e)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md rounded-full h-9 w-9 bg-purple-800 hover:bg-purple-700"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </Button>
              </div>
              <CardContent className="p-5 bg-white">
                <h3 className="text-lg font-bold text-purple-800 mb-2 truncate">
                  {obj.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {obj.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      {objects.length === 0 && (
        <div className="col-span-full py-12 text-center text-purple-800 font-medium">
          Aucun objet trouvé. Soyez le premier à en ajouter un !
        </div>
      )}
    </div>
  );
};