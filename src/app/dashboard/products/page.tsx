"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Import Button from ShadCN
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Dialog } from "@headlessui/react"; // Import Dialog from Headless UI
import { Label } from "@/components/ui/label"; // For label inputs
import { Textarea } from "@/components/ui/textarea"; // For text inputs
import AddProductModal from "./modal";
import EditProductModal from "./edit-modal";
import { toast } from "sonner";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPriceVND } from "@/lib/format-price";
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const ProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3001/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/products", {
        params: {
          page: currentPage,
          page_size: pageSize,
          search: searchTerm,
          is_stock:
            stockFilter === "all"
              ? undefined
              : stockFilter === "in_stock"
              ? true
              : false,
          categoryId:
            categoryFilter === "all" ? undefined : parseInt(categoryFilter),
        },
      });

      setProducts(response.data.data);
      setTotalPages(response.data.paging.totalPages);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, searchTerm, stockFilter, categoryFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleProductAdded = () => {
    setIsModalOpen(false);
    toast.success("Sản phẩm đã được thêm thành công!", {
      icon: <span className="text-green-500">✔</span>,
    });
    setCurrentPage(1); // Đặt lại trang về đầu tiên
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleProductUpdated = () => {
    fetchProducts();
    toast.success("Cập nhật sản phẩm thành công!");
  };

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/products/${productToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Xóa sản phẩm thành công!");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      // Refresh the list
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm!");
    }
  };

  console.log(products);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <Label className="mb-2 text-sm font-medium">Tìm kiếm</Label>
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm"
              className="p-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-sm font-medium">Tình trạng</Label>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo tồn kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="in_stock">Còn hàng</SelectItem>
                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-sm font-medium">Danh mục</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2">#</TableHead>
            <TableHead className="p-2">Ảnh sản phẩm</TableHead>
            <TableHead className="p-2">Tên sản phẩm</TableHead>
            <TableHead className="p-2">Giá</TableHead>
            <TableHead className="p-2">Giảm giá</TableHead>
            <TableHead className="p-2">Kho</TableHead>
            <TableHead className="p-2">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell className="p-2">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell className="p-2">
                <img
                  src={product.photo_url}
                  alt={product.product_name}
                  className="w-16 h-16 object-cover"
                />
              </TableCell>
              <TableCell className="p-2">{product.product_name}</TableCell>
              <TableCell className="p-2">{`${formatPriceVND(
                product.price
              )} VNĐ`}</TableCell>
              <TableCell className="p-2">
                {product.has_discount
                  ? `$${product.final_price}`
                  : "No Discount"}
              </TableCell>
              <TableCell className="p-2">{product.quantity}</TableCell>
              <TableCell className="p-2">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => handleEditClick(product)}
                >
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteClick(product)}
                >
                  Xóa
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
                      className={`w-10 h-10 ${
                        currentPage === page ? "" : "border-black"
                      }`}
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
                  className={`w-10 h-10 ${
                    currentPage === page ? "" : "border-black"
                  }`}
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

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProductUpdated={handleProductUpdated}
        product={selectedProduct}
      />

      {/* Delete Confirmation Modal */}
      <ShadcnDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "
              {productToDelete?.product_name}" không? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </ShadcnDialog>
    </div>
  );
};

export default ProductPage;
