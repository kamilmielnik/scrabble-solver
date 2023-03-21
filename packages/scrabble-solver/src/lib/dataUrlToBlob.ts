const dataUrlToBlob = (dataUrl: string): Blob => {
  const [mime = '', data] = dataUrl.split(',');
  const [, type] = mime.match(/:(.*?);/) || [];

  if (typeof type !== 'string') {
    throw new Error('Unsupported data URL');
  }

  const byteString = globalThis.atob(data);
  const u8arr = new Uint8Array(byteString.length);
  let index = byteString.length;

  while (index--) {
    u8arr[index] = byteString.charCodeAt(index);
  }

  return new Blob([u8arr], { type });
};

export default dataUrlToBlob;
