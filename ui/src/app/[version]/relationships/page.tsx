import { Container, Typography, Box, Breadcrumbs, Paper, Grid, Card, CardContent } from "@mui/material";
import Link from "next/link";
import { loadSchemaProperties, loadTemplate } from "@/lib/schemas";
import DataTableClient from "@/components/DataTableClient";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { getVersions } from "@/lib/openapi";

export async function generateStaticParams() {
  return getVersions().map((version) => ({ version }));
}

export default async function RelationshipsPage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  const data = loadSchemaProperties(version, "relationship", "RelationshipDefinition");
  const metadata = loadSchemaProperties(version, "relationship", "Relationship_Metadata");
  const styles = loadSchemaProperties(version, "relationship", "RelationshipDefinitionMetadataStyles");
  const template = loadTemplate(version, "relationship");

  const columns = [
    { name: "name", label: "Property Name", options: { filter: false, sort: true } },
    { name: "type", label: "Type", options: { filter: true, sort: true } },
    { name: "required", label: "Required", options: { filter: true, sort: true } },
    { name: "description", label: "Description", options: { filter: false, sort: false } },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          <Link href={`/${version}`} style={{ textDecoration: 'none', color: '#00B39F' }}>
            Home
          </Link>
          <Typography color="text.primary">Relationships</Typography>
        </Breadcrumbs>
        
        <Box display="flex" alignItems="center" mb={2}>
          <AccountTreeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ color: 'primary.main' }}>
            Relationships
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" paragraph>
          Relationships define the exact nature of interaction between interconnected components in Meshery. By evaluating selectors against components, Meshery wires them together applying properties like kind, type, and subtype.
        </Typography>

        {template && (
          <Paper elevation={1} sx={{ p: 4, mb: 6, backgroundColor: '#f9f9f9', borderLeft: '4px solid #00B39F' }}>
            <Typography variant="h5" gutterBottom fontWeight={'bold'}>Example Relationship Anatomy</Typography>
            <Typography variant="body1" paragraph>
              It is easier to understand a Relationship by looking at its structured representation. Here is an example breaking down what makes up a Relationship.
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid #ddd' }}>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">Kind</Typography>
                    <Typography variant="h6">{template.kind}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Defines the structure geometry class (e.g., hierarchical, edge, sibling).
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid #ddd' }}>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">Type & SubType</Typography>
                    <Typography variant="h6">{template.type} / {template.subType}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Classify the interaction explicitly. A &apos;{template.type}&apos; indicates the component is controlling or encompassing the other.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid #ddd' }}>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">Selectors</Typography>
                    <Typography variant="h6">{template.selectors?.length || 0} configured rules</Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Selectors define how the relationship finds its interacting pairs using Match rules.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Typography variant="h4" gutterBottom mt={6} mb={3}>Schema Reference</Typography>

        <DataTableClient 
          title="Relationship Definition Properties" 
          columns={columns} 
          data={data} 
        />

        <DataTableClient 
          title="Metadata Properties" 
          columns={columns} 
          data={metadata} 
        />

        <DataTableClient 
          title="Visualization Styles" 
          columns={columns} 
          data={styles} 
        />
      </Container>
    </Box>
  );
}
