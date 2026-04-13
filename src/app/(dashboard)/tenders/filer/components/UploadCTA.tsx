import { Button } from "@/components/ui/Button";

export type RequirementAction = "view" | "upload" | "download";

interface UploadCTAProps {
  action: RequirementAction;
}

export function UploadCTA({ action }: UploadCTAProps) {
  if (action === "view") {
    return (
      <Button size="sm" variant="secondary">
        View Document
      </Button>
    );
  }

  if (action === "download") {
    return (
      <Button size="sm" variant="ghost" className="border border-border">
        Download Template
      </Button>
    );
  }

  return (
    <Button size="sm" className="w-full sm:w-auto">
      Upload Document
    </Button>
  );
}
