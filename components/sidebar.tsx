"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Flag,
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
import { CurioLogo } from "@/components/branding/CurioLogo"

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
  const appRoute = "/app"
  const sidebarKey = "curio-sidebar-collapsed"
  const legacySidebarKey = "latertube-sidebar-collapsed"
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(sidebarKey) ?? localStorage.getItem(legacySidebarKey)
      return saved === "true"
    }
    return false
  })

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User"

  useEffect(() => {
    localStorage.setItem(sidebarKey, isCollapsed.toString())
  }, [isCollapsed, sidebarKey])

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

  const isRouteActive = (route: string, param?: { key: string; value: string }) => {
    if (route !== pathname) return false
    if (!param) return !searchParams.has("filter") && !searchParams.has("priority") && !searchParams.has("tag")
    return searchParams.get(param.key) === param.value
  }

  const SidebarContent = () => (
    <div
      className={cn(
        "fixed top-0 left-0 h-screen bg-[#0B0B0C] border-r border-[#2A2A2D] flex flex-col transition-all duration-300 z-20",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-[#2A2A2D] flex items-center justify-between">
        {!isCollapsed ? (
          <Link href={appRoute} className="flex items-center gap-2 text-xl font-semibold">
            <CurioLogo variant="wordmark" className="text-[#EDE9E4]" />
          </Link>
        ) : (
          <Link href={appRoute} className="mx-auto">
            <CurioLogo variant="mark" className="text-lg text-[#EDE9E4]" />
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
            href={`${appRoute}?filter=up_next`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#121214]",
              isRouteActive(appRoute, { key: "filter", value: "up_next" }) && "bg-[#121214]",
            )}
          >
            <Eye className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Up Next</span>}
          </Link>
          <Link
            href={appRoute}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#121214]",
              isRouteActive(appRoute) && "bg-[#121214]",
            )}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </Link>
          <Link
            href={`${appRoute}?filter=watched`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#121214]",
              isRouteActive(appRoute, { key: "filter", value: "watched" }) && "bg-[#121214]",
            )}
          >
            <History className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Watched</span>}
          </Link>
          <Link
            href={`${appRoute}?filter=not_interested`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#121214]",
              isRouteActive(appRoute, { key: "filter", value: "not_interested" }) && "bg-[#121214]",
            )}
          >
            <X className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Not Interested</span>}
          </Link>
        </div>

        {!isCollapsed ? (
          <Collapsible open={priorityOpen} onOpenChange={setPriorityOpen} className="mb-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#121214]">
              <div className="flex items-center gap-3">
                <Flag className="h-5 w-5 flex-shrink-0" />
                <span>Priority</span>
              </div>
              {priorityOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8 space-y-1 mt-1">
              <Link
                href={`${appRoute}?priority=high`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#121214]",
                  isRouteActive(appRoute, { key: "priority", value: "high" }) && "bg-[#121214]",
                )}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>High</span>
              </Link>
              <Link
                href={`${appRoute}?priority=medium`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#121214]",
                  isRouteActive(appRoute, { key: "priority", value: "medium" }) && "bg-[#121214]",
                )}
              >
                <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                <span>Medium</span>
              </Link>
              <Link
                href={`${appRoute}?priority=low`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#121214]",
                  isRouteActive(appRoute, { key: "priority", value: "low" }) && "bg-[#121214]",
                )}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Low</span>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link href={`${appRoute}?priority=high`} className="flex justify-center px-3 py-2 rounded-lg hover:bg-[#121214]">
            <Flag className="h-5 w-5" />
          </Link>
        )}

        {!isCollapsed && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-sm font-medium text-[#EDE9E4]/60">TAGS</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowTagInput(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

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
                  className="h-7 text-[#EDE9E4] bg-[#121214] border-[#2A2A2D]"
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
                        className="h-7 text-[#EDE9E4] bg-[#121214] border-[#2A2A2D]"
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
                      href={`${appRoute}?tag=${tag.id}`}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#121214] w-full",
                        isRouteActive(appRoute, { key: "tag", value: tag.id }) && "bg-[#121214]",
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
            <Link href={`${appRoute}?tag=all`} className="px-3 py-2 rounded-lg hover:bg-[#121214]">
              <Tag className="h-5 w-5" />
            </Link>
          </div>
        )}
      </nav>

      <div className={cn("p-4 border-t border-[#2A2A2D]", isCollapsed && "text-center")}>
        {!isCollapsed ? (
          <div className="flex flex-col">
            <div className="font-medium">Hi, {displayName}</div>
            <div className="text-xs text-[#EDE9E4]/60 mt-1">{user?.email}</div>
            <div className="mt-4 text-xs text-[#EDE9E4]/60 flex items-center justify-between gap-3">
              <div className="whitespace-nowrap">
                Created Curiously by{" "}
                <a
                  href="https://solo.to/tparsana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EDE9E4]/90 hover:text-[#EDE9E4] hover:underline ml-1"
                >
                  Tanish Parsana
                </a>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={handleLogout} className="mx-auto">
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-10 bg-[#0B0B0C] border-b border-[#2A2A2D] p-4 flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-[#0B0B0C] w-[280px] border-r border-[#2A2A2D]">
              <div className="w-full h-full">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
          <Link href={appRoute} className="flex items-center text-xl font-semibold">
            <CurioLogo variant="wordmark" className="text-[#EDE9E4]" />
          </Link>
        </div>
        <div className="h-16"></div>
      </>
    )
  }

  return (
    <>
      <SidebarContent />
      <div className={cn("ml-64", isCollapsed && "ml-16")}></div>
    </>
  )
}
