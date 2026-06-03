import React, { useEffect, useState } from 'react';
import { fetchObjects } from '@/services/api';
import { socket } from '@/services/socket';
import { ObjectForm } from '@/components/ObjectForm';
import { ObjectList } from '@/components/ObjectList';
import type { ObjectData } from '@/types';
import { Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const ObjectDashboard: React.FC = () => {
  const [objects, setObjects] = useState<ObjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadObjects = async () => {
      try {
        const data = await fetchObjects();
        // Sécurise : force toujours un tableau
        setObjects(Array.isArray(data) ? data : data.objects ?? data.data ?? []);
      } catch (e) {
        console.error(e);
        setObjects([]);
      } finally {
        setLoading(false);
      }
    };
    loadObjects();

    socket.on('object_created', (newObj: ObjectData) => {
      setObjects((prev) => [newObj, ...prev]);
    });
    socket.on('object_deleted', (data: { id: string }) => {
      setObjects((prev) => prev.filter((obj) => obj._id !== data.id));
    });
    socket.on('object_updated', (updatedObj: ObjectData) => {
      setObjects((prev) =>
        prev.map((obj) => (obj._id === updatedObj._id ? updatedObj : obj))
      );
    });

    return () => {
      socket.off('object_created');
      socket.off('object_deleted');
      socket.off('object_updated');
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-white text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="sticky top-0 z-50 bg-purple-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <Layers className="w-6 h-6 text-white" />
          <h1 className="text-xl font-bold text-white">Projet Test</h1>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <span className="text-white">Socket Connecté</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        <section className="lg:w-1/3">
          <div className="sticky top-28">
            <ObjectForm />
          </div>
        </section>
        <section className="lg:w-2/3">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-purple-800">
              Galerie d'objets
            </h2>
            <span className="px-4 py-1.5 bg-purple-800 text-white font-semibold rounded-full text-sm">
              {objects.length} objets
            </span>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-800 rounded-full animate-spin" />
            </div>
          ) : (
            <ObjectList objects={objects} />
          )}
        </section>
      </main>
    </motion.div>
  );
};