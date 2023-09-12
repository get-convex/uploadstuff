await extractComponent("UploadButton");
await extractComponent("UploadDropzone");

async function extractComponent(name: string) {
  const file = Bun.file(`../lib/${name}.tsx`);

  const text = await file.text();

  const typeSignaturePattern = `${name}${/\(\w+: {\n([\s\S]+?)\n}/.source}`;

  const typeSignature = text.match(typeSignaturePattern)?.[1];

  const pattern =
    /(?:(?:^|\n)\s+\/\/ (?<comment>[^\n]+))?(?:^|\n)\s+(?<name>\w+)(?<optional>\?)?: (?<type>[^;]+);/g;

  const types = Array.from(typeSignature?.matchAll(pattern) ?? []);

  const printed =
    "| Prop | Required | Type | Description |\n" +
    "| --- | --- | --- | --- |\n" +
    types
      .map(
        ({ groups }) =>
          `| ${groups!.name} | ${
            groups!.optional ? "No" : "Yes"
          } | ${groups!.type
            .replace(/\|/g, "&#124;")
            .replace(/</g, "&lt;")} | ${groups!.comment ?? ""} |`
      )
      .join("\n");

  Bun.write(`api/${name}.mdx`, printed);
}
