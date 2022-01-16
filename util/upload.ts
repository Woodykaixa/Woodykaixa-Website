export function getBase64(img: Blob) {
  return new Promise<string>(res => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      res(reader.result as string);
    });
    reader.readAsDataURL(img);
  });
}
