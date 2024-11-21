import { useMutation } from "react-query";
import { axiosInstance } from "@/lib/axios";

export const useUpdateProduct = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (body) => {
      const res = await axiosInstance.put(`/products/${body.id}`, body);
      return res;
    },
    onSuccess,
    onError,
  });
};
