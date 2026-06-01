import React, { useEffect, useRef, useCallback } from 'react';

interface CloudinaryUploaderProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ onUpload, maxFiles = 1 }) => {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dy3jvbisa',
          uploadPreset: 'darulattar_preset',
          sources: ['local', 'url', 'camera', 'dropbox'],
          multiple: maxFiles > 1,
          maxFiles,
          cropping: false,
          styles: {
            palette: {
              window: '#050505',
              windowBorder: '#C0A080',
              tabIcon: '#C0A080',
              menuIcons: '#C0A080',
              textDark: '#050505',
              textLight: '#FFFFFF',
              link: '#C0A080',
              action: '#C0A080',
              inactiveTabIcon: '#6B7280',
              error: '#F44336',
              inProgress: '#C0A080',
              complete: '#4CAF50',
              sourceBg: '#1a1a1a',
            },
          },
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            onUpload([result.info.secure_url]);
          }
        }
      );
    }
  }, [onUpload, maxFiles]);

  const openWidget = useCallback(() => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      alert('Cloudinary widget is loading. Please try again.');
    }
  }, []);

  return (
    <div
      onClick={openWidget}
      className="border-2 border-dashed border-gray-600 rounded-sm p-10 text-center cursor-pointer hover:border-brand-gold transition group bg-black/30"
    >
      <div className="text-gray-400 group-hover:text-brand-gold transition">
        <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm">Click to upload</p>
        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WebP</p>
      </div>
    </div>
  );
};

export default CloudinaryUploader;
