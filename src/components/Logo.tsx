import React from 'react';

const logoSrc = 'https://res.cloudinary.com/dy3jvbisa/image/upload/v1762524075/Generated_Image_October_07_2025_-_4_20PM_tvrnif.svg';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-14 w-auto object-contain', style }) => {
    return (
        <img
            src={logoSrc}
            alt="Darul Attar - Authentic Oud & Attar"
            className={className}
            style={style}
            width="200"
            height="80"
            loading="eager" 
        />
    );
};