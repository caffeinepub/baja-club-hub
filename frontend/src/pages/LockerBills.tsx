import { useState } from 'react';
import { useGetAllBills } from '../hooks/useLockerBills';
import BillCard from '../components/BillCard';
import AddBillModal from '../components/AddBillModal';
import { Loader2, Plus, FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import LockerAccessGate from '../components/LockerAccessGate';

export default function LockerBills() {
  const { data: bills = [], isLoading } = useGetAllBills();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
      </div>
    );
  }

  const sortedBills = [...bills].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <LockerAccessGate>
      <div className="container py-16">
        <div className="mb-6">
          <Link to="/locker" className="text-sm text-metallic-silver hover:text-racing-red transition-colors">
            ← Back to Member Locker
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
              <FileText className="h-10 w-10 text-racing-red" />
              Bills
            </h1>
            <p className="text-metallic-silver">Financial records and receipts</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Bill
          </button>
        </div>

        {sortedBills.length === 0 ? (
          <div className="text-center py-16 bg-card border border-racing-red/20 rounded-lg">
            <FileText className="h-16 w-16 text-metallic-silver/30 mx-auto mb-4" />
            <p className="text-metallic-silver">No bills uploaded yet</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors"
            >
              Upload First Bill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}

        <AddBillModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </LockerAccessGate>
  );
}
