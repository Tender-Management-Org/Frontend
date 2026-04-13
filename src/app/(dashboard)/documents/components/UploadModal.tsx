import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-lg">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Upload Document</h3>
          <p className="text-sm text-slate-500">Add a compliance document to your vault.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Document Name</label>
            <Input placeholder="Enter document name" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Document Type</label>
            <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300">
              <option>GST_Cert</option>
              <option>PAN_Card</option>
              <option>Balance_Sheet</option>
              <option>Work_Order</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">File Upload</label>
            <Input type="file" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Expiry Date</label>
            <Input type="date" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button>Upload</Button>
        </div>
      </div>
    </div>
  );
}
