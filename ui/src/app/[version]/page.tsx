import { listConstructs, getVersions } from "@/lib/openapi";
import HomeClient from "@/components/HomeClient";

export async function generateStaticParams() {
  return getVersions().map((version) => ({ version }));
}

export default async function Home({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  const constructs = listConstructs(version);
  return <HomeClient currentVersion={version} constructs={constructs} />;
}
