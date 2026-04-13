declare module '@sistent/mui-datatables' {
  import * as React from 'react';

  export interface MUIDataTableOptions {
    filterType?: string;
    responsive?: string;
    selectableRows?: string;
    elevation?: number;
    rowsPerPage?: number;
    rowsPerPageOptions?: number[];
  }

  export interface MUIDataTableProps {
    title: string | React.ReactNode;
    data: any[];
    columns: any[];
    options?: MUIDataTableOptions;
  }

  const MUIDataTable: React.ComponentType<MUIDataTableProps>;
  export default MUIDataTable;
}
