import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>uploadstuff</span>
  ),
  project: {
    link: "https://github.com/xixixao/uploadstuff",
  },
  chat: {
    link: "https://www.convex.dev/community",
  },
  docsRepositoryBase: "https://github.com/xixixao/uploadstuff/tree/main/docs",
  gitTimestamp() {
    return <></>;
  },
  footer: {
    text: "UploadStuff © 2023 xixixao. All rights reserved.",
  },
};

export default config;
