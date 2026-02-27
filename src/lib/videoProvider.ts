// src/lib/videoProvider.ts

/**
 * Abstraction layer for different external video providers (Cloudflare Stream, Mux, Vimeo).
 * This allows easy swapping of providers without changing the UI code.
 * 
 * In a real-world scenario, you would implement the logic for securing playback
 * (like signed URLs or tokens) inside these methods.
 */

export type VideoProviderType = "CLOUDFLARE" | "MUX" | "VIMEO" | "MOCK"

interface VideoInfo {
    id: string
    provider: VideoProviderType
    thumbnailUrl: string
    playbackUrl: string
    iframeUrl: string
}

export const activeVideoProvider: VideoProviderType = process.env.NEXT_PUBLIC_VIDEO_PROVIDER as VideoProviderType || "MOCK"

export async function getVideoDetails(videoId: string, provider: VideoProviderType = activeVideoProvider): Promise<VideoInfo> {
    // MOCK implementation for development
    if (provider === "MOCK" || !process.env.NEXT_PUBLIC_VIDEO_PROVIDER) {
        return {
            id: videoId,
            provider: "MOCK",
            thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
            playbackUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            iframeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Example mock iframe
        }
    }

    // Example Cloudflare Stream Implementation
    if (provider === "CLOUDFLARE") {
        const cfDomain = process.env.NEXT_PUBLIC_CF_STREAM_DOMAIN || "customer-xxx.cloudflarestream.com"
        return {
            id: videoId,
            provider: "CLOUDFLARE",
            thumbnailUrl: `https://${cfDomain}/${videoId}/thumbnails/thumbnail.jpg`,
            playbackUrl: `https://${cfDomain}/${videoId}/manifest/video.m3u8`,
            iframeUrl: `https://${cfDomain}/${videoId}/iframe`
        }
    }

    // Example MUX Implementation
    if (provider === "MUX") {
        return {
            id: videoId,
            provider: "MUX",
            thumbnailUrl: `https://image.mux.com/${videoId}/thumbnail.jpg`,
            playbackUrl: `https://stream.mux.com/${videoId}.m3u8`,
            iframeUrl: "" // MUX usually uses a custom player like @mux/mux-player-react
        }
    }

    // Example VIMEO Implementation
    if (provider === "VIMEO") {
        return {
            id: videoId,
            provider: "VIMEO",
            thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`,
            playbackUrl: "", // Usually relies on iframe
            iframeUrl: `https://player.vimeo.com/video/${videoId}`
        }
    }

    throw new Error(`Unsupported video provider: ${provider}`)
}
