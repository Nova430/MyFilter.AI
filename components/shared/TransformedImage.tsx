"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { dataUrl, debounce, download, getImageSize, handleError } from '@/lib/utils';

import axios from 'axios';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import { CldImage, getCldImageUrl } from 'next-cloudinary';

async function transformImageWithReplicate({ imageUrl, style, prompt } : ReplicateImage) {
  try {
      console.log(imageUrl)
      const response = await axios.post('/api/predictions', { imageUrl, style, prompt });
      console.log(response)
      console.log(response.data[0])
      return response.data[0]; // Assuming the API returns the URL or some response directly
  } catch (error) {
      console.error('Error transforming image with Replicate:', error);
      throw error;
  }
}

const TransformedImage = ({ image, type, title, transformationConfig, isTransformation, setIsTransformation, hasDownload = false } : TransformedImageProps) => {
  const [transformedImageUrl, setTransformedImageUrl] = useState<string>('');
  const [isEffectRunning, setIsEffectRunning] = useState(false);
  useEffect(() => {
    if (image?.publicId && isTransformation) {
      if (isEffectRunning || !image?.publicId || !isTransformation) {
        return;
      }
  
      setIsEffectRunning(true);

      const imageUrl = image?.secureURL;
        const style = ''; // Define the style as needed
        const prompt = ''; // Define the prompt as needed

        transformImageWithReplicate({ imageUrl, style, prompt })
          .then(setTransformedImageUrl)
          .catch((error) => {
            console.error('Error loading transformed image:', error);
            if (setIsTransformation)
              setIsTransformation(false);
          })
          .finally(() => {
            setIsEffectRunning(false); // Reset the flag when the operation is complete
          });
          // Cleanup function if necessary
          return () => {
            // Reset the effect running state if the component unmounts or the effect cleans up
            setIsEffectRunning(false);
          };
    }
  }, [image, transformationConfig, setIsTransformation]);  


  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    download(getCldImageUrl({
      width: image?.width,
      height: image?.height,
      src: image?.publicId,
      ...transformationConfig
    }), title)
  }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex-between">
                <h3 className="h3-bold text-zinc-200">
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

            {image?.publicId && transformationConfig ? (
              <div className="relative">
                <Image 
                  src={transformedImageUrl}
                  alt={image.title}
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="transformed-image"
                  onLoad={() => {
                    if (setIsTransformation) {
                      setTimeout(() => {
                        setIsTransformation(false);
                      }, 2000); // Delay of 2000 milliseconds (2 seconds)
                    }
                  }}
                  onError={() => {
                    debounce(() => {
                      setIsTransformation && setIsTransformation(false);
                    }, 20000)()
                  }}
                  {...transformationConfig}
                />

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
            ): (
              <div className="transformed-placeholder">
                Transformed Image
              </div>
            )}
        </div>
    );
};

export default TransformedImage;