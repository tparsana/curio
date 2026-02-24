import { NextResponse } from "next/server"

// YouTube API key is only used on the server
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ""

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
  }

  try {
    // If no API key is provided, return mock data
    if (!API_KEY) {
      console.warn("No YouTube API key provided. Using mock data.")
      return NextResponse.json({
        title: `YouTube Video Title for ${videoId}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        channelTitle: "Channel Name",
        duration: "PT10M30S", // 10 minutes 30 seconds in ISO 8601 format
      })
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found")
    }

    const videoDetails = data.items[0].snippet
    const contentDetails = data.items[0].contentDetails

    return NextResponse.json({
      title: videoDetails.title,
      channelTitle: videoDetails.channelTitle,
      duration: contentDetails.duration,
      thumbnail:
        videoDetails.thumbnails.maxres?.url ||
        videoDetails.thumbnails.high?.url ||
        videoDetails.thumbnails.medium?.url ||
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    })
  } catch (error) {
    console.error("Error fetching YouTube video details:", error)
    // Fallback to default values
    return NextResponse.json({
      title: `YouTube Video Title for ${videoId}`,
      channelTitle: "Channel Name",
      duration: "PT10M30S", // 10 minutes 30 seconds in ISO 8601 format
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    })
  }
}
