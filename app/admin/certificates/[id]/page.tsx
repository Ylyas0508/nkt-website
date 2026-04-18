import { notFound } from "next/navigation";
import { getCertificateById } from "@/lib/data";
import CertificateForm from "@/components/admin/CertificateForm";

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = await getCertificateById(id);
  if (!cert) notFound();
  return <CertificateForm initial={cert} />;
}
