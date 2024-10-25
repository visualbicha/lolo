import { toast } from 'react-toastify';

const CLOUDFLARE_ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;

export class CloudflareService {
  static async uploadVideo(file, onProgress) {
    try {
      // Get one-time upload URL
      const uploadURL = await this.getUploadUrl();
      
      // Create FormData with the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload the video
      const response = await fetch(uploadURL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
      throw error;
    }
  }

  static async getUploadUrl() {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            maxDurationSeconds: 3600,
            allowedOrigins: [window.location.origin],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const data = await response.json();
      return data.result.uploadURL;
    } catch (error) {
      console.error('Get upload URL error:', error);
      toast.error('Failed to initialize upload');
      throw error;
    }
  }

  static async getVideoDetails(videoId) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${videoId}`,
        {
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get video details');
      }

      const data = await response.json();
      return {
        id: data.result.uid,
        playbackUrl: data.result.playback.hls,
        thumbnail: data.result.thumbnail,
        duration: data.result.duration,
        status: data.result.status.state,
        readyToStream: data.result.readyToStream,
      };
    } catch (error) {
      console.error('Get video details error:', error);
      toast.error('Failed to get video details');
      throw error;
    }
  }
}