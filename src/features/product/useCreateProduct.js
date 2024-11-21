import { useMutation } from "react-query";
import { axiosInstance } from "@/lib/axios";

export const useCreateProduct = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (body) => {
      const res = await axiosInstance.post("/products", body);
      return res;
    },
    onSuccess,
    onError,
  });
};
