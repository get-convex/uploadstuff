export type UploadFileResponse = {
  name: string;
  type: string;
  size: number;
  response: unknown;
};

export const uploadFiles = async (args: {
  url: string;
  files: File[];
  method?: "POST" | "PUT";
  onUploadBegin?: ({ file }: { file: string }) => void;
  onUploadProgress?: ({
    file,
    progress,
  }: {
    file: string;
    progress: number;
  }) => void;
}): Promise<UploadFileResponse[]> => {
  return Promise.all(
    args.files.map(async (file: File) => {
      const response = await fetchWithProgress(
        args.url,
        {
          method: args.method ?? "POST",
          body: file,
          headers: new Headers({
            "Content-Type": getMimeType(file),
          }),
        },
        (progressEvent) =>
          args.onUploadProgress?.({
            file: file.name,
            progress: (progressEvent.loaded / progressEvent.total) * 100,
          }),
        () => {
          args.onUploadBegin?.({
            file: file.name,
          });
        }
      );

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        response,
      };
    })
  );
};

function fetchWithProgress(
  url: string,
  opts: {
    headers?: Headers;
    method?: string;
    body?: File;
  } = {},
  onProgress?: (this: XMLHttpRequest, progress: ProgressEvent) => void,
  onUploadBegin?: (this: XMLHttpRequest, progress: ProgressEvent) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open(opts.method ?? "get", url);
    opts.headers &&
      Object.keys(opts.headers).forEach(
        (h) =>
          opts.headers && xhr.setRequestHeader(h, opts.headers.get(h) ?? "")
      );
    xhr.onload = () => {
      resolve(xhr.response);
    };

    xhr.onerror = reject;
    if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress;
    if (xhr.upload && onUploadBegin) xhr.upload.onloadstart = onUploadBegin;
    xhr.send(opts.body);
  });
}

function getMimeType(file: File) {
  if (file.type === "blob") {
    return "application/octet-stream";
  } else if (file.type === "pdf") {
    return "application/pdf";
  } else {
    return file.type;
  }
}
