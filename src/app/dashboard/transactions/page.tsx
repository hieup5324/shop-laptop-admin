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
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import React from "react";
import { formatPriceVND } from "@/lib/format-price";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { convertPaymentStatus } from "@/lib/utils";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [transStatus, setTransStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/vnpay", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: currentPage,
          page_size: pageSize,
          search: searchTerm,
          trans_status: transStatus !== "all" ? transStatus : undefined,
        },
      });

      setUsers(response.data.data);
      setTotalPages(response.data.paging.totalPages);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchTerm, transStatus]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (transaction: any) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/vnpay/${transactionToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Xóa giao dịch thành công!");
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      // Refresh the list
      fetchUsers();
    } catch (error) {
      console.error("Error deleting transaction", error);
      toast.error("Có lỗi xảy ra khi xóa giao dịch!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Tìm kiếm giao dịch..."
            className="p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">
              Trạng thái giao dịch:
            </span>
            <Select value={transStatus} onValueChange={setTransStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="success">Giao dịch thành công</SelectItem>
                <SelectItem value="failed">Giao dịch thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2">#</TableHead>
            <TableHead className="p-2">Ngày tạo</TableHead>
            <TableHead className="p-2">Ngân hàng</TableHead>
            <TableHead className="p-2">Mã giao dịch</TableHead>
            <TableHead className="p-2">Loại thẻ</TableHead>
            <TableHead className="p-2">Giá trị</TableHead>
            <TableHead className="p-2">Trạng thái giao dịch</TableHead>
            <TableHead className="p-2">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="p-2">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell className="p-2">
                {dayjs(user.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="p-2">{user.bank_code}</TableCell>
              <TableCell className="p-2">{user.bank_tran_no}</TableCell>
              <TableCell className="p-2">{user.card_type}</TableCell>
              <TableCell className="p-2">{`${formatPriceVND(
                user.amount
              )} VNĐ`}</TableCell>
              <TableCell className="p-2">
                {convertPaymentStatus(user.transaction_status)}
              </TableCell>
              <TableCell className="p-2">
                <Button variant="outline" onClick={() => handleViewClick(user)}>
                  Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Transaction View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Ngày tạo:</span>
                <span className="col-span-3">
                  {dayjs(selectedTransaction.createdAt).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Ngân hàng:</span>
                <span className="">{selectedTransaction.bank_code}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Mã giao dịch:</span>
                <span className="">{selectedTransaction.bank_tran_no}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Loại thẻ:</span>
                <span className="col-span-3">
                  {selectedTransaction.card_type}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Giá trị:</span>
                <span className="col-span-3">
                  {formatPriceVND(selectedTransaction.amount)} VNĐ
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Trạng thái:</span>
                <span className="col-span-3">
                  {convertPaymentStatus(selectedTransaction.transaction_status)}
                </span>
              </div>
              {selectedTransaction.order_code && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Order Code:</span>
                  <span className="col-span-3">
                    {selectedTransaction.order_code}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa giao dịch này không? Hành động này không
              thể hoàn tác.
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
      </Dialog>

      {/* Pagination */}
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
    </div>
  );
};

export default UsersPage;
