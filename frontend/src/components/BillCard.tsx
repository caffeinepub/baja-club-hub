import type { LockerBill } from '../backend';
import { Calendar, DollarSign, Download, Trash2, User } from 'lucide-react';
import { useDeleteBill } from '../hooks/useLockerBills';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { toast } from 'sonner';

interface BillCardProps {
  bill: LockerBill;
}

export default function BillCard({ bill }: BillCardProps) {
  const deleteBill = useDeleteBill();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${bill.title}"?`)) return;

    try {
      await deleteBill.mutateAsync(bill.id);
      toast.success('Bill deleted');
    } catch (error) {
      console.error('Failed to delete bill:', error);
      toast.error('Failed to delete bill');
    }
  };

  const handleDownload = () => {
    const url = bill.image.getDirectURL();
    window.open(url, '_blank');
  };

  return (
    <div className="bg-card border border-racing-red/20 rounded-lg overflow-hidden hover:border-racing-red/40 transition-all">
      <div className="aspect-[4/3] overflow-hidden bg-carbon-black">
        <img
          src={bill.image.getDirectURL()}
          alt={bill.title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-3">{bill.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-metallic-silver">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium text-championship-gold">{bill.amount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-metallic-silver">
            <Calendar className="h-4 w-4" />
            {new Date(bill.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-metallic-silver">
            <User className="h-4 w-4" />
            {userProfile?.name || bill.author.toString().slice(0, 8) + '...'}
          </div>
        </div>

        {bill.comments && (
          <p className="text-sm text-metallic-silver mb-4">{bill.comments}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 px-3 py-2 bg-racing-red/10 hover:bg-racing-red/20 text-racing-red rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={deleteBill.isPending}
              className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
