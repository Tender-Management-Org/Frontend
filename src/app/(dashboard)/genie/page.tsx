import type { Metadata } from "next";
import { GenieExplorer } from "./components/GenieExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Genie — Government schemes",
  description: "Browse central and state government schemes relevant to your firm.",
};

export default function GeniePage() {
  return <GenieExplorer />;
}
