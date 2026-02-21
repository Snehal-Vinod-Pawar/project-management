"use client";

import React, { useState } from "react";
import { useGetUsersQuery, useAddUserMutation, useDeleteUserMutation } from "@/state/api";
import { useAppSelector } from "../../redux";
import Header from "@/components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import ModalNewUser from "@/components/AddUserModal";

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [addUser] = useAddUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [showModal, setShowModal] = useState(false);

  const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 100 },
    { field: "username", headerName: "Username", width: 180 },
    {
      field: "profilePictureUrl",
      headerName: "Profile Picture",
      width: 140,
      renderCell: (params) => {
        const src = params.value?.startsWith("http")
          ? params.value
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            params.row.username
          )}`;

        return (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-9 w-9 transition-all duration-200 hover:scale-110">
              <Image
                src={src}
                alt={params.row.username}
                width={36}
                height={36}
                className="h-full w-full rounded-full object-cover shadow-sm"
              />
            </div>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <button
          onClick={async () => {
            if (confirm("Delete this user?")) {
              await deleteUser(params.row.userId);
            }
          }}
          className="text-red-600 font-semibold hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users) return <div>Error fetching users</div>;

  return (
    <div className="flex py-1 w-full flex-col p-8">
      <Header name="Users" />

      <div className="mt-0 w-full max-w-4xl rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="mt-3 mr-3 mb-4 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            + Add User
          </button>
          <ModalNewUser isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>

        <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.userId}
            pagination
            showToolbar
            disableColumnFilter
            disableColumnSelector
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
