import { Request, Response, NextFunction } from "express";
import Product from "../models/Product";
import Category from "../models/Category";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { deleteImageFromCloudinary } from "../utils/cloudinary.utils";

/**
 * Create a new Product (Farmer only)
 */
export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      productName,
      productDescription,
      price,
      quantity,
      productType,
      categoryId,
      isActive,
    } = req.body;

    // Verify the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new AppError("Invalid Category ID", 400));
    }

    // Handle uploaded images and certificates
    let imageURIs: string[] = [];
    let certificateURIs: string[] = [];

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    if (files) {
      if (files.images) {
        imageURIs = files.images.map((file) => file.path);
      }
      if (files.certificates) {
        certificateURIs = files.certificates.map((file) => file.path);
      }
    }

    const farmerId = req.user?._id;

    const product = await Product.create({
      productName,
      productDescription,
      price: Number(price),
      quantity: Number(quantity),
      productType,
      categoryId,
      farmerId,
      imageURIs,
      certificateURIs,
      isActive: isActive !== undefined ? isActive : false,
    });

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

/**
 * Get all Products (Public)
 */
export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({ isActive: true })
      .populate("categoryId", "name")
      .populate("farmerId", "name email");

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  },
);

/**
 * Get Products for the current Farmer
 */
export const getFarmerProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const farmerId = req.user?._id;

    if (!farmerId) {
      return next(
        new AppError("You must be logged in to view your products.", 401),
      );
    }

    const products = await Product.find({ farmerId })
      .populate("categoryId", "name")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  },
);

/**
 * Get Product by ID (Public)
 */
export const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate("categoryId", "name description")
      .populate("farmerId", "name email phone");

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

/**
 * Update a Product (Farmer owner only)
 */
export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const {
      productName,
      productDescription,
      price,
      quantity,
      productType,
      categoryId,
      isActive,
    } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    // Strictly verify that the user is the owner and is a FARMER
    // (req.user._id is a string/objectid, product.farmerId is an ObjectId)
    if (product.farmerId.toString() !== req.user?._id.toString()) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    // Handle image updates if new files are uploaded
    let imageURIs = product.imageURIs;
    let certificateURIs = product.certificateURIs ?? [];

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    if (files) {
      // 1. Update product images if provided
      if (files.images && files.images.length > 0) {
        // Delete old images from Cloudinary
        await Promise.all(
          product.imageURIs.map((url) => deleteImageFromCloudinary(url)),
        );
        // Set new image paths
        imageURIs = files.images.map((file) => file.path);
      }

      // 2. Update certificates if provided
      if (files.certificates && files.certificates.length > 0) {
        // Delete old certificates from Cloudinary
        await Promise.all(
          (product.certificateURIs ?? []).map((url) =>
            deleteImageFromCloudinary(url),
          ),
        );
        // Set new certificate paths
        certificateURIs = files.certificates.map((file) => file.path);
      }
    }

    // Update properties
    const updateData = {
      productName,
      productDescription,
      price: price ? Number(price) : product.price,
      quantity: quantity ? Number(quantity) : product.quantity,
      productType,
      categoryId,
      imageURIs,
      certificateURIs,
      isActive: isActive !== undefined ? isActive : product.isActive,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: "success",
      data: {
        product: updatedProduct,
      },
    });
  },
);

/**
 * Delete a Product (Farmer owner only)
 */
export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    // Strictly verify ownership or admin role
    if (
      product.farmerId.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    // 1. Delete all images and certificates from Cloudinary
    await Promise.all([
      ...product.imageURIs.map((url) => deleteImageFromCloudinary(url)),
      ...(product.certificateURIs ?? []).map((url) =>
        deleteImageFromCloudinary(url),
      ),
    ]);

    // 2. Delete the database record
    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);

/**
 * Approve a Product (Admin only)
 */
export const approveProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    // Toggle the active status only
    product.isActive = !product.isActive;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

/**
 * Get all Products (Admin only - includes inactive)
 */
export const getAllProductsAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find()
      .populate("categoryId", "name")
      .populate("farmerId", "name email");

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  },
);
