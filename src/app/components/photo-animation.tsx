"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PhotoBack, PhotoFront } from "./photo-trash";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { Toggle } from "@/components/ui/toggle";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Undo } from "lucide-react";
import clsx from "clsx";

const IMAGES = ["beach", "camp", "city", "snow"];

export function PhotoAnimation() {
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

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}>
      <motion.div
        initial={false}
        animate={{ opacity: hide ? 0 : 1 }}
        className="relative min-h-[600px] w-full flex flex-col items-center justify-between gap-8 px-4 py-8 md:px-8"
      >
        {/* Undo Button */}
        <AnimatePresence>
          {imagesToRemove.length > 0 && !readyToRemove && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-2 left-2 md:top-4 md:left-4 z-10"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setImagesToRemove((prev) => prev.slice(0, -1))}
                className="bg-white/90 backdrop-blur-sm hover:bg-white/75"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Grid */}
        <div className="w-full flex flex-col gap-6 items-center">
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 w-full max-w-[1400px]">
            <AnimatePresence>
              {!readyToRemove &&
                imagesToShow.map((image) => (
                  <Dialog key={image}>
                    <DialogTrigger asChild>
                      <motion.li
                        exit={
                          imagesToRemove.includes(image)
                            ? {}
                            : {
                                opacity: 0,
                                filter: "blur(4px)",
                                transition: { duration: 0.17 },
                              }
                        }
                        className="relative flex aspect-square w-full"
                      >
                        <motion.div
                          exit={{ opacity: 0, transition: { duration: 0 } }}
                          className={clsx(
                            "pointer-events-none absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-black/20",
                            imagesToRemove.includes(image)
                              ? "bg-white"
                              : "bg-transparent"
                          )}
                        >
                          <AnimatePresence>
                            {imagesToRemove.includes(image) && (
                              <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1.1, opacity: 1 }}
                                exit={{
                                  scale: 0.9,
                                  opacity: 0,
                                  transition: { duration: 0.1 },
                                }}
                                transition={{
                                  type: "spring",
                                  duration: 0.25,
                                  bounce: 0,
                                }}
                              ></motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
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
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            alt={`${image} scene`}
                            src={getImagePath(image)}
                            height={300}
                            width={300}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      </motion.li>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl p-0">
                      <motion.img
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
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
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="w-full flex justify-center mt-4 md:mt-6 px-4"
              >
                <div className="flex gap-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
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
                    <span className="hidden sm:inline">Unselect All</span>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 whitespace-nowrap text-xs md:text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="hidden sm:inline">Report</span>
                    <span className="sm:hidden">!</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {readyToRemove ? (
          <motion.div
            initial={{ scale: 1.2, opacity: 0, filter: "blur(4px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, bounce: 0, type: "spring" }}
            className="mt-4 flex flex-col gap-2"
          >
            <button
              onClick={() => {
                if (readyToRemove) {
                  setRemoved(true);
                } else {
                  setReadyToRemove(true);
                }
              }}
              className="flex h-8 w-[200px] items-center justify-center gap-[15px] rounded-full bg-[#FF3F40] text-center text-[13px] font-semibold text-[#FFFFFF]"
            >
              Trash {imagesToRemove.length} Photos
            </button>
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
