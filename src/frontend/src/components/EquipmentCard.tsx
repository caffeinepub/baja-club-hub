import type { EquipmentItem } from '../backend';
import { Calendar, Package, Trash2 } from 'lucide-react';
import { useDeleteEquipment } from '../hooks/useLockerEquipment';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';

interface EquipmentCardProps {
  equipment: EquipmentItem;
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  const deleteEquipment = useDeleteEquipment();
  const { data: isAdmin = false } = useIsCallerAdmin();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${equipment.name}"?`)) return;

    try {
      await deleteEquipment.mutateAsync(equipment.id);
      toast.success('Equipment deleted');
    } catch (error) {
      console.error('Failed to delete equipment:', error);
      toast.error('Failed to delete equipment');
    }
  };

  return (
    <div className="bg-card border border-racing-red/20 rounded-lg overflow-hidden hover:border-racing-red/40 transition-all">
      <div className="aspect-square overflow-hidden bg-carbon-black">
        <img
          src={equipment.image.getDirectURL()}
          alt={equipment.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-3">{equipment.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-metallic-silver">
            <Package className="h-4 w-4" />
            <span>Qty: {equipment.quantity}</span>
            <span className="mx-2">•</span>
            <span className="font-medium text-championship-gold">${equipment.unitPrice} each</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-metallic-silver">
            <Calendar className="h-4 w-4" />
            Purchased: {new Date(equipment.purchaseDate).toLocaleDateString()}
          </div>
        </div>

        {equipment.description && (
          <p className="text-sm text-metallic-silver mb-3">{equipment.description}</p>
        )}

        {equipment.comments && (
          <p className="text-xs text-metallic-silver/70 mb-4 italic">{equipment.comments}</p>
        )}

        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={deleteEquipment.isPending}
            className="w-full px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
