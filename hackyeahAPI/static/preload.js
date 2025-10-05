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
  '/mediafiles/girl1.png',
  '/mediafiles/girl2.png',
  '/mediafiles/girl3.png',
  '/mediafiles/girl4.png',
  '/mediafiles/boy1.png',
  '/mediafiles/boy2.png',
  '/mediafiles/boy3.png',
  '/mediafiles/boy4.png',
];

preloadWithCallback(imagesToPreload, () => {
  console.log('All images are preloaded and ready!');
});