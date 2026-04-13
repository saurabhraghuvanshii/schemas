import { Container, Breadcrumbs, Typography, Box } from "@mui/material";
import Link from "next/link";
import { parseConstructSpec, listConstructs, getVersions } from "@/lib/openapi";
import ConstructDetailClient from "@/components/ConstructDetailClient";
import { notFound } from "next/navigation";

// Generate static params for all constructs across all versions
export async function generateStaticParams() {
  const versions = getVersions();
  const paths: { version: string; construct: string }[] = [];
  for (const version of versions) {
    const constructs = listConstructs(version);
    for (const c of constructs) {
      paths.push({ version, construct: c.name });
    }
  }
  return paths;
}

export default async function ConstructPage({ params }: { params: Promise<{ version: string; construct: string }> }) {
  const { version, construct } = await params;
  const spec = parseConstructSpec(version, construct);

  if (!spec) {
    notFound();
  }

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          <Link href={`/${version}`} style={{ textDecoration: "none", color: "#00B39F" }}>
            Home
          </Link>
          <Typography color="text.primary">{spec.info.title || construct}</Typography>
        </Breadcrumbs>

        <ConstructDetailClient
          info={spec.info}
          endpoints={spec.endpoints}
          schemas={spec.schemas}
          constructName={construct}
        />
      </Container>
    </Box>
  );
}
