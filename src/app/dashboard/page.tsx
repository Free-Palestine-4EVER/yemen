import { Guard } from "@/components/app/Guard";
import { AppTopbar } from "@/components/app/AppTopbar";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <Guard>
      <AppTopbar />
      <main className="flex-1 bg-paper-2/40">
        <DashboardView />
      </main>
    </Guard>
  );
}
