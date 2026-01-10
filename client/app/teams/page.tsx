"use client";

import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 120 },
  { field: "teamName", headerName: "Team Name", width: 220 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 220 },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    width: 220,
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />

      <div className="mt-0 w-full max-w-4xl rounded-xl border border-gray-200 bg-white shadow-sm">
        <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={teams || []}
            columns={columns}
            getRowId={(row) => row.id}
            pagination
            showToolbar
            disableColumnFilter
            disableColumnSelector
            className={dataGridClassNames}
            sx={{
              ...dataGridSxStyles(isDarkMode),

              /* HEADER */
              "& .MuiDataGrid-columnHeaders": {
                background:
                  "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                borderBottom: "1px solid #e5e7eb",
              },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
                fontSize: "13.5px",
                color: "#0f172a",
                letterSpacing: "0.03em",
              },

              /* ZEBRA ROWS */
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#fcfcfd",
              },

              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#ffffff",
              },

              /* ROW HOVER */
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(37, 99, 235, 0.08)",
                cursor: "pointer",
              },

              /* ROW SELECTED */
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor:
                  "rgba(37, 99, 235, 0.16) !important",
                boxShadow: "inset 4px 0 0 #2563eb",
              },

              /* CELLS */
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #eef2f7",
                fontSize: "13.5px",
                color: "#1f2937",
              },

              /* TOOLBAR */
              "& .MuiDataGrid-toolbarContainer": {
                borderBottom: "1px solid #e5e7eb",
                padding: "10px 12px",
                backgroundColor: "#ffffff",
              },

              "& .MuiDataGrid-toolbarContainer button": {
                color: "#2563eb",
                fontWeight: 600,
                borderRadius: "8px",
                padding: "6px 10px",
                transition: "all 0.2s ease",
              },

              "& .MuiDataGrid-toolbarContainer button:hover": {
                backgroundColor: "rgba(37, 99, 235, 0.12)",
              },

              "& .MuiDataGrid-toolbarContainer svg": {
                color: "#2563eb",
              },

              /* FOOTER */
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f8fafc",
                borderTop: "1px solid #e5e7eb",
              
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Teams;
