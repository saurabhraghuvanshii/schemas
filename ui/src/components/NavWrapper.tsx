"use client";

import dynamic from "next/dynamic";

// Dynamically import TopNav with SSR disabled
const TopNav = dynamic(() => import("./TopNav"), { ssr: false });

export default function NavWrapper({
  currentVersion,
  versions,
}: {
  currentVersion: string;
  versions: string[];
}) {
  return <TopNav currentVersion={currentVersion} versions={versions} />;
}
