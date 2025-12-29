'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSignup } from '@/hooks/use-signup'
import { useSendVerificationEmail } from '@/hooks/use-verification'
import { useCurrentUser } from '@/context/user-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLoading } from '@/components/ui/loading'
import { VerificationCodeInput } from '@/components/ui/verification-code-input'
import { UserRegisterRequest } from '@/types/requests'
import { Eye, EyeOff, CheckCircle, Mail, ImageIcon, X } from 'lucide-react'

type SignupFormData = UserRegisterRequest & {
  confirmPassword: string
  image: File | null
}

export function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    image: null,
  })
  const [errors, setErrors] = useState<Partial<SignupFormData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isVerificationStep, setIsVerificationStep] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [expectedVerificationCode, setExpectedVerificationCode] = useState<string | null>(null)
  const [verificationKey, setVerificationKey] = useState(0)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()

  const signupMutation = useSignup()
  const sendVerificationMutation = useSendVerificationEmail()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <PageLoading />
  }

  if (user) {
    return (
      <Card className="bg-card border border-border shadow-lg w-full">
        <CardContent className="px-8 py-16">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Already logged in!</h3>
              <p className="text-muted-foreground">
                You are already signed in as {user.firstName || user.email}
              </p>
            </div>
            <Button onClick={() => router.push('/')} className="mt-4">
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }))
    setImagePreview(null)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {}
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      sendVerificationMutation.mutate(formData.email, {
        onSuccess: (data) => {
          setIsVerificationStep(true)
          setVerificationError(null)
          setVerificationCode('')
          setExpectedVerificationCode(data.verificationCode)
          setVerificationKey(prev => prev + 1) // Reset verification input
        },
        onError: (error) => {
          setVerificationError(error.message || 'Failed to send verification email. Please try again.')
        }
      })
    }
  }

  const handleVerificationCodeChange = (code: string) => {
    setVerificationCode(code)
    setVerificationError(null)
  }

  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      setVerificationError('Please enter the complete 6-digit code.')
      return
    }

    setVerificationError(null)
    
    if (verificationCode === expectedVerificationCode) {
      const { confirmPassword, image, ...signupData } = formData
      
      const formDataToSend = new FormData()
      formDataToSend.append('firstName', signupData.firstName)
      formDataToSend.append('lastName', signupData.lastName)
      formDataToSend.append('email', signupData.email)
      formDataToSend.append('phoneNumber', signupData.phoneNumber)
      formDataToSend.append('password', signupData.password)
      if (signupData.middleName) {
        formDataToSend.append('middleName', signupData.middleName)
      }
      if (signupData.about) {
        formDataToSend.append('about', signupData.about)
      }
      if (image) {
        formDataToSend.append('image', image)
      }
      
      signupMutation.mutate(formDataToSend)
    } else {
      setVerificationError('Invalid verification code. Please try again.')
    }
  }

  const handleResendVerification = () => {
    setVerificationError(null)
    sendVerificationMutation.mutate(formData.email, {
      onSuccess: (data) => {
        setVerificationError(null)
        setVerificationCode('')
        setExpectedVerificationCode(data.verificationCode)
        setVerificationKey(prev => prev + 1) // Reset verification input
      },
      onError: (error) => {
        setVerificationError(error.message || 'Failed to resend verification email. Please try again.')
      }
    })
  }

  return (
    <Card className="bg-card border border-border shadow-lg w-full">
      <CardHeader className="text-center space-y-1 pb-1 px-8 pt-8">
        <CardTitle className="text-3xl font-bold">Thank you for choosing us!</CardTitle>
        <CardDescription className="text-base">
          Join UniHub to discover amazing events and connect with your community
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-base font-medium"
              onClick={() => {
                window.location.href = 'http://localhost:8081/oauth2/authorization/google'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-base font-medium"
              onClick={() => {
                const clientId = process.env.NEXT_PUBLIC_MICROSOFT_OAUTH_CLIENT_ID;
                const redirectUri = "http://localhost:8081/login/oauth2/code/microsoft";
                const scope = "openid email profile";
                const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${encodeURIComponent(scope)}&prompt=select_account`;
                window.location.href = url;
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h11v11H0V0z" fill="#F25022"/>
                <path d="M12 0h11v11H12V0z" fill="#7FBA00"/>
                <path d="M0 12h11v11H0V12z" fill="#00A4EF"/>
                <path d="M12 12h11v11H12V12z" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        </div>

        {isVerificationStep ? (
          <div className="space-y-6 mt-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a 6-digit verification code to <span className="font-medium text-foreground">{formData.email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-center block">Enter verification code</Label>
                <VerificationCodeInput
                  key={verificationKey}
                  onComplete={handleVerificationCodeChange}
                  error={!!verificationError}
                />
                {verificationError && (
                  <p className="text-sm text-destructive text-center">{verificationError}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  className="w-full h-11 text-base font-medium"
                  disabled={signupMutation.isPending || verificationCode.length !== 6}
                  onClick={handleVerifyCode}
                >
                  {signupMutation.isPending
                    ? 'Creating account...'
                    : 'Verify Code'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={sendVerificationMutation.isPending}
                    className="text-sm text-primary hover:underline disabled:opacity-50"
                  >
                    {sendVerificationMutation.isPending ? 'Sending...' : "Didn't receive code? Resend"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsVerificationStep(false)
                    setVerificationError(null)
                    setVerificationCode('')
                    setExpectedVerificationCode(null)
                    setVerificationKey(prev => prev + 1) // Reset verification input
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to sign up
                </button>
              </div>

              {signupMutation.isError && (
                <p className="text-sm text-destructive text-center">
                  {signupMutation.error?.message || 'Account creation failed. Please try again.'}
                </p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`h-11 ${errors.firstName ? 'border-destructive' : ''}`}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`h-11 ${errors.lastName ? 'border-destructive' : ''}`}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="johndoe@asu.edu"
              value={formData.email}
              onChange={handleInputChange}
              className={`h-11 ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`h-11 ${errors.phoneNumber ? 'border-destructive' : ''}`}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePicture" className="text-sm font-medium">Profile Picture (Optional)</Label>
            <div className="relative">
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
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
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className={`h-11 pr-10 ${errors.password ? 'border-destructive' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`h-11 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              required
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-medium" 
            disabled={signupMutation.isPending || sendVerificationMutation.isPending}
          >
            {sendVerificationMutation.isPending 
              ? 'Sending verification email...' 
              : signupMutation.isPending 
              ? 'Creating account...' 
              : 'Create account'}
          </Button>

          {signupMutation.isError && !isVerificationStep && (
            <p className="text-sm text-destructive text-center">
              {signupMutation.error?.message || 'Signup failed. Please try again.'}
            </p>
          )}
        </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
