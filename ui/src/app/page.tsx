import { redirect } from "next/navigation";
import { getVersions } from "@/lib/openapi";

export default async function IndexRedirect() {
  const versions = getVersions();
  const defaultVersion = versions.includes("v1beta1") ? "v1beta1" : versions[versions.length - 1];
  redirect(`/${defaultVersion}`);
}
