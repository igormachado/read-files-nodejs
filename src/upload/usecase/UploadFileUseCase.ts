import { client } from "../../database/client";

interface IProduct {
  code_bar: string;
  description: string;
  price: number;
  quantity: number;
}

export class UploadFileUseCase {
  async execute({ code_bar, description, price, quantity }: IProduct) {
    const productExists = await client.products.findFirst({
      where: {
        description,
      },
    });

    if (productExists) {
      throw new Error("Product already exists.");
    }

    const createProduct = await client.products.create({
      data: {
        code_bar,
        description,
        price,
        quantity,
      },
    });

    return createProduct;
  }
}
