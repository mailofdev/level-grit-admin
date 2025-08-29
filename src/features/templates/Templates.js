import React, { useEffect } from "react";
import { TableContainer } from "../../components/dynamicTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchTemplates, removeTemplates } from "../../features/templates/templateSlice";
import Loader from "../../components/display/Loader";

export default function Templates() {
  const dispatch = useDispatch();
  const { list:templates, loading } = useSelector((state) => state.templates);

const columns = [
  { key: "name", label: "Template Name", type: "text" },
  { key: "category", label: "Category", type: "badge" },
  { key: "tags", label: "Tags", type: "badge" },
  { key: "thumbnailUrl", label: "Thumbnail", type: "image" },
  { key: "assetUrls", label: "Assets", type: "file" },
  { key: "status", label: "Status", type: "badge" },
  { key: "placeholders", label: "Placeholders", type: "json" },
  { key: "price", label: "Price", type: "number" },
  { key: "createdAt", label: "Created At", type: "date" },
  { key: "updatedAt", label: "Updated At", type: "date" }
];


  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleDelete = async (ids) => {
    try {
      await dispatch(removeTemplates(ids)).unwrap();
      dispatch(fetchTemplates()); // Refresh after delete
    } catch (err) {
      console.error("Failed to delete templates", err);
    }
  };

  return (
    <div className="container p-4">
      {loading && (
        <Loader
          fullScreen
          size="60px"
          color="#0d6efd"
          text="Loading templates..."
        />
      )}
      <TableContainer
        columns={columns}
        data={templates}
        multiSelect={false}
        itemPerPage={10}
        detailsRoute="/templates"
        onDeleteConfirm={handleDelete}
      />
    </div>
  );
}
