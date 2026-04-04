"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Trash2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PhotoUploadProps {
  doctorId: string;
  currentPhotoUrl: string | null;
  doctorName: string;
  onPhotoUpdated: (url: string | null) => void;
}

export default function PhotoUpload({
  doctorId,
  currentPhotoUrl,
  doctorName,
  onPhotoUpdated,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = doctorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create unique filename
      const ext = file.name.split(".").pop();
      const fileName = `doctor-${doctorId}-${Date.now()}.${ext}`;
      const filePath = `doctors/${fileName}`;

      // Delete old photo if exists
      if (currentPhotoUrl) {
        const oldPath = currentPhotoUrl.split("/avatars/")[1];
        if (oldPath) {
          await supabase.storage.from("avatars").remove([oldPath]);
        }
      }

      // Upload new photo
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setError("Failed to upload photo. Please try again.");
        setUploading(false);
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update doctor record
      const { error: updateError } = await supabase
        .from("doctors")
        .update({
          photo_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", doctorId);

      if (updateError) {
        console.error("Update error:", updateError);
        setError("Photo uploaded but failed to update profile.");
        setUploading(false);
        return;
      }

      setPreviewUrl(publicUrl);
      onPhotoUpdated(publicUrl);
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove your profile photo?")) return;

    setDeleting(true);
    setError("");

    try {
      // Delete from storage
      if (previewUrl) {
        const path = previewUrl.split("/avatars/")[1];
        if (path) {
          await supabase.storage.from("avatars").remove([path]);
        }
      }

      // Update doctor record
      await supabase
        .from("doctors")
        .update({
          photo_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", doctorId);

      setPreviewUrl(null);
      onPhotoUpdated(null);
    } catch (err) {
      console.error("Delete photo error:", err);
      setError("Failed to remove photo.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="font-bold text-gray-900 mb-4">Profile Photo</h2>

      <div className="flex items-center gap-6">
        {/* Preview */}
        <div className="relative flex-shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={doctorName}
              className="w-24 h-24 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{initials}</span>
            </div>
          )}

          {(uploading || deleting) && (
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <label className="btn-primary text-sm cursor-pointer inline-flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {previewUrl ? "Change Photo" : "Upload Photo"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading || deleting}
              />
            </label>

            {previewUrl && (
              <button
                onClick={handleDelete}
                disabled={uploading || deleting}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-2">
            JPG, PNG or WebP. Max 5MB. Square photos work best.
          </p>

          {error && (
            <div className="mt-2 flex items-start gap-1.5">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}