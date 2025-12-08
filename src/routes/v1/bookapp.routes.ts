import Router from "express";
import { createBook, deleteBook, getAllBooks, getMyBooks } from "../../controller/book.controller";
import { protectedRoute } from "../../middleware/auth.middleware";

const router = Router();

//create book
router.post("/create", protectedRoute, createBook);

//get books
router.get("/", protectedRoute, getAllBooks);

//get my books
router.get("/user", protectedRoute, getMyBooks);

//delete book
router.delete("/:id", protectedRoute, deleteBook);

export default router;