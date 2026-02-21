"use client";

import { useGetTeamsQuery } from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../../redux";
import Header from "@/components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import AddTeamModal from "@/components/ModalNewTeam";
import InviteTeamMemberModal from "@/components/InviteMemberModal";

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Team ID", width: 120 },
    { field: "teamName", headerName: "Team Name", width: 220 },

    {
      field: "owner",
      headerName: "Owner",
      width: 200,
      renderCell: (params) => {
        const row = params.row;
        if (!row || !row.owner) return "—";
        return row.owner.username ?? "—";
      },
    },

    {
      field: "members",
      headerName: "Members",
      width: 400,
      renderCell: (params) => {
        const row = params?.row;
        if (!row || !row.members) return "—";
        return row.members.map((u: any) => u.username).join(", ");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <button
          className="text-blue-600 font-semibold hover:underline"
          onClick={() => {
            setSelectedTeamId(params.row.id);
            setShowInviteModal(true);
          }}
        >
          Invite
        </button>
      ),
    }

  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;


  return (
    <div className="flex py-1 w-full flex-col p-8">
      <Header name="Teams" />

      <div className="mt-3 mr-3 mb-4 flex justify-end">
        <button
          onClick={() => setShowAddTeamModal(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          + Add Team
        </button>

        <AddTeamModal
          isOpen={showAddTeamModal}
          onClose={() => setShowAddTeamModal(false)}
        />
      </div>

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
      {/* Invite modal */}
      {selectedTeamId && (
        <InviteTeamMemberModal
          isOpen={showInviteModal}
          teamId={selectedTeamId}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};


export default Teams;

