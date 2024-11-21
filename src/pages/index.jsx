import {
  Container,
  Heading,
  Table,
  Spinner,
  Button,
  Stack,
  Input,
} from "@chakra-ui/react";
import useFetchProducts from "@/features/product/useFetchProducts";
import { Field } from "@/components/ui/field";
import { useFormik } from "formik";
import { useCreateProduct } from "@/features/product/useCreateProduct";
import { useDeleteProduct } from "@/features/product/useDeleteProduct";
import { useUpdateProduct } from "@/features/product/useUpdateProduct";
import { toaster } from "@/components/ui/toaster";

export default function Home() {
  const {
    data,
    isLoading,
    refetch: refetchProducts,
  } = useFetchProducts({
    onError: (e) => {
      toaster.create({
        title: "Fetch Products",
        description: e?.message,
        type: "error",
        duration: 6000,
      });
    },
  });

  const handleSuccess = (title, description) => {
    toaster.create({
      title,
      description,
      type: "success",
      duration: 6000,
      action: {
        label: "OK",
        onClick: () => refetchProducts(),
      },
    });
  };

  const handleError = (title, e) => {
    toaster.create({
      title,
      description: e?.message,
      type: "error",
      duration: 6000,
    });
  };

  const { mutate: createProduct, isLoading: createProductIsLoading } =
    useCreateProduct({
      onSuccess: () =>
        handleSuccess("Create Product", "Product has been added"),
      onError: (e) => handleError("Create Product", e),
    });

  const { mutate: deleteProduct, isLoading: deleteProductIsLoading } =
    useDeleteProduct({
      onSuccess: () =>
        handleSuccess("Delete Product", "Product has been deleted"),
      onError: (e) => handleError("Delete Product", e),
    });

  const { mutate: updateProduct, isLoading: updateProductIsLoading } =
    useUpdateProduct({
      onSuccess: () =>
        handleSuccess("Update Product", "Product has been updated"),
      onError: (e) => handleError("Update Product", e),
    });

  const confirmDeleteProduct = (product) => {
    const shouldDelete = confirm(`Are you sure want to delete ${product.name}`);
    if (shouldDelete) {
      deleteProduct(product.id);
    }
  };

  const resetFields = () => formik.resetForm();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
    onSubmit: (values) => {
      const { name, price, description, image, id } = values;
      const productData = { name, price: parseInt(price), description, image };

      if (id) {
        updateProduct({ ...productData, id });
      } else {
        createProduct(productData);
      }

      resetFields();
    },
  });

  const handleFormInput = (e) => {
    formik.setFieldValue(e.target.name, e.target.value);
  };

  const onEditClick = (product) => {
    formik.setValues(product);
  };

  const renderListProduct = (products) => {
    return (
      products?.length > 0 &&
      products.map((product) => (
        <Table.Row key={product.id}>
          <Table.Cell>{product.id}</Table.Cell>
          <Table.Cell>{product.name}</Table.Cell>
          <Table.Cell>{product.price}</Table.Cell>
          <Table.Cell>{product.description}</Table.Cell>
          <Table.Cell>
            <Button
              onClick={() => onEditClick(product)}
              colorPalette="teal"
              variant="subtle"
            >
              Edit
            </Button>
          </Table.Cell>
          <Table.Cell>
            <Button
              onClick={() => confirmDeleteProduct(product)}
              colorPalette="red"
              variant="subtle"
            >
              Delete
            </Button>
          </Table.Cell>
        </Table.Row>
      ))
    );
  };

  return (
    <Container>
      <Heading size="xl">Products</Heading>
      <Table.Root size="sm" variant="outline" striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Price</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center" colSpan={2}>
              Action
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderListProduct(data?.data?.data)}</Table.Body>
      </Table.Root>
      <form onSubmit={formik.handleSubmit}>
        <Stack
          gap="8"
          maxW="sm"
          css={{ "--field-label-width": "96px", paddingTop: "20px" }}
        >
          <Field orientation="horizontal" label="Name">
            <Input
              name="name"
              placeholder="John Doe"
              flex="1"
              onChange={handleFormInput}
              value={formik.values.name}
            />
          </Field>
          <Field orientation="horizontal" label="Price">
            <Input
              name="price"
              placeholder="Price"
              flex="1"
              type="number"
              onChange={handleFormInput}
              value={formik.values.price}
            />
          </Field>
          <Field orientation="horizontal" label="Description">
            <Input
              name="description"
              placeholder="Description"
              flex="1"
              onChange={handleFormInput}
              value={formik.values.description}
            />
          </Field>
          <Field orientation="horizontal" label="Link Image">
            <Input
              name="image"
              placeholder="https://www.google.com"
              flex="1"
              onChange={handleFormInput}
              value={formik.values.image}
            />
          </Field>
          {createProductIsLoading || updateProductIsLoading ? (
            <Spinner />
          ) : (
            <Button colorScheme="teal" type="submit">
              Add Product
            </Button>
          )}
        </Stack>
      </form>
    </Container>
  );
}
