"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Video, Loader2, Youtube, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  disabled?: boolean;
}

function toYouTubeEmbed(url: string): string | null {
  try {
    const trimmed = url.trim();

    // youtube.com/watch?v=XXXX
    let match = trimmed.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/
    );
    if (match) return `https://www.youtube.com/embed/${match[1]}`;

    // youtu.be/XXXX
    match = trimmed.match(
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/
    );
    if (match) return `https://www.youtube.com/embed/${match[1]}`;

    // youtube.com/embed/XXXX (already an embed URL)
    match = trimmed.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    );
    if (match) return trimmed;

    return null;
  } catch {
    return null;
  }
}

function isYouTubeUrl(url: string): boolean {
  return toYouTubeEmbed(url) !== null;
}

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];
const ACCEPTED_EXTENSIONS = ".mp4,.webm,.ogg,.mov";
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

export function VideoUpload({
  value,
  onChange,
  className,
  disabled,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [inputMode, setInputMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        alert("Tipe file tidak diizinkan. Gunakan MP4, WebM, OGG, atau MOV");
        return;
      }

      if (file.size > MAX_VIDEO_SIZE) {
        alert("Ukuran file terlalu besar. Maksimal 50MB");
        return;
      }

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "videos");

        const response = await fetch("/api/upload-document", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          onChange(data.url);
        } else {
          alert(data.error || "Gagal mengunggah video");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Gagal mengunggah video");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!isYouTubeUrl(trimmed)) {
      alert("URL YouTube tidak valid. Gunakan format youtube.com/watch?v= atau youtu.be/");
      return;
    }

    onChange(trimmed);
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlSubmit();
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
  };

  const getEmbedUrl = (url: string): string | null => {
    return toYouTubeEmbed(url);
  };

  const renderPreview = () => {
    const embedUrl = getEmbedUrl(value);

    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video preview"
        />
      );
    }

    // Direct video file
    return (
      <video
        src={value}
        controls
        className="w-full h-full object-contain bg-black"
      >
        Browser Anda tidak mendukung tag video.
      </video>
    );
  };

  // ── Preview state ──────────────────────────────────────────────
  if (value) {
    const isYT = isYouTubeUrl(value);

    return (
      <div className={cn("space-y-2", className)}>
        <div className="relative group">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
            {renderPreview()}
          </div>

          {/* Remove button */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Replace button – only useful for file uploads */}
          {!isYT && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
            >
              <Upload className="h-4 w-4 mr-1" />
              Ganti
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || uploading}
        />
      </div>
    );
  }

  // ── Empty / upload state ───────────────────────────────────────
  return (
    <div className={cn("space-y-2", className)}>
      {/* Mode tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100">
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 flex-1 justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            inputMode === "file"
              ? "bg-white text-green-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setInputMode("file")}
          disabled={disabled}
        >
          <Upload className="h-4 w-4" />
          Upload File
        </button>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 flex-1 justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            inputMode === "url"
              ? "bg-white text-green-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setInputMode("url")}
          disabled={disabled}
        >
          <Youtube className="h-4 w-4" />
          YouTube URL
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {inputMode === "file" ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            dragOver
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-400 hover:bg-gray-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() =>
            !disabled && !uploading && fileInputRef.current?.click()
          }
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
              <p className="text-sm text-gray-600">Mengunggah video...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Klik untuk upload atau drag &amp; drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  MP4, WebM, OGG, atau MOV (maks. 50MB)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={handleUrlKeyDown}
                className="pl-9"
                disabled={disabled || uploading}
              />
            </div>
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled || uploading || !urlInput.trim()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Terapkan"
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Mendukung URL dari youtube.com dan youtu.be
          </p>
        </div>
      )}
    </div>
  );
}
