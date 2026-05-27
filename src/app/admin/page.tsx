import { Guard } from "@/components/app/Guard";
import { AppTopbar } from "@/components/app/AppTopbar";
import { AdminView } from "@/components/admin/AdminView";

export default function AdminPage() {
  return (
    <Guard admin>
      <AppTopbar />
      <main className="flex-1 bg-paper-2/40">
        <AdminView />
      </main>
    </Guard>
  );
}
