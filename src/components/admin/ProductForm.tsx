"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  Product,
  ProductCategory,
  ProductImage,
  PRODUCT_CATEGORIES,
  CATEGORY_DEFAULT_IMAGE_MAP,
} from "@/types/product";
import {
  uploadMultipleProductImages,
  validateImageFile,
  deleteProductImageFromStorage,
} from "@/services/storageService";

interface ProductFormProps {
  initialProduct?: Product | null;
  onSubmit: (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const SPEC_PRESETS = [
  "Processor",
  "Graphics Card",
  "RAM",
  "Storage",
  "Motherboard",
  "Display",
  "Power Supply",
  "Operating System",
  "Warranty",
];

export default function ProductForm({
  initialProduct,
  onSubmit,
  onCancel,
  isSaving,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topErrorRef = useRef<HTMLDivElement>(null);
  const bottomErrorRef = useRef<HTMLDivElement>(null);

  // Form states
  const [name, setName] = useState(initialProduct?.name || "");
  const [brand, setBrand] = useState(initialProduct?.brand || "");
  const [category, setCategory] = useState<ProductCategory>(
    initialProduct?.category || "Laptops"
  );
  const [price, setPrice] = useState<string>(
    initialProduct?.price ? initialProduct.price.toString() : ""
  );
  const [originalPrice, setOriginalPrice] = useState<string>(
    initialProduct?.originalPrice ? initialProduct.originalPrice.toString() : ""
  );
  const [stock, setStock] = useState<string>(
    initialProduct?.stock !== undefined ? initialProduct.stock.toString() : "10"
  );
  const [description, setDescription] = useState(
    initialProduct?.description || ""
  );
  const [featured, setFeatured] = useState<boolean>(
    initialProduct?.featured || false
  );

  // Specifications
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    initialProduct?.specifications && initialProduct.specifications.length > 0
      ? initialProduct.specifications
      : [
          { key: "Processor", value: "" },
          { key: "RAM", value: "" },
          { key: "Storage", value: "" },
          { key: "Warranty", value: "Official Warranty" },
        ]
  );

  // Images state
  const [existingImages, setExistingImages] = useState<ProductImage[]>(
    initialProduct?.images || []
  );
  const [removedImages, setRemovedImages] = useState<ProductImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [index: number]: number }>({});
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState("");
  const isSubmitting = isSaving || isUploading;

  const scrollToError = () => {
    setTimeout(() => {
      if (bottomErrorRef.current) {
        bottomErrorRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else if (topErrorRef.current) {
        topErrorRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 50);
  };

  // Handle new image file selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const totalCount = existingImages.length + newImageFiles.length + files.length;

    if (totalCount > 8) {
      setImageError("Maximum 8 images allowed per product.");
      return;
    }

    for (const file of files) {
      const val = validateImageFile(file);
      if (!val.valid) {
        setImageError(val.error || "Invalid file format or size.");
        return;
      }
    }

    const updatedFiles = [...newImageFiles, ...files];
    setNewImageFiles(updatedFiles);

    // Create object URLs for previews
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove existing image
  const handleRemoveExistingImage = (index: number) => {
    const target = existingImages[index];
    setRemovedImages((prev) => [...prev, target]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove newly added unsaved image
  const handleRemoveNewImage = (index: number) => {
    // Revoke object URL
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Set primary image (move to position 0)
  const handleSetPrimaryExisting = (index: number) => {
    if (index === 0) return;
    const selected = existingImages[index];
    const rest = existingImages.filter((_, i) => i !== index);
    setExistingImages([selected, ...rest]);
  };

  // Add direct image URL
  const handleAddImageUrl = () => {
    setImageError(null);
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setImageError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }
    const totalCount = existingImages.length + newImageFiles.length;
    if (totalCount >= 8) {
      setImageError("Maximum 8 images allowed per product.");
      return;
    }
    setExistingImages((prev) => [...prev, { url: trimmed, path: "" }]);
    setImageUrlInput("");
  };

  // Specs handling
  const handleAddSpecRow = (presetKey = "") => {
    setSpecs([...specs, { key: presetKey, value: "" }]);
  };

  const handleUpdateSpec = (index: number, field: "key" | "value", val: string) => {
    const next = [...specs];
    next[index][field] = val;
    setSpecs(next);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numPrice = parseFloat(price);
    const numStock = stock === "" ? 1 : parseInt(stock, 10);
    const numOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;

    if (!name.trim()) {
      setFormError("Please enter product title.");
      scrollToError();
      return;
    }

    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError("Please enter a valid price in BDT (greater than 0).");
      scrollToError();
      return;
    }

    if (isNaN(numStock) || numStock < 0) {
      setFormError("Please enter a valid stock quantity (0 or greater).");
      scrollToError();
      return;
    }

    try {
      setIsUploading(true);
      const productId = initialProduct?.id || `prod_${Date.now()}`;
      let newlyUploadedImages: ProductImage[] = [];

      // 1. Upload new image files if any
      if (newImageFiles.length > 0) {
        setUploadStatusText(`Compressing and uploading ${newImageFiles.length} photo(s)...`);
        newlyUploadedImages = await uploadMultipleProductImages(
          newImageFiles,
          productId,
          (fileIndex, progress) => {
            setUploadProgress((prev) => ({ ...prev, [fileIndex]: progress }));
          }
        );
      }

      // 2. Final images array (First image is main image)
      let finalImages: ProductImage[] = [
        ...existingImages,
        ...newlyUploadedImages,
      ];

      // Auto fallback to category default image if no images provided
      if (finalImages.length === 0) {
        const fallbackUrl =
          CATEGORY_DEFAULT_IMAGE_MAP[category] || "/images/products/placeholder.jpg";
        finalImages = [{ url: fallbackUrl, path: "" }];
      }

      // 3. Clean up removed images from storage
      if (removedImages.length > 0) {
        for (const img of removedImages) {
          if (img.path) {
            await deleteProductImageFromStorage(img.path);
          }
        }
      }

      // Filter out empty specs
      const cleanSpecs = specs.filter((s) => s.key.trim() && s.value.trim());

      setUploadStatusText("Saving product to database...");
      await onSubmit({
        name: name.trim(),
        brand: brand.trim() || "General",
        category,
        price: numPrice,
        originalPrice: numOriginalPrice,
        stock: numStock,
        inStock: numStock > 0,
        description:
          description.trim() ||
          `${name.trim()} - Quality hardware available at Aristo Computer Meherpur.`,
        specifications: cleanSpecs,
        images: finalImages,
        featured,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product.";
      setFormError(msg);
      scrollToError();
    } finally {
      setIsUploading(false);
      setUploadStatusText("");
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {formError && (
        <div
          ref={topErrorRef}
          className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="font-semibold">{formError}</span>
          </div>
          <button
            type="button"
            onClick={() => setFormError(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Details */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Basic Product Information
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Product Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. ASUS TUF Gaming A15 (Ryzen 7 / RTX 4060 / 16GB RAM)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Brand <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. ASUS, Intel, Gigabyte, Corsair"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 focus:outline-hidden"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-slate-800 dark:text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Regular Price (BDT ৳) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 138000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-mono focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Original Price (Optional Strike)
            </label>
            <input
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 145000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-mono focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Stock Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-mono focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Featured toggle */}
        <div className="pt-2 flex items-center justify-between bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Featured Product
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Display on homepage hero showcase and featured sections
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Multiple Image Upload Component */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Product Images (Up to 8 Images)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Supported formats: JPG, JPEG, PNG, WebP (Max 5MB each). The first image is the main display.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            {existingImages.length + newImageFiles.length} / 8 Images
          </span>
        </div>

        {imageError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{imageError}</span>
          </div>
        )}

        {/* Image Grid: Existing and New */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Existing Images */}
          {existingImages.map((img, idx) => (
            <div
              key={`existing-${idx}`}
              className="relative aspect-square rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden group shadow-2xs"
            >
              <Image
                src={img.url}
                alt={`Image ${idx + 1}`}
                fill
                sizes="120px"
                className="object-contain p-2"
              />

              {/* Main Badge */}
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  Main
                </span>
              )}

              {/* Controls Overlay */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryExisting(idx)}
                    className="px-2 py-1 bg-white/90 text-slate-900 rounded text-[10px] font-bold hover:bg-white transition-colors cursor-pointer"
                  >
                    Set as Main
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(idx)}
                  className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* New Image Previews */}
          {newImagePreviews.map((previewUrl, idx) => (
            <div
              key={`new-${idx}`}
              className="relative aspect-square rounded-xl bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 overflow-hidden group shadow-2xs"
            >
              <Image
                src={previewUrl}
                alt={`New Image ${idx + 1}`}
                fill
                sizes="120px"
                className="object-contain p-2"
              />
              <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                New
              </span>

              {uploadProgress[idx] !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${uploadProgress[idx]}%` }}
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(idx)}
                  className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Upload Button Box */}
          {existingImages.length + newImageFiles.length < 8 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 bg-white dark:bg-slate-800/60 flex flex-col items-center justify-center p-4 text-center transition-all cursor-pointer group"
            >
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 transition-colors" />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Upload Photo
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500">JPG, PNG, WebP</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleImageFileChange}
          className="hidden"
        />

        {/* Direct Image URL input option */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Or Paste Web Image URL (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="/images/... or image URL"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImageUrl();
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Add URL
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Product Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Comprehensive hardware details, key features, performance metrics, and use-case benefits..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 focus:outline-hidden resize-none"
        />
      </div>

      {/* Dynamic Specifications */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Technical Specifications
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Add key-value hardware attributes (e.g., Processor, Memory, Warranty)
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAddSpecRow()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-xs font-semibold transition-colors self-start cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Spec</span>
          </button>
        </div>

        {/* Quick Presets Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mr-1">
            Quick Add:
          </span>
          {SPEC_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAddSpecRow(preset)}
              className="text-[10px] font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              + {preset}
            </button>
          ))}
        </div>

        {/* Specs List */}
        <div className="space-y-2">
          {specs.map((spec, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Key (e.g. Processor)"
                value={spec.key}
                onChange={(e) => handleUpdateSpec(idx, "key", e.target.value)}
                className="w-1/3 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
              <input
                type="text"
                placeholder="Value (e.g. Intel Core i7 14700)"
                value={spec.value}
                onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handleRemoveSpec(idx)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Delete Row"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload/Saving Status Bar */}
      {isSubmitting && (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-3">
          <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="font-semibold">{uploadStatusText || "Saving product..."}</span>
        </div>
      )}

      {/* Bottom Error Alert */}
      {formError && (
        <div
          ref={bottomErrorRef}
          className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="font-semibold">{formError}</span>
          </div>
          <button
            type="button"
            onClick={() => setFormError(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Bottom Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-blue-400 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isUploading ? "Uploading Images..." : "Publishing Product..."}</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>{initialProduct ? "Update Product" : "Publish Product"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
