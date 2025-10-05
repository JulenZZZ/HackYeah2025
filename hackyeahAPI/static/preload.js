function preloadWithCallback(urls, allImagesLoadedCallback) {
  let loadedCounter = 0;
  const numImages = urls.length;

  urls.forEach(url => {
    const img = new Image();
    img.src = url;
    
    img.onload = () => {
      loadedCounter++;
      if (loadedCounter === numImages) {
        // All images have finished loading
        allImagesLoadedCallback();
      }
    };
    
    img.onerror = () => {
      console.error(`Failed to load image at ${url}`);
      loadedCounter++; // Count errors too so the callback eventually fires
      if (loadedCounter === numImages) {
        allImagesLoadedCallback();
      }
    };
  });
}

const imagesToPreload = [
  '/static/images/girl1.webp',
  '/static/images/girl2.webp',
  '/static/images/girl3.webp',
  '/static/images/girl4.webp',
  '/static/images/boy1.webp',
  '/static/images/boy2.webp',
  '/static/images/boy3.webp',
  '/static/images/boy4.webp',
];

preloadWithCallback(imagesToPreload, () => {
  console.log('All images are preloaded and ready!');
});