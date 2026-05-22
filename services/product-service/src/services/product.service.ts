import { Product, ProductAttributes } from '../models/product.model';

export const getProducts = async () => {
  return Product.findAll();
};

export const getProductById = async (id: string) => {
  return Product.findByPk(id);
};

export const createProduct = async (payload: Omit<ProductAttributes, 'id'>) => {
  return Product.create(payload as any);
};

export const updateProduct = async (id: string, payload: Partial<Omit<ProductAttributes, 'id'>>) => {
  await Product.update(payload as any, { where: { id } });
  return getProductById(id);
};

export const deleteProduct = async (id: string) => {
  return Product.destroy({ where: { id } });
};
