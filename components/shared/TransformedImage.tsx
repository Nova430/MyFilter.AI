import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { debounce, download } from '@/lib/utils';
import { transformImageWithReplicate } from '@/replicate';

const TransformedImage = ({ image, type, title, transformationConfig, isTransformation, setIsTransformation, hasDownload = false } : TransformedImageProps) => {
    const [transformedImageUrl, setTransformedImageUrl] = useState(null);

    useEffect(() => {
      if (image?.publicId && transformationConfig) {
          setIsTransformation?.(true);
          transformImageWithReplicate({imageUrl: image.publicUrl, style: 'Clay', prompt: 'a person in a post-apocalyptic war game'})
              .then(transformedUrl => {
                  if (typeof transformedUrl === 'string') {
                      setTransformedImageUrl(transformedUrl);
                  }
                  setIsTransformation?.(false);
              })
              .catch(error => {
                  console.error('Error transforming image:', error);
                  setIsTransformation?.(false);
              });
      }
  }, [image, transformationConfig, setIsTransformation]);

    const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      if (transformedImageUrl) {
          download(transformedImageUrl, title);
      }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex-between">
                <h3 className="h3-bold text-dark-600">
                    Transformed
                </h3>

                {hasDownload && transformedImageUrl && (
                    <button 
                        className="download-btn" 
                        onClick={downloadHandler}
                    >
                        <Image 
                            src="/assets/icons/download.svg"
                            alt="Download"
                            width={24}
                            height={24}
                            className="pb-[6px]"
                        />
                    </button>
                )}
            </div>

            {transformedImageUrl ? (
                <div className="relative">
                    <Image 
                        src={transformedImageUrl}
                        alt={title}
                        layout="fill"
                        className="transformed-image"
                        onLoad={() => setIsTransformation && setIsTransformation(false)}
                        onError={() => {
                            debounce(() => {
                                setIsTransformation && setIsTransformation(false);
                            }, 8000)();
                        }}
                    />
                </div>
            ) : (
                <div className="transformed-placeholder">
                    Transformed Image
                </div>
            )}

            {isTransformation && (
                <div className="transforming-loader">
                    <Image 
                        src="/assets/icons/spinner.svg"
                        width={50}
                        height={50}
                        alt="spinner"
                    />
                    <p className="text-white/80">Please wait...</p>
                </div>
            )}
        </div>
    );
};

export default TransformedImage;