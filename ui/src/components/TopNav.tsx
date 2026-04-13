"use client";

import { AppBar, Toolbar, Typography, Box, MenuItem, Select, FormControl } from "@mui/material";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function TopNav({
  currentVersion,
  versions,
}: {
  currentVersion: string;
  versions: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleVersionChange = (event: any) => {
    const newVersion = event.target.value as string;
    // Replace the first segment (which should be the version) with the new version
    const segments = pathname.split("/");
    if (segments.length > 1 && versions.includes(segments[1])) {
      segments[1] = newVersion;
      router.push(segments.join("/"));
    } else {
      router.push(`/${newVersion}`);
    }
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        width: "100%",
        borderBottom: "1px solid #e0e0e0",
        bgcolor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: { xs: 2, sm: 3 },
          maxWidth: "xl",
          margin: "0 auto",
        }}
      >
        <Link href={`/${currentVersion}`} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src="/meshery-logo.svg" alt="Meshery Logo" width={32} height={32} style={{ marginRight: 12 }} />
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            Meshery Schemas
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
          <Select
            value={currentVersion}
            onChange={handleVersionChange}
            displayEmpty
            inputProps={{ "aria-label": "Select API Version" }}
            sx={{ fontWeight: "bold", color: "#00B39F", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#00B39F" } }}
          >
            {versions.map((ver) => (
              <MenuItem key={ver} value={ver}>
                {ver}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
