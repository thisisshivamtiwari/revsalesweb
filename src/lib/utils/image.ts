import { useUploadImageMutation } from "@/lib/features/user/userApi";

export const useImageUpload = () => {
  const [uploadImage, { isLoading, error }] = useUploadImageMutation();

  const uploadImageFile = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadImage(formData).unwrap();
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  return {
    uploadImageFile,
    isLoading,
    error,
  };
}; 