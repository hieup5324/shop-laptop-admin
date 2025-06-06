import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (category: any) => void;
}

const AddProductModal = ({
  isOpen,
  onClose,
  onProductAdded,
}: AddProductModalProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    price: 0,
    quantity: 0,
    description: "",
    photo_url: "",
    categoryId: 0,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleCategoryChange = (value: string) => {
    setNewProduct((prev) => ({ ...prev, categoryId: parseInt(value) }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("product_name", newProduct.product_name);
    formData.append("price", newProduct.price.toString());
    formData.append("quantity", newProduct.quantity.toString());
    formData.append("description", newProduct.description);
    formData.append("categoryId", newProduct.categoryId.toString());

    if (photoFile) {
      formData.append("photo_url", photoFile);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onProductAdded(response.data);
      onClose();
      setNewProduct({
        product_name: "",
        price: 0,
        quantity: 0,
        description: "",
        photo_url: "",
        categoryId: 0,
      });
      setPhotoFile(null);
      setLoading(false);
    } catch (error) {
      console.error("Error adding product", error);
      setLoading(false);
      toast.error("Failed to add product. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg w-1/3 border border-gray-300 shadow-lg relative">
        <h3 className="text-xl font-semibold mb-6">Thêm sản phẩm mới</h3>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <Label htmlFor="product_name" className="text-sm font-medium text-gray-700">Tên sản phẩm</Label>
            <Input
              id="product_name"
              name="product_name"
              value={newProduct.product_name}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">Giá</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Số lượng</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={newProduct.quantity}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Mô tả</Label>
            <Input
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700">Danh mục</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={newProduct.categoryId.toString()}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="photo_url" className="text-sm font-medium text-gray-700">Hình ảnh</Label>
            <Input
              id="photo_url"
              name="photo_url"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="border-gray-300">
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Đang thêm..." : "Thêm sản phẩm"}
            </Button>
          </div>
        </form>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 text-gray-200 animate-spin fill-blue-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;
