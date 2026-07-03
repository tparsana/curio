import { NextResponse } from "next/server"

// YouTube API key is only used on the server. Keep the public name as a fallback for existing setups.
const API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ""

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

const getThumbnail = (thumbnails: any = {}) =>
  thumbnails.maxres?.url ||
  thumbnails.standard?.url ||
  thumbnails.high?.url ||
  thumbnails.medium?.url ||
  thumbnails.default?.url ||
  "/placeholder.svg"

const extractPlaylistId = (query: string) => {
  try {
    const url = new URL(query)
    const list = url.searchParams.get("list")
    if (list) return list
  } catch {
    // Raw ids and partially pasted URLs are handled below.
  }

  const listMatch = query.match(/[?&]list=([^&]+)/)
  if (listMatch?.[1]) return listMatch[1]

  const rawPlaylistId = query.trim()
  return /^(PL|UU|LL|RD|OLAK5uy_)[A-Za-z0-9_-]+$/.test(rawPlaylistId) ? rawPlaylistId : null
}

async function fetchPlaylist(playlistId: string) {
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${encodeURIComponent(
    playlistId,
  )}&key=${API_KEY}`

  const playlistResponse = await fetch(playlistUrl)
  if (!playlistResponse.ok) {
    const errorData = await playlistResponse.json().catch(() => ({}))
    throw new Error(errorData.error?.message || playlistResponse.statusText)
  }

  const playlistData = await playlistResponse.json()
  const playlist = playlistData.items?.[0]
  if (!playlist) {
    return NextResponse.json({ error: "Playlist not found" }, { status: 404 })
  }

  const videos = []
  let nextPageToken = ""

  do {
    const playlistItemsUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems")
    playlistItemsUrl.searchParams.set("part", "snippet,contentDetails")
    playlistItemsUrl.searchParams.set("playlistId", playlistId)
    playlistItemsUrl.searchParams.set("maxResults", "50")
    playlistItemsUrl.searchParams.set("key", API_KEY)
    if (nextPageToken) {
      playlistItemsUrl.searchParams.set("pageToken", nextPageToken)
    }

    const playlistItemsResponse = await fetch(playlistItemsUrl.toString())
    if (!playlistItemsResponse.ok) {
      const errorData = await playlistItemsResponse.json().catch(() => ({}))
      throw new Error(errorData.error?.message || playlistItemsResponse.statusText)
    }

    const playlistItemsData = await playlistItemsResponse.json()
    videos.push(
      ...playlistItemsData.items
        .filter((item: any) => item.contentDetails?.videoId && item.snippet?.title !== "Deleted video")
        .map((item: any) => ({
          youtube_id: item.contentDetails.videoId,
          title: item.snippet.title,
          channel_title: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle || "",
          thumbnail: getThumbnail(item.snippet.thumbnails),
          position: item.snippet.position ?? videos.length,
        })),
    )

    nextPageToken = playlistItemsData.nextPageToken || ""
  } while (nextPageToken)

  return NextResponse.json({
    resultType: "playlist",
    playlist: {
      youtube_playlist_id: playlistId,
      title: playlist.snippet.title,
      channel_title: playlist.snippet.channelTitle || "",
      thumbnail: getThumbnail(playlist.snippet.thumbnails),
      video_count: playlist.contentDetails?.itemCount ?? videos.length,
      videos,
    },
    nextPageToken: "",
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const pageToken = searchParams.get("pageToken") || ""

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  const playlistId = extractPlaylistId(query)

  if (playlistId) {
    if (!API_KEY) {
      return NextResponse.json(
        {
          resultType: "playlist_error",
          error: "A YouTube API key is required to load playlist videos. Add YOUTUBE_API_KEY to .env.local.",
        },
        { status: 503 },
      )
    }

    try {
      return await fetchPlaylist(playlistId)
    } catch (error) {
      console.error("Error fetching YouTube playlist:", error)
      return NextResponse.json(
        {
          resultType: "playlist_error",
          error: error instanceof Error ? error.message : "Failed to load playlist",
        },
        { status: 502 },
      )
    }
  }

  // Keep the previous behavior for normal search when no API key is configured.
  if (!API_KEY) {
    console.warn("Using mock data for YouTube search. No API key provided.")

    // Filter mock results based on query for a more realistic experience
    const filteredResults = MOCK_SEARCH_RESULTS.filter(
      (item) =>
        item.snippet.title.toLowerCase().includes(query.toLowerCase()) ||
        item.snippet.channelTitle.toLowerCase().includes(query.toLowerCase()),
    )

    return NextResponse.json({
      resultType: "videos",
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
          resultType: "videos",
          items: MOCK_SEARCH_RESULTS,
          nextPageToken: "",
        })
      }

      throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    // Format the response to include only what we need
    const formattedResults = {
      resultType: "videos",
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
      resultType: "videos",
      items: MOCK_SEARCH_RESULTS,
      nextPageToken: "",
    })
  }
}
