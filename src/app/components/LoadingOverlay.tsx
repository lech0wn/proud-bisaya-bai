import React from "react";

interface LoadingOverlayProps {
    saving: boolean;
    uploading: boolean;
    uploadingThumbnail: boolean;
    slug?: string;
}

export function LoadingOverlay({
    saving,
    uploading,
    uploadingThumbnail,
    slug,
    }: LoadingOverlayProps) {
    if (!saving && !uploading && !uploadingThumbnail) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg px-8 py-6 shadow-xl">
            <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-gray-900 font-medium">
                {saving &&
                (slug ? "Updating article..." : "Publishing article...")}
                {uploading && "Uploading image..."}
                {uploadingThumbnail && "Uploading thumbnail..."}
            </p>
            </div>
        </div>
        </div>
    );
}
