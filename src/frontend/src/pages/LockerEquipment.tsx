import { useState } from 'react';
import { useGetAllEquipment } from '../hooks/useLockerEquipment';
import EquipmentCard from '../components/EquipmentCard';
import AddEquipmentModal from '../components/AddEquipmentModal';
import { Loader2, Plus, Package } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function LockerEquipment() {
  const { data: equipment = [], isLoading } = useGetAllEquipment();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
      </div>
    );
  }

  const sortedEquipment = [...equipment].sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

  return (
    <div className="container py-16">
      <div className="mb-6">
        <Link to="/member-locker" className="text-sm text-metallic-silver hover:text-racing-red transition-colors">
          ← Back to Member Locker
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
            <Package className="h-10 w-10 text-championship-gold" />
            Equipment
          </h1>
          <p className="text-metallic-silver">Purchased equipment inventory</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Equipment
        </button>
      </div>

      {sortedEquipment.length === 0 ? (
        <div className="text-center py-16 bg-card border border-racing-red/20 rounded-lg">
          <Package className="h-16 w-16 text-metallic-silver/30 mx-auto mb-4" />
          <p className="text-metallic-silver">No equipment records yet</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors"
          >
            Add First Equipment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEquipment.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      )}

      <AddEquipmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
