import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { UploadSpinner } from "./UploadSpinner";
import { UploadFileResponse } from "./uploadFiles";
import { useUploadFiles } from "./useUploadFiles";

export function UploadButton(props: {
  /// Required props

  // Either the absolute upload URL or an async function that generates it
  uploadUrl: string | (() => Promise<string>);

  // The HTTP method to use for the upload, either `POST` or `PUT`. Defaults to `POST`.
  method?: "POST" | "PUT";

  /// Optional functionality props

  // A list of [file type specifiers]((https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept#unique_file_type_specifiers))
  fileTypes?: string[];
  // Whether the user can select multiple files to upload. Defaults to `false`
  multiple?: boolean;

  /// Optional lifecycle props

  // Called every time the combined upload progresses by at least 10 percent. `progress` % is a multiple of 10.
  onUploadProgress?: (progress: number) => void;
  // Called at the start of each upload.
  onUploadBegin?: (fileName: string) => void;
  // Called when all the files have been uploaded.
  onUploadComplete?: (uploaded: UploadFileResponse[]) => Promise<void> | void;
  // Called if there was an error at any point in the upload process.
  onUploadError?: (error: unknown) => void;

  /// Optional appearance props

  // Replaces the content shown on the button. `progress` % is a multiple of 10 if the upload is in progress or `null`.
  content?: (progress: number | null) => string;
  // Replaces the `className` of the button. `progress` % is a multiple of 10 if the upload is in progress or `null`.
  className?: (progress: number | null) => string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { startUpload, isUploading } = useUploadFiles(props.uploadUrl, {
    method: props.method,
    onUploadComplete: async (res) => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await props.onUploadComplete?.(res);
      setUploadProgress(0);
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
      props.onUploadProgress?.(p);
    },
    onUploadError: props.onUploadError,
    onUploadBegin: props.onUploadBegin,
  });

  const combinedState = isUploading ? uploadProgress : null;

  return (
    <label
      className={
        props.className?.(combinedState) ??
        twMerge(
          "relative flex h-10 w-36 cursor-pointer items-center justify-center " +
            "overflow-hidden rounded-md text-white after:transition-[width] after:duration-500 " +
            "hover:bg-blue-600/90",
          isUploading &&
            `before:absolute before:-z-20 before:w-full before:h-full before:bg-blue-400 ` +
              ` after:absolute after:-z-10 after:left-0 after:h-full after:bg-blue-600 ${progressWidths[uploadProgress]}`,
          !isUploading && "bg-blue-600"
        )
      }
    >
      <input
        className="hidden"
        type="file"
        ref={fileInputRef}
        multiple={props.multiple}
        accept={(props.fileTypes ?? [])?.join(", ")}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (!event.target.files) {
            return;
          }
          const files = Array.from(event.target.files);
          void startUpload(files);
        }}
        disabled={isUploading}
      />
      {props.content?.(combinedState) ??
        (isUploading ? (
          <UploadSpinner />
        ) : (
          `Choose File${props.multiple ? `(s)` : ``}`
        ))}
    </label>
  );
}

const progressWidths: Record<number, string> = {
  0: "after:w-0",
  10: "after:w-[10%]",
  20: "after:w-[20%]",
  30: "after:w-[30%]",
  40: "after:w-[40%]",
  50: "after:w-[50%]",
  60: "after:w-[60%]",
  70: "after:w-[70%]",
  80: "after:w-[80%]",
  90: "after:w-[90%]",
  100: "after:w-[100%]",
};
