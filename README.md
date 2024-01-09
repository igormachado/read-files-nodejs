### NodeJS API Restaurante 🧨🎯

🌏🏛 Esse projeto foi criado para realizar leitura de arquivo csv e grava no banco de dados. Sendo separado pelo título. Exemplo: description, price, title etc...

**Tecnologias usadas** 🤖 💻

- Nodejs ✅
  
- Prisma ORM ✅
  
- Postgres ✅
  
- Typescript ✅
  
- Express JS ✅
  
- multer ✅
  

#### Gettinn Started 🏁

1. **Faça o download do projeto.** ⚡
  
  ```bash
  git clone git@github.com:igormachado/read-files-nodejs.git
  ```
  
2. **Instalar as dependências do projeto, npm** ⚡
  

```bash
cd read-files-nodejs
npm install        
```

3 - **Realizar um migrate no Prisma ORM.** ⚡

```bash
npx prisma migrate dev
```

#### **POST** 🧨

- ***routes.post("/products);***
  
  - Esta rota cria um a leitura do arquivo fazendo a leitura e validando o file ser gravado no banco de dados.
    

```js
router.post(
  "/products",
  multerConfig.single("file"),
  async (request: Request, response: Response) => {
    const { file } = request;

    const readableFile = new Readable();
    readableFile.push(file?.buffer);
    readableFile.push(null);

    const productsLine = readline.createInterface({
      input: readableFile,
    });

    const products: Product[] = [];

    for await (let line of productsLine) {
      const productLineSplit = line.split(",");
      console.log(productLineSplit);
      console.log(productLineSplit[0]);
      console.log("");

      products.push({
        code_bar: productLineSplit[0],
        description: productLineSplit[1],
        price: Number(productLineSplit[2]),
        quantity: Number(productLineSplit[3]),
      });
    }

    for await (let { code_bar, description, price, quantity } of products) {
      await client.products.create({
        data: {
          code_bar,
          description,
          price,
          quantity,
        },
      });
    }
    return response.status(201).json(products);
  }
);
```

- ***Criando e verificando se o arquivo existe no banco de dados***
  

```js
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
```