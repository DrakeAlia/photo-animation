"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, ArrowLeft, Download } from "lucide-react";
import Image from "next/image";
import { PhotoBack, PhotoFront } from "./photo-trash";

const MotionImage = motion(Image);

const PHOTOS = [
  { id: "beach", title: "Sunny Beach", category: "Nature" },
  { id: "camp", title: "Mountain Camp", category: "Adventure" },
  { id: "city", title: "Downtown", category: "Urban" },
  { id: "snow", title: "Winter Scene", category: "Nature" },
];

const PhotoStack = () => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [readyToDelete, setReadyToDelete] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const photosToShow = readyToDelete
    ? PHOTOS.filter((photo) => !selectedPhotos.includes(photo.id))
    : PHOTOS;

  useEffect(() => {
    if (isDeleted) {
      setTimeout(() => setFadeOut(true), 1000);
      setTimeout(() => {
        setSelectedPhotos([]);
        setReadyToDelete(false);
        setIsDeleted(false);
      }, 1200);
      setTimeout(() => {
        setFadeOut(false);
      }, 1700);
    }
  }, [isDeleted]);

  return (
    <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
      <motion.div
        initial={false}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        className="relative min-h-[600px] w-full max-w-3xl mx-auto p-6 flex flex-col items-center justify-center"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnimatePresence mode="popLayout">
            {!readyToDelete &&
              photosToShow.map((photo) => {
                const isSelected = selectedPhotos.includes(photo.id);

                return (
                  <motion.div
                    key={photo.id}
                    layout
                    exit={
                      isSelected
                        ? {}
                        : {
                            opacity: 0,
                            filter: "blur(4px)",
                            transition: { duration: 0.17 },
                          }
                    }
                    className="relative flex h-[100px] w-[100px]"
                  >
                    <motion.div
                      className={`absolute right-2 top-2 z-10 w-6 h-6 rounded-full border-2 
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-white bg-black/20"
                      }
                      transition-colors duration-200`}
                    >
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full h-full text-white p-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      )}
                    </motion.div>

                    <motion.button
                      onClick={() => {
                        setSelectedPhotos((prev) =>
                          isSelected
                            ? prev.filter((id) => id !== photo.id)
                            : [...prev, photo.id]
                        );
                      }}
                      className="w-full aspect-square rounded-xl overflow-hidden relative group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MotionImage
                        layoutId={`photo-${photo.id}`}
                        src={`/images/photo-stack-${photo.id}.png`}
                        width={400}
                        height={400}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                      >
                        <div className="p-3 text-white">
                          <h3 className="font-semibold">{photo.title}</h3>
                          <p className="text-sm text-gray-200">
                            {photo.category}
                          </p>
                        </div>
                      </motion.div>
                    </motion.button>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {readyToDelete && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="relative w-32 h-40">
                {/* Trash Back and Front should share the same container */}
                <div className="absolute inset-0">
                  <motion.div
                    initial={{ scale: 1.2, filter: "blur(4px)", opacity: 0 }}
                    animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                    exit={{ scale: 1.2, filter: "blur(4px)", opacity: 0 }}
                  >
                    <PhotoBack />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.175, duration: 0 }}
                    className="absolute inset-0"
                  >
                    <PhotoFront />
                  </motion.div>
                </div>

                {/* Photos to delete */}
                <motion.div
                  animate={{
                    y: isDeleted ? 110 : 73,
                    scale: isDeleted ? 0.7 : 1,
                    filter: isDeleted ? "blur(4px)" : "blur(0px)",
                  }}
                  transition={
                    isDeleted
                      ? { duration: 0.3, type: "spring", bounce: 0 }
                      : { delay: 0.13 }
                  }
                  className="absolute flex w-full top-[-60px] flex-col-reverse items-center"
                  style={{ zIndex: 10 }} // Ensure photos are between back and front
                >
                  {selectedPhotos.map((id, index) => (
                    <motion.div
                      key={id}
                      className="flex h-1 items-center gap-2"
                    >
                      <MotionImage
                        layoutId={`photo-${id}`}
                        src={`/images/photo-stack-${id}.png`}
                        width={65}
                        height={65}
                        alt=""
                        className="rounded-lg"
                        style={{
                          rotate: `${
                            index % 2 === 0
                              ? 4 * (selectedPhotos.length - index + 1)
                              : -1 * (selectedPhotos.length - index + 1) * 4
                          }deg`,
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Bottom action buttons */}
        <AnimatePresence>
          {selectedPhotos.length > 0 && !readyToDelete && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-white rounded-full shadow-lg p-1"
            >
              <button
                onClick={() => setSelectedPhotos([])}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Cancel</span>
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-red-50 text-red-600">
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete {selectedPhotos.length} photos?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. These photos will be
                      permanently deleted from your collection.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setReadyToDelete(true);
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {readyToDelete && (
          <motion.div
            initial={{ scale: 1.2, opacity: 0, filter: "blur(4px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, bounce: 0, type: "spring" }}
            className="absolute bottom-10 flex flex-col gap-2"
          >
            <button
              onClick={() => setIsDeleted(true)}
              className="flex h-8 w-[200px] items-center justify-center gap-[15px] rounded-full bg-[#FF3F40] text-center text-[13px] font-semibold text-[#FFFFFF]"
            >
              Trash {selectedPhotos.length} Photos
            </button>
          </motion.div>
        )}
      </motion.div>
    </MotionConfig>
  );
};

export default PhotoStack;
