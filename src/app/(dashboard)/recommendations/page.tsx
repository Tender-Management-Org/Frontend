import { Card } from "@/components/ui/Card";

export default function RecommendationsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Recommendations</h2>
        <p className="text-sm text-slate-500">Smart suggestions to improve bid outcomes.</p>
      </div>

      <Card>
        <div className="rounded-lg border border-dashed border-border bg-slate-50 p-10 text-center">
          <p className="text-sm text-slate-500">No recommendations available yet.</p>
        </div>
      </Card>
    </section>
  );
}
