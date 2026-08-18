import { useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";

export default function ImageInput({ label, onChange, existingUrl = null }) {
  const [preview, setPreview] = useState(existingUrl);

  // clean up the object URL we create, so we don't leak memory on unmount/change
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onChange(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  };

  const clear = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      {preview ? (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="preview"
            className="w-32 h-32 object-cover rounded border"
          />
          <button
            type="button"
            onClick={clear}
            className="absolute -top-2 -right-2 bg-white border rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded cursor-pointer text-gray-400 hover:text-gray-600">
          <ImagePlus size={24} />
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      )}
    </div>
  );
}