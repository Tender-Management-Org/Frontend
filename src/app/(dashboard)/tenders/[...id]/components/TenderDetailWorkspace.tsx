"use client";

import { useState } from "react";
import type { TenderDetail } from "@/types/tenderDetail";
import { ActionBar } from "./ActionBar";
import { TenderDetailView } from "./TenderDetailView";

interface TenderDetailWorkspaceProps {
  tender: TenderDetail;
  tenderId: string;
}

export function TenderDetailWorkspace({ tender, tenderId }: TenderDetailWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const showActionBar = activeTab !== "insights";

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className={showActionBar ? "col-span-12 lg:col-span-8" : "col-span-12"}>
        <TenderDetailView data={tender} onTabChange={(tab) => setActiveTab(tab)} />
      </div>
      {showActionBar ? (
        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-6">
            <ActionBar tenderId={tenderId} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
