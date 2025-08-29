// src/features/users/UserList.js
import React, { useEffect } from "react";
import { TableContainer } from "../../components/dynamicTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, removeUsers } from "./userSlice";
import Loader from "../../components/display/Loader";

export default function UserList() {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((state) => state.users);
  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "phoneNumber", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "gender", label: "Gender" },
    { key: "role", label: "Role" },
  ];

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRowSelect = (row, idx) => {
    // console.log("Selected Row:", row, "Index:", idx);
  };

  const handleDelete = async (ids) => {
    try {
      await dispatch(removeUsers(ids)).unwrap();
      dispatch(fetchUsers()); // Refresh list after delete
    } catch (err) {
      console.error("Failed to delete users", err);
    }
  };

  return (
    <div className="container p-4">
      {loading && <Loader fullScreen size="60px" color="#0d6efd" text="Loading users..." />}
      <TableContainer
        columns={columns}
        data={users}
        multiSelect={false}
        itemPerPage={10}
        detailsRoute="/users"
        onRowSelect={handleRowSelect}
        onDeleteConfirm={handleDelete}
      />
    </div>
  );
}
