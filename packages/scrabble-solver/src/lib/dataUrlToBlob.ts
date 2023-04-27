const dataUrlToBlob = (dataUrl: string): Blob => {
  const [mime = '', data] = dataUrl.split(',');
  const matches = mime.match(/:(?<type>.*?);/u);

  if (matches === null || typeof matches.groups?.type !== 'string') {
    throw new Error('Unsupported data URL');
  }

  const type = matches.groups.type;
  const byteString = globalThis.atob(data);
  const bytes = new Uint8Array(byteString.length);
  let index = byteString.length;

  while (index--) {
    bytes[index] = byteString.charCodeAt(index);
  }

  return new Blob([bytes], { type });
};

export default dataUrlToBlob;
