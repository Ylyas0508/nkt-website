import { notFound } from "next/navigation";
import { getTeamMemberById } from "@/lib/data";
import TeamForm from "@/components/admin/TeamForm";

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getTeamMemberById(id);
  if (!member) notFound();
  return <TeamForm initial={member} />;
}
