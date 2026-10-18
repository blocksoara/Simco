/**
 * Helper utilities for media optimization and video embed URL formatting
 */

export function compressImage(
  file: File,
  maxWidth = 1400,
  maxHeightOrQuality: number = 1050,
  qualityOpt = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    // Determine effective bounds and quality
    let targetMaxWidth = maxWidth;
    let targetMaxHeight = maxHeightOrQuality;
    let targetQuality = qualityOpt;

    // Handle when caller passed (file, 1600, 0.82) -> 3rd argument is quality
    if (maxHeightOrQuality > 0 && maxHeightOrQuality <= 1) {
      targetQuality = maxHeightOrQuality;
      targetMaxHeight = targetMaxWidth;
    }

    if (!targetMaxWidth || targetMaxWidth <= 1) targetMaxWidth = 1400;
    if (!targetMaxHeight || targetMaxHeight <= 1) targetMaxHeight = 1050;
    if (!targetQuality || targetQuality <= 0 || targetQuality > 1) targetQuality = 0.8;

    const reader = new FileReader();

    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        resolve('');
        return;
      }

      const img = new Image();

      img.onload = () => {
        try {
          const origWidth = img.naturalWidth || img.width || 1200;
          const origHeight = img.naturalHeight || img.height || 900;

          let width = origWidth;
          let height = origHeight;

          // Scale down proportionally
          if (width > targetMaxWidth) {
            height = Math.round((height * targetMaxWidth) / width);
            width = targetMaxWidth;
          }
          if (height > targetMaxHeight) {
            width = Math.round((width * targetMaxHeight) / height);
            height = targetMaxHeight;
          }

          // Safety guardrails against 0 or negative dimensions
          width = Math.max(10, Math.round(width));
          height = Math.max(10, Math.round(height));

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          // Draw image onto canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Get optimized JPEG data URL
          const result = canvas.toDataURL('image/jpeg', targetQuality);

          // Sanity check: must be a valid data URL with actual payload
          if (result && result.startsWith('data:image/') && result.length > 200) {
            resolve(result);
          } else {
            resolve(rawDataUrl);
          }
        } catch (canvasErr) {
          console.warn('Canvas processing error, falling back to raw data URL:', canvasErr);
          resolve(rawDataUrl);
        }
      };

      img.onerror = () => {
        // Fallback to raw data URL
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
}


export function formatVideoEmbedUrl(url: string): { type: 'youtube' | 'vimeo' | 'direct'; embedUrl: string } | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // YouTube match: youtube.com/watch?v=ID or youtu.be/ID or youtube.com/shorts/ID
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
    };
  }

  // Vimeo match: vimeo.com/ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
    };
  }

  // Direct video or data URL / blob
  return {
    type: 'direct',
    embedUrl: trimmed,
  };
}
