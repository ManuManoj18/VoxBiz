import { motion } from "framer-motion";
import { useState } from "react";

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Sample images for demo
const sampleImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1484391470168-a6d0d3bb7d55?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop"
];

export const ThreeDMarquee = ({
  images = [],
  className
}) => {
  // Split the images array into 4 equal parts
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return images.slice(start, start + chunkSize);
  });

  return (
    <div className={cn("w-full h-screen overflow-hidden bg-black opacity-50", className)}>
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="w-full h-full"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "center center"
          }}
        >
          <div
            style={{
              transform: "rotateX(35deg) rotateY(-5deg) rotateZ(-20deg)",
              transformStyle: "preserve-3d",
              transformOrigin: "center center"
            }}
            className="absolute inset-0 grid grid-cols-4 gap-0 p-2 -top-32 -left-16 w-[120%] h-[150%]"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ 
                  y: colIndex % 2 === 0 ? [-400, 400] : [400, -400]
                }}
                transition={{
                  duration: colIndex % 2 === 0 ? 18 : 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }}
                key={colIndex + "marquee"}
                className="flex flex-col gap-0"
              >
                <GridLineVertical className="left-0" offset="100px" />
                {subarray.map((image, imageIndex) => (
                  <div className="relative" key={imageIndex + image}>
                    <GridLineHorizontal className="top-0" offset="40px" />
                    <motion.img
                      whileHover={{
                        y: -10,
                        scale: 1.02,
                        rotateX: 3
                      }}
                      transition={{
                        duration: 0.15,
                        ease: "easeOut",
                      }}
                      src={image}
                      alt={`Image ${imageIndex + 1}`}
                      className="w-full aspect-video rounded-none object-cover shadow-md hover:shadow-xl border-none"
                      style={{
                        transformStyle: "preserve-3d"
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GridLineHorizontal = ({
  className,
  offset
}) => {
  return (
    <div
      style={{
        "--background": "#000000",
        "--color": "rgba(255, 255, 255, 0.1)",
        "--height": "1px",
        "--width": "8px",
        "--fade-stop": "85%",
        "--offset": offset || "40px",
        "--color-dark": "rgba(255, 255, 255, 0.1)",
      }}
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "z-10",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    />
  );
};

const GridLineVertical = ({
  className,
  offset
}) => {
  return (
    <div
      style={{
        "--background": "#000000",
        "--color": "rgba(255, 255, 255, 0.1)",
        "--height": "8px",
        "--width": "1px",
        "--fade-stop": "85%",
        "--offset": offset || "100px",
        "--color-dark": "rgba(255, 255, 255, 0.1)",
      }}
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "z-10",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    />
  );
};

// Demo component
export default function App() {
  return (
    <div className="w-full h-screen">
      <ThreeDMarquee />
    </div>
  );
}