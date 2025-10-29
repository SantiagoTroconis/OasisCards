import React, { useState, useEffect } from 'react';

interface AsyncImageProps {
  getImageUrl: (name: string) => Promise<string>;
  playerName: string;
  alt: string;
  fallbackSrc?: string;
}

export const AsyncImage: React.FC<AsyncImageProps> = ({ getImageUrl, playerName, alt, fallbackSrc = '/placeholder.jpg' }) => {
  const [src, setSrc] = useState<string>(fallbackSrc);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        

        const url = await getImageUrl(playerName);
        const response = await fetch('http://127.0.0.1:5000/save-image-player', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: url, playerName: playerName }),
        }); 
        if (!response.ok) {
          throw new Error('Ha ocurrido un error al guardar la imagen');
        }
        setSrc(url);
      } catch (error) {
        console.error('Failed to load image:', error);
        setSrc(fallbackSrc);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [getImageUrl, playerName, fallbackSrc]);

  return (
    <img
      src={src}
      alt={alt}
      style={{ opacity: loading ? 0.5 : 1, objectFit: 'cover', width: '100%', height: '200px' }}
    />
  );
};
