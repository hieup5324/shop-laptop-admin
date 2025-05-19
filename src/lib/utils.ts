import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

export const convertPaymentStatus = (paymentStatus: any): string => {
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
