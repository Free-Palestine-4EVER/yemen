import { Guard } from "@/components/app/Guard";
import { AppTopbar } from "@/components/app/AppTopbar";
import { ApplyWizard } from "@/components/apply/ApplyWizard";

export default function ApplyPage() {
  return (
    <Guard>
      <AppTopbar />
      <main className="flex-1 bg-paper">
        <ApplyWizard />
      </main>
    </Guard>
  );
}
