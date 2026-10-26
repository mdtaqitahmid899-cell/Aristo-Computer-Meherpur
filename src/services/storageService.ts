import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, isFirebaseConfigured } from "@/lib/firebase/config";
import { ProductImage } from "@/types/product";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `File ${file.name} is not a valid format. Only JPG, JPEG, PNG, and WebP are allowed.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File ${file.name} exceeds 8MB size limit. Please choose a smaller image.`,
    };
  }

  return { valid: true };
}

/**
 * Resizes and compresses an image file using browser Canvas
 * to ~50-80KB to guarantee lightning-fast uploads and fit within Firestore limits.
 */
export async function compressImageFile(
  file: File,
  maxDimension = 1000,
  quality = 0.8
): Promise<{ dataUrl: string; blob: Blob }> {
  if (typeof window === "undefined") {
    return {
      dataUrl: "/images/products/placeholder.jpg",
      blob: new Blob([], { type: "image/jpeg" }),
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const originalDataUrl = (readerEvent.target?.result as string) || "";
      const img = new window.Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          fetch(originalDataUrl)
            .then((res) => res.blob())
            .then((blob) => resolve({ dataUrl: originalDataUrl, blob }))
            .catch(() => resolve({ dataUrl: originalDataUrl, blob: new Blob([], { type: "image/jpeg" }) }));
          return;
        }

        // Fill white background for transparent PNGs
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        canvas.toBlob(
          (blob) => {
            resolve({
              dataUrl: compressedDataUrl,
              blob: blob || new Blob([], { type: "image/jpeg" }),
            });
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        fetch(originalDataUrl)
          .then((res) => res.blob())
          .then((blob) => resolve({ dataUrl: originalDataUrl, blob }))
          .catch(() => resolve({ dataUrl: originalDataUrl, blob: new Blob([], { type: "image/jpeg" }) }));
      };

      img.src = originalDataUrl;
    };

    reader.onerror = () => {
      resolve({
        dataUrl: "/images/products/placeholder.jpg",
        blob: new Blob([], { type: "image/jpeg" }),
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a single image with automatic client compression and resilient fallback
 */
export async function uploadProductImage(
  file: File,
  productId: string,
  onProgress?: (progressPercent: number) => void
): Promise<ProductImage> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 1. Always compress image to ~50KB for fast transfer and lightweight storage
  const { dataUrl: compressedDataUrl, blob: compressedBlob } = await compressImageFile(file, 1000, 0.8);
  onProgress?.(40);

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const localFallbackPath = `local/${Date.now()}_${cleanName}`;

  // If Firebase Storage is not configured or not available, return compressed data URL immediately
  if (!isFirebaseConfigured() || !storage) {
    onProgress?.(100);
    return {
      url: compressedDataUrl,
      path: localFallbackPath,
    };
  }

  const storagePath = `products/${productId}/${Date.now()}_${cleanName}`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve) => {
    try {
      const uploadTask = uploadBytesResumable(storageRef, compressedBlob, {
        contentType: "image/jpeg",
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(40 + progress * 0.6));
          }
        },
        (error) => {
          console.warn("Storage upload warning, using compressed fallback:", error.message);
          onProgress?.(100);
          resolve({
            url: compressedDataUrl,
            path: localFallbackPath,
          });
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress?.(100);
            resolve({
              url: downloadUrl,
              path: storagePath,
            });
          } catch {
            onProgress?.(100);
            resolve({
              url: compressedDataUrl,
              path: localFallbackPath,
            });
          }
        }
      );
    } catch (err: unknown) {
      console.warn("Upload task initialization error, using compressed fallback:", err);
      onProgress?.(100);
      resolve({
        url: compressedDataUrl,
        path: localFallbackPath,
      });
    }
  });
}

/**
 * Uploads multiple images concurrently or sequentially with overall progress tracking
 */
export async function uploadMultipleProductImages(
  files: File[],
  productId: string,
  onImageProgress?: (fileIndex: number, progressPercent: number) => void
): Promise<ProductImage[]> {
  if (files.length > 8) {
    throw new Error("You can upload a maximum of 8 images per product.");
  }

  const uploadedImages: ProductImage[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const uploaded = await uploadProductImage(file, productId, (progress) => {
      onImageProgress?.(i, progress);
    });
    uploadedImages.push(uploaded);
  }

  return uploadedImages;
}

/**
 * Deletes a single image from Firebase Cloud Storage safely
 */
export async function deleteProductImageFromStorage(path: string): Promise<void> {
  if (!path || path.startsWith("local/") || path.startsWith("mock/") || !isFirebaseConfigured() || !storage) {
    return;
  }

  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (err: unknown) {
    console.warn(`Could not delete storage object at path "${path}":`, err);
  }
}

/**
 * Deletes multiple images from Firebase Storage
 */
export async function deleteProductImagesFromStorage(paths: string[]): Promise<void> {
  const promises = paths.map((path) => deleteProductImageFromStorage(path));
  await Promise.allSettled(promises);
}
