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
      const fadeOutTimer = setTimeout(() => setFadeOut(true), 1000);
      const resetTimer = setTimeout(() => {
        setSelectedPhotos([]);
        setReadyToDelete(false);
        setIsDeleted(false);
        setFadeOut(false);
      }, 1500);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [isDeleted]);

  const handleDelete = () => {
    if (readyToDelete) {
      setIsDeleted(true);
    } else {
      setReadyToDelete(true);
    }
  };

  return (
    <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
      <motion.div
        initial={false}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        className="relative min-h-[600px] w-full max-w-3xl mx-auto p-6 flex flex-col items-center justify-center"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnimatePresence>
            {!readyToDelete &&
              photosToShow.map((photo) => {
                const isSelected = selectedPhotos.includes(photo.id);

                return (
                  <motion.div
                    key={photo.id}
                    exit={
                      isSelected
                        ? {}
                        : {
                            opacity: 0,
                            scale: 0.8,
                            transition: { duration: 0.2 },
                          }
                    }
                    className="relative group"
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
                      <Image
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
                      onClick={handleDelete}
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2"
          >
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Delete {selectedPhotos.length} Photos
            </button>
          </motion.div>
        )}

        {readyToDelete && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="relative w-32 h-32">
              <motion.div
                animate={{
                  y: isDeleted ? 60 : 0,
                  scale: isDeleted ? 0.8 : 1,
                  opacity: isDeleted ? 0 : 1,
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-2"
              >
                {selectedPhotos.map((id, index) => (
                  <MotionImage
                    key={id}
                    src={`/images/photo-stack-${id}.png`}
                    width={100}
                    height={100}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover"
                    style={{
                      rotate: `${index % 2 === 0 ? 5 : -5}deg`,
                      y: -index * 4,
                    }}
                  />
                ))}
              </motion.div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24">
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full text-gray-300"
                >
                  <path
                    fill="currentColor"
                    d="M3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6H3zm4.5 12H6v-1.5h1.5V18zm0-3.5H6V13h1.5v1.5zm0-3.5H6V9.5h1.5V11zm3.5 7h-1.5v-1.5H12V18zm0-3.5h-1.5V13H12v1.5zm0-3.5h-1.5V9.5H12V11zm3.5 7h-1.5v-1.5h1.5V18zm0-3.5h-1.5V13h1.5v1.5zm0-3.5h-1.5V9.5h1.5V11z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </MotionConfig>
  );
};

export default PhotoStack;
