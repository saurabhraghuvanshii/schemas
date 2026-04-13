"use client";

import dynamic from "next/dynamic";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState, useCallback } from "react";

interface ColumnProp {
  name: string;
  label: string;
  options?: any;
}

interface DataTableClientProps {
  title: string;
  data: any[];
  columns: ColumnProp[];
}

export default function DataTableClient({ title, data, columns }: DataTableClientProps) {
  const [MUIDataTable, setMUIDataTable] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Dynamically import at runtime to avoid SSR entirely
    import("@sistent/mui-datatables").then((mod: any) => {
      // Handle double-nested default export: mod.default.default
      const Component = mod?.default?.default || mod?.default || mod;
      setMUIDataTable(() => Component);
    });
  }, []);

  const options = {
    filterType: "dropdown" as const,
    responsive: "standard" as const,
    selectableRows: "none" as const,
    elevation: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
    print: false,
    download: false,
  };

  if (!mounted || !MUIDataTable) {
    return (
      <Box sx={{ width: "100%", mb: 4, p: 4, display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: 2 }}>
        <CircularProgress size={32} sx={{ color: "#00B39F", mb: 2 }} />
        <Typography variant="body2" color="text.secondary">Loading {title}...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mb: 4, "& .MuiPaper-root": { boxShadow: "none", border: "1px solid #e0e0e0" } }}>
      <MUIDataTable
        title={title}
        data={data}
        columns={columns}
        options={options}
      />
    </Box>
  );
}
