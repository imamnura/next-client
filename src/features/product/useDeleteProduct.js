import { useMutation } from "react-query";
import { axiosInstance } from "@/lib/axios";

export const useDeleteProduct = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/products/${id}`);
      return res;
    },
    onSuccess,
    onError,
  });
};
