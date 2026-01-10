"use client";

import { useGetUsersQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 100 },
    { field: "username", headerName: "Username", width: 180 },
    {
        field: "profilePictureUrl",
        headerName: "Profile Picture",
        width: 140,
        renderCell: (params) => (
            <div className="flex h-full w-full items-center justify-center">
                <div className="h-9 w-9 transition-all duration-200 hover:scale-110">
                    <Image
                        src={`/${params.value}`}
                        alt={params.row.username}
                        width={36}
                        height={36}
                        className="h-full w-full rounded-full object-cover shadow-sm"
                    />
                </div>
            </div>
        ),
    },
];

const Users = () => {
    const { data: users, isLoading, isError } = useGetUsersQuery();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !users) return <div>Error fetching users</div>;

    return (
        <div className="flex w-full flex-col p-8">
            <Header name="Users" />

            {/* Card container */}
            <div className="mt-0 w-full max-w-4xl rounded-xl border border-gray-200 bg-white shadow-sm">
                <div style={{ height: 650, width: "100%" }}>
                    <DataGrid
                        rows={users || []}
                        columns={columns}
                        getRowId={(row) => row.userId}
                        pagination
                        showToolbar
                        disableColumnFilter
                        disableColumnSelector
                        className={dataGridClassNames}
                        sx={{
                            ...dataGridSxStyles(isDarkMode),

                            /* HEADER*/
                            "& .MuiDataGrid-columnHeaders": {
                                background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                                borderBottom: "1px solid #e5e7eb",
                            },

                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: 700,
                                fontSize: "13.5px",
                                color: "#0f172a",
                                letterSpacing: "0.03em",
                            },

                            /*ZEBRA ROWS*/
                            "& .MuiDataGrid-row:nth-of-type(even)": {
                                backgroundColor: "#fcfcfd",
                            },

                            "& .MuiDataGrid-row:nth-of-type(odd)": {
                                backgroundColor: "#ffffff",
                            },

                            /*ROW HOVER*/
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "rgba(37, 99, 235, 0.08)",
                                cursor: "pointer",
                            },

                            /*ROW SELECTED*/
                            "& .MuiDataGrid-row.Mui-selected": {
                                backgroundColor: "rgba(37, 99, 235, 0.16) !important",
                                boxShadow: "inset 4px 0 0 #2563eb",
                            },

                            /*CELLS*/
                            "& .MuiDataGrid-cell": {
                                borderBottom: "1px solid #eef2f7",
                                fontSize: "13.5px",
                                color: "#1f2937",
                            },

                            /*AVATAR CELL EFFECT*/
                            "& .MuiDataGrid-cell:has(img)": {
                                paddingTop: "6px",
                                paddingBottom: "6px",
                            },

                            "& img": {
                                transition: "all 0.25s ease",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                            },

                            "& .MuiDataGrid-row:hover img": {
                                transform: "scale(1.1)",
                                boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                            },

                            /*TOOLBAR*/
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

                            /*FOOTER*/
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

export default Users;
