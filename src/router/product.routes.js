import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
import uploader from "../utils/uploader.js";

const productRouter = Router();
const PRODUCT = new ProductManager();

// Product Manager
productRouter.post("/", uploader.single("file"), async (req, res) => {
    const { file } = req;

    if(!file){
        res.status(400).send({ state: "error", message: "file is required" });
        return;
    }

    const filename = file.filename;
    const { category, title, description, price, code, stock } = req.body;
    return res.status(201).send(await PRODUCT.addProduct({ category, title, description, price, thumbnail: filename, code, stock }));
});

productRouter.get("/", async (req, res) => {
    return res.status(200).render(await PRODUCT.getProducts());
});

productRouter.get("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    return res.status(200).send(await PRODUCT.getProductById(ID));
});

productRouter.delete("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    return res.status(200).send(await PRODUCT.deleteProductById(ID));
});

productRouter.put("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    const { category, title, description, price, thumbnail, code, stock, available } = req.body;
    return res.status(200).send(await PRODUCT.updateProduct({ ID, category, title, description, price, thumbnail, code, stock, available }));
});

productRouter.put("/available/:id", async (req, res) => {
    const ID = Number(req.params.id);
    const RESULT = await PRODUCT.toggleAvailability(ID);
    if (RESULT.error) {
        return res.status(404).send(RESULT);
    }
    return res.status(200).send(RESULT);
});

export default productRouter;