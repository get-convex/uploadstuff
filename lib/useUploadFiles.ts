import { useRef, useState } from "react";
import { useEvent } from "./useEvent";
import { UploadFileResponse, uploadFiles } from "./uploadFiles";

export const useUploadFiles = (
  uploadUrl: string | (() => Promise<string>),
  opts?: {
    method?: "POST" | "PUT";
    onUploadComplete?: (res: UploadFileResponse[]) => Promise<void>;
    onUploadProgress?: (p: number) => void;
    onUploadError?: (e: unknown) => void;
    onUploadBegin?: (fileName: string) => void;
  }
): {
  startUpload: (files: File[]) => Promise<UploadFileResponse[]>;
  isUploading: boolean;
} => {
  const [isUploading, setUploading] = useState(false);
  const uploadProgress = useRef(0);
  const fileProgress = useRef<Map<string, number>>(new Map());

  const startUpload = useEvent(async (files: File[]) => {
    setUploading(true);

    try {
      const url = typeof uploadUrl === "string" ? uploadUrl : await uploadUrl();
      const res = await uploadFiles({
        files,
        url,
        method: opts?.method,
        onUploadProgress: ({ file, progress }) => {
          if (opts?.onUploadProgress == null) {
            return;
          }
          fileProgress.current.set(file, progress);
          let sum = 0;
          fileProgress.current.forEach((singleFileProgress) => {
            sum += singleFileProgress;
          });
          const averageProgress =
            Math.floor(sum / fileProgress.current.size / 10) * 10;
          if (averageProgress !== uploadProgress.current) {
            opts?.onUploadProgress?.(averageProgress);
            uploadProgress.current = averageProgress;
          }
        },
        onUploadBegin({ file }) {
          opts?.onUploadBegin?.(file);
        },
      });

      await opts?.onUploadComplete?.(res);
      return res;
    } catch (error) {
      opts?.onUploadError?.(error);
      return [];
    } finally {
      setUploading(false);
      fileProgress.current = new Map();
      uploadProgress.current = 0;
    }
  });

  return {
    startUpload,
    isUploading,
  };
};
