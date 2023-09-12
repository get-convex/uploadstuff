import { useState } from "react";
import { useUploadFiles } from "uploadstuff/react";

export function UseUploadFilesExample() {
  const { startUpload } = useUploadFiles(
    "https://wry-bird-327.convex.site/dontStoreImage"
  );
  const [uploaded, setUploaded] = useState("Not uploaded anything yet");
  return (
    <div>
      <div>
        <input
          type="file"
          multiple
          onChange={async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) {
              return;
            }
            await startUpload(files);
            setUploaded(
              "✓ Uploaded " + files.map((file) => file.name).join(", ")
            );
          }}
        />
      </div>
      {uploaded}
    </div>
  );
}
