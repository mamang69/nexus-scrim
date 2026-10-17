import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { getScrimById } from "@/lib/data";
import { ArrowLeft, Users } from "lucide-react";
import { AdminRegistrationsReview } from "@/components/admin/AdminRegistrationsReview";

export const dynamic = "force-dynamic";

interface AdminRegistrationsPageProps {
  params: {
    id: string;
  };
}

export default async function AdminRegistrationsPage({
  params,
}: AdminRegistrationsPageProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin/scrims&error=unauthorized_admin");
  }

  const scrim = await getScrimById(params.id);

  if (!scrim) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/admin/scrims"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-neon-cyan mb-2 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard Admin
      </Link>

      <div className="pb-6 border-b border-borderSubtle">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-neon-cyan" />
          <h1 className="text-2xl font-black text-white font-mono">
            VERIFIKASI PENDAFTARAN TIM
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Scrim: <strong className="text-white">{scrim.title}</strong> ({scrim.game})
        </p>
      </div>

      <AdminRegistrationsReview
        scrimId={scrim.id}
        scrimTitle={scrim.title}
        maxSlots={scrim.maxSlots}
        registrations={scrim.registrations as any}
      />
    </div>
  );
}
