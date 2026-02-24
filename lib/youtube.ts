// Client-side YouTube API integration that calls our server API route
// No API key is used on the client side

export async function fetchYouTubeVideoDetails(videoId: string) {
  try {
    const response = await fetch(`/api/youtube?videoId=${videoId}`)

    if (!response.ok) {
      throw new Error(`Error fetching video details: ${response.status}`)
    }

    const data = await response.json()
    return {
      title: data.title,
      thumbnail: data.thumbnail,
    }
  } catch (error) {
    console.error("Error fetching YouTube video details:", error)
    // Fallback to default values
    return {
      title: `YouTube Video Title for ${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    }
  }
}
