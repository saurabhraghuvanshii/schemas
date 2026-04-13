"use client";

import { Box, Typography, Paper, Container, Grid, Chip, TextField, InputAdornment } from "@mui/material";
import Link from "next/link";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ApiIcon from "@mui/icons-material/Api";
import SearchIcon from "@mui/icons-material/Search";
import StorageIcon from "@mui/icons-material/Storage";
import { useState } from "react";

interface ConstructCardData {
  name: string;
  title: string;
  description: string;
  version: string;
  deprecated: boolean;
  hasEndpoints: boolean;
  endpointCount: number;
  schemaCount: number;
}

export default function HomeClient({ currentVersion, constructs }: { currentVersion: string; constructs: ConstructCardData[] }) {
  const [search, setSearch] = useState("");

  const filtered = constructs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const withEndpoints = filtered.filter((c) => c.hasEndpoints && !c.deprecated);
  const schemaOnly = filtered.filter((c) => !c.hasEndpoints && !c.deprecated);
  const deprecated = filtered.filter((c) => c.deprecated);

  return (
    <Box sx={{ minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Hero */}
        <Box sx={{ mb: 6 }}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <img src="/meshery-logo.svg" alt="Meshery Logo" width={48} height={48} />
            <Typography variant="h2" component="h1" fontWeight="bold" sx={{ color: "#00B39F" }}>
              Meshery Schemas
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700 }}>
            Web-published OpenAPI documentation for all Meshery schema constructs. Browse endpoints,
            request/response schemas, and data models — all generated directly from the spec.
          </Typography>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search constructs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4, maxWidth: 500 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Quick links */}
        <Box display="flex" gap={2} mb={4} flexWrap="wrap">
          <Link href={`/${currentVersion}/relationships`} style={{ textDecoration: "none" }}>
            <Chip icon={<AccountTreeIcon />} label="Relationships" clickable color="primary" variant="outlined" />
          </Link>
          <Link href={`/${currentVersion}/selectors`} style={{ textDecoration: "none" }}>
            <Chip icon={<FilterAltIcon />} label="Selectors" clickable color="primary" variant="outlined" />
          </Link>
        </Box>

        {/* API constructs */}
        {withEndpoints.length > 0 && (
          <>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, mt: 2 }}>
              API Constructs
              <Chip label={`${withEndpoints.length}`} size="small" sx={{ ml: 1, verticalAlign: "middle" }} />
            </Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {withEndpoints.map((c) => (
                <Grid key={c.name} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Link href={`/${currentVersion}/constructs/${c.name}`} style={{ textDecoration: "none" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: "100%",
                        border: "1px solid #e0e0e0",
                        transition: "all 0.2s",
                        "&:hover": { transform: "translateY(-2px)", boxShadow: 3, borderColor: "#00B39F" },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <img src="/meshery-logo.svg" alt="Meshery Logo" width={20} height={20} />
                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                          {c.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {c.description ? c.description.slice(0, 100) + (c.description.length > 100 ? "…" : "") : "No description"}
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip label={`${c.endpointCount} endpoints`} size="small" color="primary" variant="outlined" />
                        <Chip label={`${c.schemaCount} schemas`} size="small" variant="outlined" />
                        <Chip label={c.version} size="small" variant="outlined" />
                      </Box>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Schema-only constructs */}
        {schemaOnly.length > 0 && (
          <>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
              Schema Definitions
              <Chip label={`${schemaOnly.length}`} size="small" sx={{ ml: 1, verticalAlign: "middle" }} />
            </Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {schemaOnly.map((c) => (
                <Grid key={c.name} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Link href={`/${currentVersion}/constructs/${c.name}`} style={{ textDecoration: "none" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: "100%",
                        border: "1px solid #e0e0e0",
                        transition: "all 0.2s",
                        "&:hover": { transform: "translateY(-2px)", boxShadow: 3, borderColor: "#00B39F" },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <img src="/meshery-logo.svg" alt="Meshery Logo" width={20} height={20} />
                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                          {c.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {c.description ? c.description.slice(0, 100) + (c.description.length > 100 ? "…" : "") : "No description"}
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip label={`${c.schemaCount} schemas`} size="small" variant="outlined" />
                        <Chip label={c.version} size="small" variant="outlined" />
                      </Box>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Deprecated */}
        {deprecated.length > 0 && (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: "text.secondary" }}>
              Deprecated
            </Typography>
            <Grid container spacing={3}>
              {deprecated.map((c) => (
                <Grid key={c.name} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Link href={`/${currentVersion}/constructs/${c.name}`} style={{ textDecoration: "none" }}>
                    <Paper
                      elevation={0}
                      sx={{ p: 3, height: "100%", border: "1px dashed #ccc", opacity: 0.7 }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                        {c.title}
                      </Typography>
                      <Chip label="deprecated" size="small" color="warning" sx={{ mt: 1 }} />
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}
