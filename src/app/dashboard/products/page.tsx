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
import { toast } from "sonner";

const ProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products", {
          params: {
            page: currentPage,
            page_size: pageSize,
            search: searchTerm,
          },
        });

        setProducts(response.data.data);
        setTotalPages(response.data.paging.totalPages);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize, searchTerm]);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Input
            type="text"
            placeholder="Search for a product"
            className="p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={() => setIsModalOpen(true)} // Open modal on click
        >
          Add New Product
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2">#</TableHead>
            <TableHead className="p-2">Product Image</TableHead>
            <TableHead className="p-2">Product Name</TableHead>
            <TableHead className="p-2">Price</TableHead>
            <TableHead className="p-2">Discount Price</TableHead>
            <TableHead className="p-2">Stock</TableHead>
            <TableHead className="p-2">Action</TableHead>
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
              <TableCell className="p-2">{`$${product.price}`}</TableCell>
              <TableCell className="p-2">
                {product.has_discount
                  ? `$${product.final_price}`
                  : "No Discount"}
              </TableCell>
              <TableCell className="p-2">{product.quantity}</TableCell>
              <TableCell className="p-2">
                <Button variant="outline" className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <div>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default ProductPage;
