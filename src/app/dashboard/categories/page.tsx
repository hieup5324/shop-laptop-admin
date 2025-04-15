"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import AddCategoryModal from "./modal";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3001/categories", {
          params: {
            page: currentPage,
            page_size: pageSize,
            search: searchTerm,
          },
        });

        setCategories(response.data.data);
        setTotalPages(response.data.paging.totalPages);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, [currentPage, pageSize, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setPageSize(6);
  };

  const handleCategoryAdded = () => {
    setIsModalOpen(false);
    toast.success("Danh mục đã được thêm thành công!", {
      icon: <span className="text-green-500">✔</span>,
    });
    setCurrentPage(1); // Đặt lại trang về đầu tiên
  };

  const openConfirmModal = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setIsConfirmModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete === null) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:3001/categories/delete/${categoryToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryToDelete)
      );

      toast.success("Danh mục đã được xóa thành công!", {
        icon: <span className="text-green-500">✔</span>,
      });

      setIsConfirmModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category", error);
      toast.error("Có lỗi xảy ra khi xóa danh mục. Vui lòng thử lại!");
    }
  };

  const handleUpdateCategory = async (updatedCategory: any) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3001/categories/${categoryToEdit.id}`,
        updatedCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật danh mục trong UI
      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryToEdit.id ? updatedCategory : category
        )
      );

      toast.success("Danh mục đã được cập nhật thành công!", {
        icon: <span className="text-green-500">✔</span>,
      });

      setIsEditModalOpen(false);
      setCategoryToEdit(null);
    } catch (error) {
      console.error("Error updating category", error);
      toast.error("Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <input
            type="text"
            placeholder="Search for a category"
            className="p-2 border rounded-lg"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2">#</TableHead>
            <TableHead className="p-2">Category Name</TableHead>
            <TableHead className="p-2">Description</TableHead>
            <TableHead className="p-2">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell className="p-2">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell className="p-2">{category.name}</TableCell>
              <TableCell className="p-2">
                {category.description || "No description"}
              </TableCell>
              <TableCell className="p-2">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => openEditModal(category)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => openConfirmModal(category.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          className="mr-4 border-black"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              if (page === 1 || page === totalPages) return true;
              if (Math.abs(page - currentPage) <= 2) return true;
              return false;
            })
            .map((page, index, array) => {
              if (index > 0 && page - array[index - 1] > 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className="px-2">...</span>
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      className={`w-10 h-10 ${currentPage === page ? "" : "border-black"}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`w-10 h-10 ${currentPage === page ? "" : "border-black"}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
        </div>
        <Button
          variant="outline"
          className="border-black"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Modal Xác Nhận Xóa */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-1/3 border border-gray-300">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p>Are you sure you want to delete this category?</p>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsConfirmModalOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chỉnh Sửa */}
      {isEditModalOpen && categoryToEdit && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-1/3 border border-gray-300">
            <h3 className="text-lg font-semibold">Edit Category</h3>
            <Input
              type="text"
              className="p-2 border rounded-lg w-full mb-4"
              value={categoryToEdit.name}
              onChange={(e) =>
                setCategoryToEdit({ ...categoryToEdit, name: e.target.value })
              }
            />
            <Textarea
              className="p-2 border rounded-lg w-full mb-4"
              value={categoryToEdit.description}
              onChange={(e) =>
                setCategoryToEdit({
                  ...categoryToEdit,
                  description: e.target.value,
                })
              }
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleUpdateCategory(categoryToEdit)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
};

export default CategoriesPage;
