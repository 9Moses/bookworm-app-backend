import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import { Book, IBook } from "../model/books.model";
import mongoose, { Types } from "mongoose";
import { UserDocument } from "../model/user.model";

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, caption, image, rating } = req.body;
    const user = req?.user?._id;

    if (!image || !title || !caption || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    //create book
    const newBook = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      user,
    });

    const savedBook = await newBook.save();
    res.status(201).json({
      payload: {
        message: "Book created successfully",
        book: savedBook,
      },
    });
  } catch (error: any) {
    console.log("Error creating book", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

//get all books
//pagination => infinite loading
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalbooks = await Book.countDocuments();

    res.status(200).json({
      payload: {
        message: "Books fetched successfully",
        books,
        currentPage: page,
        totalbooks,
        totalPages: Math.ceil(totalbooks / limit),
      },
    });
  } catch (error: any) {
    console.log("Error in fetching books", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

//get book that user created
export const getMyBooks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Convert string to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    const books = await Book.find({ username: objectId }).sort({ createdAt: -1 });

    res.status(200).json({
      payload: {
        message: "Books fetched successfully",
        books,
      },
    });
  } catch (error: any) {
    console.log("Error in fetching books", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

//delete book
export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    //check if the user creator of the book
    if (deletedBook.user.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (deletedBook.image && deletedBook.image.includes("cloudinary")) {
      try {
        const publicId = deletedBook.image.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (deleteError: any) {
        console.log(
          "Error deleting image from cloudinary",
          deleteError.message
        );
      }
    }

    await deletedBook.deleteOne();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error: any) {
    console.log("Error in deleting book", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
