import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "sonner";

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const convertGhnStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    ready_to_pick: "Đơn hàng đang được chuẩn bị",
    picking: "Nhân viên đang lấy hàng",
    cancel: "Hủy đơn hàng",
    money_collect_picking: "Đang thu tiền người gửi",
    picked: "Nhân viên đã lấy hàng",
    storing: "Hàng đang nằm ở kho",
    delivering: "Đang giao hàng",
    delivered: "Đã giao hàng",
    return: "Trả hàng",
    delivery_fail: "Giao hàng không thành công",
    damage: "Hàng bị hỏng",
    lost: "Hàng bị mất",
  };

  return statusMap[status] || "Trạng thái không xác định";
};

const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

const convertPaymentStatus = (paymentStatus: any): string => {
  switch (paymentStatus) {
    case PAYMENT_STATUS.SUCCESS:
      return "Đã thanh toán";
    case PAYMENT_STATUS.PENDING:
      return "Chưa thanh toán";
    case PAYMENT_STATUS.FAILED:
      return "Thanh toán thất bại";
    default:
      return "Không xác định";
  }
};

const ViewOrderModal = ({ isOpen, onClose, order }: ViewOrderModalProps) => {
  const [ghnStatus, setGhnStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGhnStatus = async () => {
      if (!order?.order_code_transport) return;

      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3001/ghn/tracking_order",
          {
            order_code: order.order_code_transport,
          }
        );
        if (response?.data) {
          setGhnStatus(response.data.data.status);
        }
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái đơn hàng từ GHN:", error);
        toast.error("Không thể lấy trạng thái đơn hàng từ GHN!");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && order) {
      fetchGhnStatus();
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-white p-8 rounded-lg w-1/3 border border-gray-300 shadow-lg relative">
        <h3 className="text-xl font-semibold mb-6">Chi tiết đơn hàng</h3>

        <div className="space-y-4">
          {/* Thông tin người nhận */}
          <div className="mt-6">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Thông tin người nhận
            </Label>
            <div className="border rounded-lg p-4 space-y-2">
              <div>
                <span className="font-medium">Tên người nhận: </span>
                {order.receiver_name}
              </div>
              <div>
                <span className="font-medium">Số điện thoại: </span>
                {order.receiver_phone}
              </div>
              <div>
                <span className="font-medium">Địa chỉ: </span>
                {order.receiver_address}
              </div>
            </div>
          </div>

          {/* Chi tiết sản phẩm */}
          {order.orderItems && order.orderItems.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Chi tiết sản phẩm
              </Label>
              <div className="border rounded-lg p-4 space-y-4">
                {order.orderItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.photo_url}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-lg">{item.product_name}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Đơn giá: {item.price.toLocaleString("vi-VN")} VNĐ
                        </p>
                        <p className="text-sm text-gray-600">
                          Thành tiền: {item.total_price.toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tổng tiền */}
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Phí vận chuyển:</span>
              <span>{order.fee_transport?.toLocaleString("vi-VN")} VNĐ</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium text-lg">Tổng tiền:</span>
              <span className="text-lg font-bold">
                {order.total_price.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderModal;
