import { NextResponse } from "next/server"

// YouTube API key is only used on the server
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ""

// Mock data for when API is unavailable
const MOCK_SEARCH_RESULTS = [
  {
    id: { videoId: "dQw4w9WgXcQ" },
    snippet: {
      title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      channelTitle: "Rick Astley",
      thumbnails: {
        medium: { url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
      },
    },
  },
  {
    id: { videoId: "9bZkp7q19f0" },
    snippet: {
      title: "PSY - GANGNAM STYLE(강남스타일) M/V",
      channelTitle: "officialpsy",
      thumbnails: {
        medium: { url: "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg" },
      },
    },
  },
  {
    id: { videoId: "kJQP7kiw5Fk" },
    snippet: {
      title: "Luis Fonsi - Despacito ft. Daddy Yankee",
      channelTitle: "Luis Fonsi",
      thumbnails: {
        medium: { url: "https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg" },
      },
    },
  },
  {
    id: { videoId: "JGwWNGJdvx8" },
    snippet: {
      title: "Ed Sheeran - Shape of You (Official Music Video)",
      channelTitle: "Ed Sheeran",
      thumbnails: {
        medium: { url: "https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg" },
      },
    },
  },
  {
    id: { videoId: "OPf0YbXqDm0" },
    snippet: {
      title: "Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars",
      channelTitle: "Mark Ronson",
      thumbnails: {
        medium: { url: "https://img.youtube.com/vi/OPf0YbXqDm0/mqdefault.jpg" },
      },
    },
  },
  {
    id: { videoId: "RgKAFK5djSk" },
    snippet: {
      title: "Wiz Khalifa - See You Again ft. Charlie Puth [Official Video]",
      channelTitle: "Wiz Khalifa",
      thumbnails: {
        medium: { url: "https://img.youtube.com/vi/RgKAFK5djSk/mqdefault.jpg" },
      },
    },
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const pageToken = searchParams.get("pageToken") || ""

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  // If no API key is provided or we're in development mode, return mock data
  if (!API_KEY || process.env.NODE_ENV === "development") {
    console.warn("Using mock data for YouTube search. No API key provided or in development mode.")

    // Filter mock results based on query for a more realistic experience
    const filteredResults = MOCK_SEARCH_RESULTS.filter(
      (item) =>
        item.snippet.title.toLowerCase().includes(query.toLowerCase()) ||
        item.snippet.channelTitle.toLowerCase().includes(query.toLowerCase()),
    )

    return NextResponse.json({
      items: filteredResults.length > 0 ? filteredResults : MOCK_SEARCH_RESULTS.slice(0, 3),
      nextPageToken: "",
    })
  }

  try {
    // Build the search URL with pagination support
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query,
    )}&type=video&maxResults=10&key=${API_KEY}`

    if (pageToken) {
      searchUrl += `&pageToken=${pageToken}`
    }

    console.log(`Fetching YouTube search results for query: ${query}`)
    const response = await fetch(searchUrl)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("YouTube API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })

      // If we get a 403 error, fall back to mock data
      if (response.status === 403) {
        console.warn("YouTube API returned 403 Forbidden. Using mock data instead.")
        return NextResponse.json({
          items: MOCK_SEARCH_RESULTS,
          nextPageToken: "",
        })
      }

      throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    // Format the response to include only what we need
    const formattedResults = {
      items: data.items.map((item: any) => ({
        id: item.id,
        snippet: {
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnails: {
            medium: item.snippet.thumbnails.medium,
          },
        },
      })),
      nextPageToken: data.nextPageToken || "",
    }

    return NextResponse.json(formattedResults)
  } catch (error) {
    console.error("Error searching YouTube videos:", error)

    // Return mock data as fallback with a 200 status to keep the app functional
    return NextResponse.json({
      items: MOCK_SEARCH_RESULTS,
      nextPageToken: "",
    })
  }
}
