"use client";

import {
  Box, Typography, Paper, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Accordion, AccordionSummary,
  AccordionDetails, Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { EndpointInfo, SchemaInfo } from "@/lib/openapi";

const METHOD_COLORS: Record<string, string> = {
  GET: "#61affe",
  POST: "#49cc90",
  PUT: "#fca130",
  PATCH: "#50e3c2",
  DELETE: "#f93e3e",
};

function MethodBadge({ method }: { method: string }) {
  return (
    <Chip
      label={method}
      size="small"
      sx={{
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: METHOD_COLORS[method] || "#888",
        minWidth: 64,
        mr: 1,
      }}
    />
  );
}

function EndpointCard({ ep }: { ep: EndpointInfo }) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{ border: "1px solid #e0e0e0", mb: 1, "&:before": { display: "none" } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ "&:hover": { bgcolor: "#f9f9f9" } }}>
        <Box display="flex" alignItems="center" gap={1} width="100%" flexWrap="wrap">
          <MethodBadge method={ep.method} />
          <Typography variant="body2" fontFamily="monospace" fontWeight="bold" sx={{ flexShrink: 0 }}>
            {ep.path}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
            {ep.summary}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: "#fafafa", borderTop: "1px solid #eee" }}>
        {ep.operationId && (
          <Box mb={1}>
            <Typography variant="caption" color="text.secondary">
              operationId: <code>{ep.operationId}</code>
            </Typography>
          </Box>
        )}
        {ep.description && (
          <Typography variant="body2" paragraph>
            {ep.description}
          </Typography>
        )}
        {ep.tags.length > 0 && (
          <Box display="flex" gap={0.5} mb={2}>
            {ep.tags.map((t) => (
              <Chip key={t} label={t} size="small" variant="outlined" />
            ))}
          </Box>
        )}

        {ep.parameters.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Parameters
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>In</strong></TableCell>
                    <TableCell><strong>Required</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ep.parameters.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell><code>{p.name}</code></TableCell>
                      <TableCell>{p.in}</TableCell>
                      <TableCell>{p.required ? "Yes" : "No"}</TableCell>
                      <TableCell><code>{p.type}</code></TableCell>
                      <TableCell>{p.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {ep.requestBody && (
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Request Body {ep.requestBody.required && <Chip label="required" size="small" color="error" sx={{ ml: 1 }} />}
            </Typography>
            <Paper elevation={0} sx={{ p: 2, border: "1px solid #eee", bgcolor: "#fff" }}>
              <Typography variant="body2">
                Schema: <code>{ep.requestBody.schemaRef}</code>
              </Typography>
            </Paper>
          </Box>
        )}

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Responses
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Schema</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ep.responses.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Chip
                      label={r.code}
                      size="small"
                      color={r.code.startsWith("2") ? "success" : r.code.startsWith("4") ? "warning" : "error"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>{r.schemaRef && <code>{r.schemaRef}</code>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}

function SchemaCard({ schema }: { schema: SchemaInfo }) {
  if (schema.isRef) {
    return (
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0" }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {schema.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          → <code>{schema.refTarget}</code>
        </Typography>
      </Paper>
    );
  }

  if (schema.enumValues.length > 0) {
    return (
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0" }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {schema.name}
          <Chip label="enum" size="small" sx={{ ml: 1, verticalAlign: "middle" }} />
        </Typography>
        {schema.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {schema.description}
          </Typography>
        )}
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {schema.enumValues.map((v) => (
            <Chip key={v} label={v} size="small" variant="outlined" />
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      defaultExpanded={schema.properties.length <= 10}
      sx={{ border: "1px solid #e0e0e0", mb: 1, "&:before": { display: "none" } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            {schema.name}
          </Typography>
          <Chip label={schema.type} size="small" variant="outlined" />
          {schema.properties.length > 0 && (
            <Chip label={`${schema.properties.length} props`} size="small" variant="outlined" />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {schema.description && (
          <Box px={2} pt={1} pb={1}>
            <Typography variant="body2" color="text.secondary">
              {schema.description}
            </Typography>
          </Box>
        )}
        {schema.properties.length > 0 && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell><strong>Property</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Required</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schema.properties.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>
                      <code>{p.name}</code>
                      {p.format && (
                        <Chip label={p.format} size="small" sx={{ ml: 0.5, fontSize: "0.65rem" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <code>{p.type}</code>
                      {p.enumValues.length > 0 && (
                        <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                          {p.enumValues.map((v) => (
                            <Chip key={v} label={v} size="small" variant="outlined" sx={{ fontSize: "0.6rem" }} />
                          ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{p.required ? <Chip label="Yes" size="small" color="error" /> : "No"}</TableCell>
                    <TableCell sx={{ maxWidth: 400 }}>{p.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function ConstructDetailClient({
  info,
  endpoints,
  schemas,
  constructName,
}: {
  info: any;
  endpoints: EndpointInfo[];
  schemas: SchemaInfo[];
  constructName: string;
}) {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ color: "#00B39F" }}>
            {info.title || constructName}
          </Typography>
          {info.version && <Chip label={info.version} size="small" />}
          {info["x-deprecated"] && <Chip label="deprecated" size="small" color="warning" />}
        </Box>
        {info.description && (
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
            {info.description}
          </Typography>
        )}
      </Box>

      {/* Endpoints */}
      {endpoints.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Endpoints
            <Chip label={`${endpoints.length}`} size="small" sx={{ ml: 1, verticalAlign: "middle" }} />
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {endpoints.map((ep, i) => (
            <EndpointCard key={`${ep.method}-${ep.path}-${i}`} ep={ep} />
          ))}
        </Box>
      )}

      {/* Schemas */}
      {schemas.length > 0 && (
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Schemas
            <Chip label={`${schemas.length}`} size="small" sx={{ ml: 1, verticalAlign: "middle" }} />
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {schemas.map((s) => (
            <SchemaCard key={s.name} schema={s} />
          ))}
        </Box>
      )}
    </Box>
  );
}
