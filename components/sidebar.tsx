"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  BookmarkPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Flag,
  Heart,
  History,
  Home,
  LogOut,
  Menu,
  MoreVertical,
  Plus,
  Tag,
  Trash,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useVideo, type Tag as TagType } from "./video-provider"
import { useAuth } from "./auth-provider"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { tags, addTag, updateTag, deleteTag } = useVideo()
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMobile = useMobile()
  const [newTagName, setNewTagName] = useState("")
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editTagName, setEditTagName] = useState("")
  const [priorityOpen, setPriorityOpen] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get collapsed state from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("latertube-sidebar-collapsed")
      return saved === "true"
    }
    return false
  })

  // Get user's display name
  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User"

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("latertube-sidebar-collapsed", isCollapsed.toString())
  }, [isCollapsed])

  const handleAddTag = (name: string) => {
    if (name.trim()) {
      addTag(name.trim())
      setNewTagName("")
      setShowTagInput(false)
    }
  }

  const handleEditTag = (tag: TagType) => {
    setEditingTag(tag.id)
    setEditTagName(tag.name)
  }

  const handleSaveTag = (id: string) => {
    if (editTagName.trim()) {
      updateTag(id, editTagName.trim())
      setEditingTag(null)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Helper function to check if a route is active
  const isRouteActive = (route: string, param?: { key: string; value: string }) => {
    if (route !== pathname) return false
    if (!param) return !searchParams.has("filter") && !searchParams.has("priority") && !searchParams.has("tag")
    return searchParams.get(param.key) === param.value
  }

  const SidebarContent = () => (
    <div
      className={cn(
        "fixed top-0 left-0 h-screen bg-[#0f0f0f] border-r border-[#272727] flex flex-col transition-all duration-300 z-20",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-[#272727] flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <BookmarkPlus className="h-6 w-6 text-red-500 flex-shrink-0" />
            <span className="truncate">LaterTube</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="mx-auto">
            <BookmarkPlus className="h-6 w-6 text-red-500" />
          </Link>
        )}
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className={isCollapsed ? "mx-auto" : ""}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="mb-4 space-y-1">
          <Link
            href="/?filter=up_next"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272727]",
              isRouteActive("/", { key: "filter", value: "up_next" }) && "bg-[#272727]",
            )}
          >
            <Eye className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Up Next</span>}
          </Link>
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272727]",
              isRouteActive("/") && "bg-[#272727]",
            )}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </Link>
          <Link
            href="/?filter=watched"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272727]",
              isRouteActive("/", { key: "filter", value: "watched" }) && "bg-[#272727]",
            )}
          >
            <History className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Watched</span>}
          </Link>
          <Link
            href="/?filter=not_interested"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272727]",
              isRouteActive("/", { key: "filter", value: "not_interested" }) && "bg-[#272727]",
            )}
          >
            <X className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Not Interested</span>}
          </Link>
        </div>

        {/* Priority Section */}
        {!isCollapsed ? (
          <Collapsible open={priorityOpen} onOpenChange={setPriorityOpen} className="mb-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#272727]">
              <div className="flex items-center gap-3">
                <Flag className="h-5 w-5 flex-shrink-0" />
                <span>Priority</span>
              </div>
              {priorityOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8 space-y-1 mt-1">
              <Link
                href="/?priority=high"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272727]",
                  isRouteActive("/", { key: "priority", value: "high" }) && "bg-[#272727]",
                )}
              >
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>High</span>
              </Link>
              <Link
                href="/?priority=medium"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272727]",
                  isRouteActive("/", { key: "priority", value: "medium" }) && "bg-[#272727]",
                )}
              >
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>Medium</span>
              </Link>
              <Link
                href="/?priority=low"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272727]",
                  isRouteActive("/", { key: "priority", value: "low" }) && "bg-[#272727]",
                )}
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Low</span>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link href="/?priority=high" className="flex justify-center px-3 py-2 rounded-lg hover:bg-[#272727]">
            <Flag className="h-5 w-5" />
          </Link>
        )}

        {!isCollapsed && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-sm font-medium text-gray-400">TAGS</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowTagInput(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* New tag input that appears when + is clicked */}
            {showTagInput && (
              <div className="px-3 py-2">
                <Input
                  placeholder="Add new tag"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (newTagName.trim()) {
                        handleAddTag(newTagName)
                      }
                    } else if (e.key === "Escape") {
                      setShowTagInput(false)
                      setNewTagName("")
                    }
                  }}
                  onBlur={() => {
                    if (newTagName.trim()) {
                      handleAddTag(newTagName)
                    } else {
                      setShowTagInput(false)
                    }
                  }}
                  className="h-7 text-white bg-[#272727] border-none"
                  autoFocus
                />
              </div>
            )}

            <div className="space-y-1">
              {tags.map((tag) => (
                <div key={tag.id} className="group relative">
                  {editingTag === tag.id ? (
                    <div className="flex items-center px-3 py-2">
                      <Input
                        value={editTagName}
                        onChange={(e) => setEditTagName(e.target.value)}
                        className="h-7 text-white bg-[#272727] border-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            if (editTagName.trim()) {
                              handleSaveTag(tag.id)
                            }
                          } else if (e.key === "Escape") {
                            setEditingTag(null)
                          }
                        }}
                        onBlur={() => {
                          if (editTagName.trim()) {
                            handleSaveTag(tag.id)
                          } else {
                            setEditingTag(null)
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <Link
                      href={`/?tag=${tag.id}`}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272727] w-full",
                        isRouteActive("/", { key: "tag", value: tag.id }) && "bg-[#272727]",
                      )}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        handleEditTag(tag)
                      }}
                    >
                      <Tag className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm truncate">{tag.name}</span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 ml-auto opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTag(tag)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={() => deleteTag(tag.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mt-6 flex justify-center">
            <Link href="/?tag=all" className="px-3 py-2 rounded-lg hover:bg-[#272727]">
              <Tag className="h-5 w-5" />
            </Link>
          </div>
        )}
      </nav>

      <div className={cn("p-4 border-t border-[#272727]", isCollapsed && "text-center")}>
        {!isCollapsed ? (
          <>
            <div className="flex flex-col">
              <div className="font-medium">Hi, {displayName} 👋</div>
              <div className="text-xs text-gray-400 mt-1">{user?.email}</div>
              <div className="mt-4 text-xs text-gray-400 flex items-center justify-between">
                <div className="flex items-center whitespace-nowrap">
                  Made with <Heart className="h-3 w-3 mx-1" /> by{" "}
                  <a
                    href="https://solo.to/tparsana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline ml-1"
                  >
                    Tanish Parsana
                  </a>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={handleLogout} className="mx-auto">
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  // Mobile sidebar with sheet
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-10 bg-[#0f0f0f] border-b border-[#272727] p-4 flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-[#0f0f0f] w-[280px]">
              <div className="w-full h-full">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <BookmarkPlus className="h-6 w-6 text-red-500" />
            <span>LaterTube</span>
          </Link>
        </div>
        <div className="h-16"></div> {/* Spacer for fixed header */}
      </>
    )
  }

  // Desktop sidebar
  return (
    <>
      <SidebarContent />
      <div className={cn("ml-64", isCollapsed && "ml-16")}></div>
    </>
  )
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
