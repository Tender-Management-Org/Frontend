import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type MatchStatus = "Matched" | "Interested" | "Applied" | "Won" | "Lost";

export interface MatchItem {
  title: string;
  fit_score: number;
  status: MatchStatus;
  reason: string;
}

interface TenderMatchListProps {
  matches: MatchItem[];
}

const statusStyles: Record<MatchStatus, string> = {
  Matched: "bg-blue-100 text-blue-700",
  Interested: "bg-violet-100 text-violet-700",
  Applied: "bg-amber-100 text-amber-700",
  Won: "bg-emerald-100 text-emerald-700",
  Lost: "bg-rose-100 text-rose-700"
};

function fitScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
}

export function TenderMatchList({ matches }: TenderMatchListProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Recent Matched Tenders</h3>
        <span className="text-xs text-slate-500">Updated just now</span>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.title} className="rounded-lg border border-slate-200 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-slate-900">{match.title}</p>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-semibold", fitScoreColor(match.fit_score))}>
                  Fit: {match.fit_score}
                </span>
                <span className={cn("rounded-full px-2 py-1 text-xs font-medium", statusStyles[match.status])}>
                  {match.status}
                </span>
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-500">{match.reason}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
