import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner"; // Import hàm toast để hiển thị thông báo

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: (category: any) => void;
}

const AddCategoryModal = ({
  isOpen,
  onClose,
  onCategoryAdded,
}: AddCategoryModalProps) => {
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3001/categories",
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onCategoryAdded(response.data);
      onClose();

      toast.success("Danh mục đã được thêm thành công!", {
        icon: <span className="text-green-500">✔</span>,
      });
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi thêm danh mục. Vui lòng thử lại!");
      }
      setNewCategory({ name: "", description: "" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl mb-4">Thêm danh mục mới</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tên danh mục"
            className="p-2 border rounded-lg w-full"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Mô tả danh mục"
            className="p-2 border rounded-lg w-full"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-blue-500 text-white"
            onClick={handleAddCategory}
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
