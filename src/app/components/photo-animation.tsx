"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PhotoBack, PhotoFront } from "./photo-trash";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Undo, Share2, Link, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

const fadeInOut = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: springTransition,
};

const IMAGES = ["beach", "camp", "city", "snow"];

export function PhotoAnimation() {
  const { toast } = useToast();
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [readyToRemove, setReadyToRemove] = useState<boolean>(false);
  const [removed, setRemoved] = useState(false);
  const [hide, setHide] = useState(false);

  const getImagePath = (imageName: string) => `/images/photo-${imageName}.png`;

  const imagesToShow = readyToRemove
    ? IMAGES.filter((img) => !imagesToRemove.includes(img))
    : IMAGES;

  useEffect(() => {
    if (removed) {
      setTimeout(() => {
        setHide(true);
      }, 1000);

      setTimeout(() => {
        setImagesToRemove([]);
        setReadyToRemove(false);
        setRemoved(false);
      }, 1200);

      setTimeout(() => {
        setHide(false);
      }, 1700);
    }
  }, [removed]);

  const handleShare = async (type: string) => {
    const selectedImages = imagesToRemove.map((img) => getImagePath(img));

    switch (type) {
      case "copy":
        try {
          await navigator.clipboard.writeText(selectedImages.join("\n"));
          toast({
            title: "Links copied!",
            description: `${selectedImages.length} image links copied to clipboard`,
          });
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: String(err) || "Could not copy links to clipboard",
            variant: "destructive",
          });
        }
        break;

      case "download":
        // Create download links for selected images
        selectedImages.forEach((img) => {
          const link = document.createElement("a");
          link.href = img;
          link.download = img.split("/").pop() || "image";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
        toast({
          title: "Downloading images",
          description: `${selectedImages.length} images will be downloaded`,
        });
        break;

      case "share":
        if (navigator.share) {
          try {
            await navigator.share({
              title: "Shared Photos",
              text: "Check out these photos!",
              url: selectedImages[0], // Share first image for native share
            });
          } catch (err) {
            toast({
              title: "Sharing failed",
              description: String(err) || "Could not share the images",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Sharing not supported",
            description: "Your browser doesn't support native sharing",
            variant: "destructive",
          });
        }
        break;
    }
  };

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}>
      <motion.div
        initial={false}
        animate={{
          opacity: hide ? 0 : 1,
          scale: hide ? 0.98 : 1, // Subtle scale effect when hiding
        }}
        transition={{ duration: 0.3 }}
        className="relative min-h-[600px] w-full flex flex-col items-center justify-between gap-8 px-4 py-8 md:px-8"
      >
        {/* Enhanced Undo Button */}
        <div className="w-full">
          <AnimatePresence>
            {imagesToRemove.length > 0 && !readyToRemove && (
              <motion.div {...fadeInOut} className="mb-4 flex justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setImagesToRemove((prev) => prev.slice(0, -1))
                    }
                    className="bg-white/90 backdrop-blur-sm hover:bg-white/75 transition-all duration-200"
                  >
                    <motion.div
                      whileHover={{ rotate: -45 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Undo className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Image Grid */}
        <motion.div
          className="w-full flex flex-col gap-4 items-center"
          animate={{
            scale: readyToRemove ? 0.95 : 1,
            opacity: readyToRemove ? 0.6 : 1,
            filter: readyToRemove ? "blur(2px)" : "blur(0px)",
          }}
          transition={{ duration: 0.3 }}
        >
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 w-full max-w-[1400px]">
            <AnimatePresence mode="popLayout">
              {!readyToRemove &&
                imagesToShow.map((image) => (
                  <Dialog key={image}>
                    <DialogTrigger asChild>
                      <motion.li
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={
                          imagesToRemove.includes(image)
                            ? {
                                scale: 0.8,
                                opacity: 0,
                                y: 20,
                                transition: { duration: 0.2 },
                              }
                            : {
                                opacity: 0,
                                filter: "blur(4px)",
                                transition: { duration: 0.17 },
                              }
                        }
                        transition={springTransition}
                        className="relative flex aspect-square w-full"
                      >
                        {/* Enhanced Selection Indicator */}
                        <motion.div
                          initial={false}
                          animate={{
                            scale: imagesToRemove.includes(image) ? 1.1 : 1,
                            opacity: imagesToRemove.includes(image) ? 1 : 0.7,
                            backgroundColor: imagesToRemove.includes(image)
                              ? "rgba(255, 255, 255, 1)"
                              : "rgba(0, 0, 0, 0.2)",
                          }}
                          transition={springTransition}
                          className={clsx(
                            "pointer-events-none absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                          )}
                        >
                          <AnimatePresence>
                            {imagesToRemove.includes(image) && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={springTransition}
                                className="absolute inset-0.5 rounded-full bg-white"
                              />
                            )}
                          </AnimatePresence>
                        </motion.div>

                        {/* Enhanced Image Button */}
                        <button
                          aria-label={`Select ${image} image`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (imagesToRemove.includes(image)) {
                              setImagesToRemove((images) =>
                                images.filter((img) => img !== image)
                              );
                            } else {
                              setImagesToRemove((images) => [...images, image]);
                            }
                          }}
                          className="group relative w-full overflow-hidden rounded-2xl bg-slate-100"
                        >
                          <motion.img
                            layoutId={`image-${image}`}
                            className="h-full w-full object-cover"
                            whileHover={{
                              scale: 1.05,
                              transition: {
                                ...springTransition,
                                duration: 0.3,
                              },
                            }}
                            alt={`${image} scene`}
                            src={getImagePath(image)}
                            height={300}
                            width={300}
                          />
                          <motion.div
                            initial={false}
                            animate={{
                              opacity: imagesToRemove.includes(image) ? 0.3 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-black"
                          />
                          <motion.div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        </button>
                      </motion.li>
                    </DialogTrigger>

                    {/* Enhanced Dialog Preview */}
                    <DialogContent className="max-w-3xl p-0">
                      <motion.img
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20 }}
                        transition={springTransition}
                        src={getImagePath(image)}
                        alt={`${image} scene`}
                        className="w-full rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
            </AnimatePresence>
          </ul>

          {/* Centered Controls */}
          <AnimatePresence>
            {imagesToRemove.length > 0 && !readyToRemove && (
              <motion.div
                {...fadeInOut}
                className="w-full flex justify-center mt-3 md:mt-4 px-4"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.95 }}
                  transition={springTransition}
                  className="flex gap-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 whitespace-nowrap text-xs md:text-sm"
                    onClick={() => {
                      setImagesToRemove([]);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Clear All</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                  <div className="w-px h-6 my-auto bg-slate-200" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-red-600 whitespace-nowrap text-xs md:text-sm"
                    onClick={() => {
                      if (readyToRemove) {
                        setRemoved(true);
                      } else {
                        setReadyToRemove(true);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                    Trash ({imagesToRemove.length})
                  </Button>
                  <div className="w-px h-6 my-auto bg-slate-200" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 whitespace-nowrap text-xs md:text-sm"
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                        <span className="sm:hidden">↗</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleShare("share")}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("copy")}>
                        <Link className="mr-2 h-4 w-4" />
                        Copy Links
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("download")}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {readyToRemove ? (
          <motion.div
            initial={{ scale: 1.2, opacity: 0, filter: "blur(4px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, bounce: 0, type: "spring" }}
            className="mt-4 flex flex-col gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (readyToRemove) {
                  setRemoved(true);
                } else {
                  setReadyToRemove(true);
                }
              }}
              className="flex h-8 w-[200px] items-center justify-center gap-[15px] rounded-full bg-[#FF3F40] hover:bg-[#ff2c2d] text-center text-[13px] font-semibold text-[#FFFFFF] shadow-lg transition-colors"
            >
              Trash {imagesToRemove.length} Photos
            </motion.button>
          </motion.div>
        ) : null}

        <AnimatePresence>
          {readyToRemove ? (
            <div className="absolute top-1/2 z-10 h-[114px] w-24 -translate-y-1/2">
              <motion.div
                initial={{ scale: 1.2, filter: "blur(4px)", opacity: 0 }}
                animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                exit={{ scale: 1.2, filter: "blur(4px)", opacity: 0 }}
              >
                <PhotoBack />
              </motion.div>

              <motion.div
                animate={{
                  y: removed ? 110 : 73,
                  scale: removed ? 0.7 : 1,
                  filter: removed ? "blur(4px)" : "blur(0px)",
                }}
                transition={
                  removed
                    ? { duration: 0.3, type: "spring", bounce: 0 }
                    : { delay: 0.13 }
                }
                className="absolute flex w-full top-[-60px] flex-col-reverse items-center"
              >
                {imagesToRemove.map((image, index) => (
                  <li key={image} className="flex h-1 items-center gap-2">
                    <motion.img
                      layoutId={`image-${image}`}
                      alt="A guy"
                      className="rounded"
                      src={getImagePath(image)}
                      height={59}
                      width={59}
                      style={{
                        rotate:
                          index % 2 === 0
                            ? 4 * (imagesToRemove.length - index + 1)
                            : -1 * (imagesToRemove.length - index + 1) * 4,
                      }}
                    />
                  </li>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.175, duration: 0 }}
                className="absolute bottom-[0] left-[3px] h-full w-[90px]"
              >
                <PhotoFront />
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}
