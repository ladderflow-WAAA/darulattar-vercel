import React, { useRef } from 'react';

interface ImageUploadOverlayProps {
  onImageUpload: (dataUrl: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const ImageUploadOverlay: React.FC<ImageUploadOverlayProps> = ({ onImageUpload, children, className }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    onImageUpload(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    return (
        <div 
            className={className} 
            onClick={handleClick} 
            role="button" 
            tabIndex={0} 
            onKeyDown={(e) => e.key === 'Enter' && handleClick(e as any)}
            aria-label="Upload custom image"
        >
            {children}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleFileChange}
            />
        </div>
    );
};