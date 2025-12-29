"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Moon, Eye, LogOut, ImageIcon, X } from "lucide-react"
import { useCurrentUser } from "@/context/user-context"
import { useTheme } from "@/context/theme-context"
import { useUpdateUser } from "@/hooks/use-update-user"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageLoading } from "@/components/ui/loading"
import { UserUpdateRequest } from "@/types/requests"
import { cn } from "@/utils/cn"

type SettingsSection = "profile" | "theme" | "visibility"

export default function SettingsClient() {
  const { user, isLoading } = useCurrentUser()
  const { theme, setTheme, isDark } = useTheme()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [visibility, setVisibility] = useState("public")
  
  const [formData, setFormData] = useState<UserUpdateRequest>({
    firstName: "",
    middleName: "",
    lastName: "",
    about: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const updateUserMutation = useUpdateUser(user?.id || 0)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        about: user.about || "",
      })
      if (user.profilePicture) {
        setImagePreview(user.profilePicture)
      }
    }
  }, [user])

  const handleInputChange = (field: keyof UserUpdateRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSave = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Create FormData
    const formDataToSend = new FormData()
    if (formData.firstName) {
      formDataToSend.append('firstName', formData.firstName)
    }
    if (formData.lastName) {
      formDataToSend.append('lastName', formData.lastName)
    }
    if (formData.middleName) {
      formDataToSend.append('middleName', formData.middleName)
    }
    if (formData.phoneNumber) {
      formDataToSend.append('phoneNumber', formData.phoneNumber)
    }
    if (formData.about) {
      formDataToSend.append('about', formData.about)
    }
    if (imageFile) {
      formDataToSend.append('image', imageFile)
    }

    try {
      await updateUserMutation.mutateAsync({
        formData: formDataToSend,
        token,
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  if (isLoading) {
    return <PageLoading text="Loading settings..." />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection("profile")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors relative",
                  activeSection === "profile"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
                {activeSection === "profile" && (
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-primary rounded-l" />
                )}
              </button>
              
              <button
                onClick={() => setActiveSection("theme")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors relative",
                  activeSection === "theme"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Moon className="h-5 w-5" />
                <span>Theme</span>
                {activeSection === "theme" && (
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-primary rounded-l" />
                )}
              </button>
              
              <button
                onClick={() => setActiveSection("visibility")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors relative",
                  activeSection === "visibility"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Eye className="h-5 w-5" />
                <span>Visibility</span>
                {activeSection === "visibility" && (
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-primary rounded-l" />
                )}
              </button>
              
              <div className="pt-8 mt-8 border-t border-border">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </div>
            </nav>
          </div>
  
          <div className="flex-1">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <div className="relative">
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Label
                            htmlFor="profilePicture"
                            className="cursor-pointer"
                          >
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Change Image
                            </Button>
                          </Label>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Label
                        htmlFor="profilePicture"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </Label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      placeholder="Ralph"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange("middleName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College</Label>
                  <Input
                    id="college"
                    placeholder="Stanford University"
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    placeholder="[Bio here]."
                    value={formData.about}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "theme" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark mode
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={isDark}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "visibility" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="visibility">Account Visibility</Label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger id="visibility" className="w-full md:w-[300px]">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile and events
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

