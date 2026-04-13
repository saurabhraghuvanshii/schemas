import { getVersions } from "@/lib/openapi";
import NavWrapper from "@/components/NavWrapper";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getVersions().map((version) => ({ version }));
}

export default async function VersionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  const versions = getVersions();

  if (!versions.includes(version)) {
    notFound();
  }

  return (
    <>
      <NavWrapper currentVersion={version} versions={versions} />
      <main>{children}</main>
    </>
  );
}
