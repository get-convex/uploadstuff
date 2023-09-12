import { Fragment, useState } from "react";
import "./App.css";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  UploadButton,
  UploadDropzone,
  UploadFileResponse,
} from "uploadstuff/react";
import "uploadstuff/react/styles.css";

export default function App() {
  const [name, setName] = useState<string>("");
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const attachUploaded = useMutation(api.files.attachUploaded);
  const attachToName = async (uploaded: UploadFileResponse[]) => {
    attachUploaded({
      name,
      uploaded: uploaded.map(({ type, response }) => ({
        type,
        storageId: (response as { storageId: string }).storageId,
      })),
    });
  };

  return (
    <main>
      <div>
        <div>
          Pick a name to store files under:{" "}
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <UploadButton
          uploadUrl={() => generateUploadUrl({ name })}
          multiple={true}
          onUploadComplete={attachToName}
          onUploadError={console.error}
        />
        Or
        <UploadDropzone
          uploadUrl={() => generateUploadUrl({ name })}
          multiple={true}
          onUploadComplete={attachToName}
          onUploadError={console.error}
        />
      </div>
      <div>
        <Display name={name} />
      </div>
    </main>
  );
}

function Display({ name }: { name: string }) {
  const uploaded = useQuery(api.files.getUrl, { name });
  if (uploaded == null) {
    return null;
  }
  return uploaded.files.map(({ url, type }) => (
    <Fragment key={url}>
      {type.startsWith("image") ? (
        <div className="img">
          <img src={url!} />
        </div>
      ) : (
        <a href={url!}>Download</a>
      )}
    </Fragment>
  ));
}
