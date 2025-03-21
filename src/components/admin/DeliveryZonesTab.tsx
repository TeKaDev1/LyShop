import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { DeliveryZone } from '@/types';
import { toast } from '@/hooks/use-toast';
import { saveDeliveryZone, updateDeliveryZone, deleteDeliveryZone } from '@/lib/firebase';

interface DeliveryZonesTabProps {
  zones: DeliveryZone[];
  refreshZones: () => Promise<void>;
}

const DeliveryZonesTab: React.FC<DeliveryZonesTabProps> = ({ zones, refreshZones }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [name, setName] = useState('');
  const [cities, setCities] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const zoneData = {
        name,
        cities: cities.split(',').map(city => city.trim()),
        price: parseFloat(price)
      };

      if (editingZone) {
        await updateDeliveryZone({
          ...zoneData,
          id: editingZone.id
        });
        toast({
          title: "تم التحديث",
          description: "تم تحديث منطقة التوصيل بنجاح",
        });
      } else {
        await saveDeliveryZone(zoneData);
        toast({
          title: "تمت الإضافة",
          description: "تم إضافة منطقة التوصيل بنجاح",
        });
      }

      setIsEditing(false);
      setEditingZone(null);
      setName('');
      setCities('');
      setPrice('');
      refreshZones();
    } catch (error) {
      console.error('Error saving delivery zone:', error);
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ منطقة التوصيل",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setName(zone.name);
    setCities(zone.cities.join(', '));
    setPrice(zone.price.toString());
    setIsEditing(true);
  };

  const handleDelete = async (zoneId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المنطقة؟')) return;

    try {
      await deleteDeliveryZone(zoneId);
      toast({
        title: "تم الحذف",
        description: "تم حذف منطقة التوصيل بنجاح",
      });
      refreshZones();
    } catch (error) {
      console.error('Error deleting delivery zone:', error);
      toast({
        title: "حدث خطأ",
        description: "فشل في حذف منطقة التوصيل",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مناطق التوصيل</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus size={18} />
            إضافة منطقة
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              اسم المنطقة
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="cities" className="block text-sm font-medium mb-1">
              المدن (مفصولة بفواصل)
            </label>
            <textarea
              id="cities"
              value={cities}
              onChange={(e) => setCities(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              سعر التوصيل
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Check size={18} />
              {editingZone ? 'تحديث' : 'إضافة'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingZone(null);
                setName('');
                setCities('');
                setPrice('');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <X size={18} />
              إلغاء
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{zone.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {zone.cities.join('، ')}
                </p>
                <p className="text-primary font-bold mt-2">
                  {zone.price.toFixed(2)} د.ل
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(zone)}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(zone.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DeliveryZonesTab; 