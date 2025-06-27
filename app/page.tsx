"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowRight,
  CheckCircle,
  Target,
  Palette,
  Type,
  Lightbulb,
  Star,
  TrendingUp,
  Eye,
  Heart,
  Sparkles,
  Zap,
  Award,
  Users,
} from "lucide-react"

interface BrandData {
  brandName: string
  brandDescription: string
  industry: string
  targetAudience: string
  websiteLink: string
}

interface BrandScores {
  overall: number
  awareness: number
  consistency: number
  engagement: number
}

interface BrandKit {
  mission: string
  vision: string
  tagline: string
  typography: string
  colorPalette: string[]
  insights: string[]
  insightSummary?: string
  summaryOfFindings?: string
  taglineExplanation?: string
  typographyExplanation?: string
  colorPaletteExplanation?: string
}

export default function BrandAssessmentApp() {
  const [currentStep, setCurrentStep] = useState(0)
  const [brandData, setBrandData] = useState<BrandData>({
    brandName: "",
    brandDescription: "",
    industry: "",
    targetAudience: "",
    websiteLink: "",
  })
  const [brandScores, setBrandScores] = useState<BrandScores | null>(null)
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const steps = ["Welcome", "Brand Information", "Audit Results", "Brand Kit"]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    if (score >= 36) return "text-orange-600"
    return "text-rose-500"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200"
    if (score >= 60) return "bg-amber-50 border-amber-200"
    if (score >= 36) return "bg-orange-50 border-orange-200"
    return "bg-rose-50 border-rose-200"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  const [formStep, setFormStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formQuestions = [
    {
      id: "brandName",
      question: "What's your brand's name?",
      placeholder: "Enter your brand's name",
      type: "input" as const,
      required: true,
      icon: Sparkles,
      color: "bg-green-50 border-green-200",
    },
    {
      id: "industry",
      question: "What industry is your business in?",
      placeholder: "e.g., Technology, Healthcare, Consulting...",
      type: "input" as const,
      required: true,
      icon: Target,
      color: "bg-purple-50 border-purple-200",
    },
    {
      id: "brandDescription",
      question: "How would you describe what your brand does?",
      placeholder: "Tell us about your brand in a few sentences...",
      type: "textarea" as const,
      required: true,
      icon: Lightbulb,
      color: "bg-rose-50 border-rose-200",
    },
    {
      id: "targetAudience",
      question: "Who is your ideal customer?",
      placeholder: "Describe your target audience",
      type: "input" as const,
      required: true,
      icon: Users,
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: "websiteLink",
      question: "What's your website URL?",
      placeholder: "https://yourwebsite.com",
      type: "input" as const,
      required: false,
      icon: Zap,
      color: "bg-amber-50 border-amber-200",
    },
  ]

  const currentQuestion = formQuestions[formStep]
  const progress = ((formStep + 1) / formQuestions.length) * 100

  const validateCurrentField = () => {
    const field = currentQuestion.id as keyof BrandData
    const value = brandData[field]

    if (currentQuestion.required && (!value || value.trim() === "")) {
      setErrors({ [field]: "This field is required" })
      return false
    }

    if (field === "websiteLink" && value && !value.match(/^https?:\/\/.+/)) {
      setErrors({ [field]: "Please enter a valid URL starting with http:// or https://" })
      return false
    }

    setErrors({})
    return true
  }

  const handleNext = () => {
    if (validateCurrentField()) {
      if (formStep < formQuestions.length - 1) {
        setFormStep(formStep + 1)
      } else {
        handleFormSubmit()
      }
    }
  }

  const handleBack = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1)
      setErrors({})
    } else {
      setCurrentStep(0)
    }
  }

  const handleFormSubmit = async () => {
    setIsLoading(true)

    try {
      // Send data to webhook
      const webhookUrl = "https://pro-aiteam-dev.app.n8n.cloud/webhook-test/0dba3d89-5fa9-4ec1-8e71-81ffdeec2f80"
      
      const payload = [{
        brandName: brandData.brandName,
        industry: brandData.industry,
        website: brandData.websiteLink,
        brandDescription: brandData.brandDescription,
        targetAudience: brandData.targetAudience
      }]
      
      console.log('Webhook payload being sent:', payload)
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        console.error('Webhook request failed:', response.status, response.statusText)
        // Fallback to mock data if webhook fails
        const mockScores: BrandScores = {
          overall: Math.floor(Math.random() * 30) + 70,
          awareness: Math.floor(Math.random() * 30) + 65,
          consistency: Math.floor(Math.random() * 30) + 70,
          engagement: Math.floor(Math.random() * 30) + 60,
        }
        setBrandScores(mockScores)
      } else {
        console.log('Data sent to webhook successfully')
        const responseData = await response.json()
        console.log('Webhook response:', responseData)
        
        // Parse webhook response data
        const output = responseData.output
        const scores: BrandScores = {
          overall: parseInt(output.brandScore.replace('%', '')),
          awareness: parseInt(output.brandAwareness.replace('%', '')),
          consistency: parseInt(output.brandConsistency.replace('%', '')),
          engagement: parseInt(output.brandEngagement.replace('%', ''))
        }
        
        setBrandScores(scores)
        
        // Store additional insights for display
        setBrandKit({
          mission: output.brandMission,
          vision: output.brandVision,
          tagline: output.brandTagline.tagline,
          typography: output.typography.fontName,
          colorPalette: [output.colorPalette.primary, output.colorPalette.secondary, output.colorPalette.accent, output.colorPalette.background, output.colorPalette.text],
          insights: output.actionableInsights,
          insightSummary: output.insightSummaryAudit,
          summaryOfFindings: output.summaryOfFindingsAudit,
          taglineExplanation: output.taglineExplanation,
          typographyExplanation: output.typographyExplanation,
          colorPaletteExplanation: output.colorPaletteExplanation,
        })
      }
    } catch (error) {
      console.error('Error sending data to webhook:', error)
      // Fallback to mock data if webhook fails
      const mockScores: BrandScores = {
        overall: Math.floor(Math.random() * 30) + 70,
        awareness: Math.floor(Math.random() * 30) + 65,
        consistency: Math.floor(Math.random() * 30) + 70,
        engagement: Math.floor(Math.random() * 30) + 60,
      }
      setBrandScores(mockScores)
    }

    setIsLoading(false)
    setCurrentStep(2)
  }

  const handleInputChange = (value: string) => {
    const field = currentQuestion.id as keyof BrandData
    setBrandData({ ...brandData, [field]: value })
    if (errors[field]) {
      setErrors({})
    }
  }

  const getCurrentValue = () => {
    const field = currentQuestion.id as keyof BrandData
    return brandData[field]
  }

  const generateBrandKit = async () => {
    setIsLoading(true)

    // Use the webhook response data that's already stored in brandKit
    if (brandKit) {
      setIsLoading(false)
      setCurrentStep(3)
      return
    }

    // Fallback to mock data if no webhook data available
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockKit: BrandKit = {
      mission: `To ${brandData.brandDescription.toLowerCase().includes("help") ? "empower and support" : "innovate and lead"} in the ${brandData.industry.toLowerCase()} industry while delivering exceptional value to ${brandData.targetAudience.toLowerCase()}.`,
      vision: `To become the most trusted and recognized ${brandData.industry.toLowerCase()} brand that transforms how ${brandData.targetAudience.toLowerCase()} experience our services.`,
      tagline: `${brandData.brandName} - ${brandData.industry.includes("Tech") ? "Innovation Simplified" : brandData.industry.includes("Health") ? "Wellness Redefined" : "Excellence Delivered"}`,
      typography: "Modern Sans-Serif with clean, readable letterforms that convey professionalism and approachability",
      colorPalette: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"],
      insights: [
        "Strengthen your online presence with consistent visual branding",
        "Develop a content strategy that resonates with your target audience",
        "Implement customer feedback systems to improve engagement",
        "Create brand guidelines to ensure consistency across all touchpoints",
      ],
    }

    setBrandKit(mockKit)
    setIsLoading(false)
    setCurrentStep(3)
  }

  // Landing Page
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">AI-Powered Brand Assessment</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0 text-xs">
                  NEW
                </Badge>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Discover Your Brand's
                <span className="block text-blue-600">True Potential</span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Get a comprehensive AI-powered brand audit and receive a custom brand kit tailored to your business.
                Understand your brand's strengths and unlock growth opportunities in minutes.
              </p>

              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setCurrentStep(1)}
              >
                Start Your Brand Audit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="group border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl mb-4 text-gray-900">AI Brand Audit</CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    Comprehensive analysis of your brand's performance across key metrics using advanced AI algorithms
                  </p>
                </CardContent>
              </Card>

              <Card className="group border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Palette className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl mb-4 text-gray-900">Custom Brand Kit</CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    Personalized brand elements including mission, vision, and design recommendations tailored to your
                    industry
                  </p>
                </CardContent>
              </Card>

              <Card className="group border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-8 h-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl mb-4 text-gray-900">Actionable Insights</CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    Strategic recommendations and growth opportunities to improve your brand's impact and market reach
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Brands Analyzed</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-emerald-600">2 Min</div>
                <div className="text-sm text-gray-600">Average Time</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-amber-600">4.9★</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Brand Information Form - Conversational Style
  if (currentStep === 1) {
    const IconComponent = currentQuestion.icon

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-lg font-bold">P</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Proweaver</span>
              </div>
              <div className="hidden md:flex items-center space-x-8 text-sm text-gray-600">
                <span className="hover:text-gray-900 cursor-pointer transition-colors">Dashboard</span>
                <span className="hover:text-gray-900 cursor-pointer transition-colors">Projects</span>
                <span className="hover:text-gray-900 cursor-pointer transition-colors">Templates</span>
                <span className="hover:text-gray-900 cursor-pointer transition-colors">AI Tools</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Progress Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Brand Builder</h2>
                  <p className="text-gray-600">Let's create something amazing together</p>
                </div>
                <Badge variant="outline" className="bg-white border-gray-200 text-gray-700 px-4 py-2">
                  Step {formStep + 1} of {formQuestions.length}
                </Badge>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="absolute -top-1 transition-all duration-700 ease-out" style={{ left: `${progress}%` }}>
                  <div className="w-5 h-5 bg-white border-4 border-blue-600 rounded-full shadow-sm transform -translate-x-1/2" />
                </div>
              </div>
            </div>

            {/* Question Card */}
            <Card className="border border-gray-200 bg-white shadow-lg overflow-hidden">
              <div className="p-12">
                <div className="text-center mb-12">
                  <div
                    className={`w-20 h-20 ${currentQuestion.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm`}
                  >
                    <IconComponent className="w-10 h-10 text-gray-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{currentQuestion.question}</h3>
                  {!currentQuestion.required && <p className="text-gray-500 text-sm">This field is optional</p>}
                </div>

                <div className="max-w-lg mx-auto space-y-6">
                  {currentQuestion.type === "input" && (
                    <Input
                      value={getCurrentValue()}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder={currentQuestion.placeholder}
                      className={`text-lg p-6 h-14 border-2 rounded-2xl bg-white transition-all duration-300 focus:border-blue-500 focus:shadow-lg ${
                        errors[currentQuestion.id]
                          ? "border-rose-500 focus:border-rose-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      type={currentQuestion.id === "websiteLink" ? "url" : "text"}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleNext()
                        }
                      }}
                    />
                  )}

                  {currentQuestion.type === "textarea" && (
                    <Textarea
                      value={getCurrentValue()}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder={currentQuestion.placeholder}
                      className={`text-lg p-6 min-h-[140px] border-2 rounded-2xl bg-white transition-all duration-300 focus:border-blue-500 focus:shadow-lg resize-none ${
                        errors[currentQuestion.id]
                          ? "border-rose-500 focus:border-rose-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      rows={5}
                    />
                  )}

                  {errors[currentQuestion.id] && (
                    <div className="flex items-center space-x-2 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-200">
                      <div className="w-2 h-2 bg-rose-600 rounded-full" />
                      <p className="text-sm font-medium">{errors[currentQuestion.id]}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-gray-50 p-8 border-t border-gray-200">
                <div className="flex justify-between max-w-lg mx-auto">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="px-8 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : formStep === formQuestions.length - 1 ? (
                      "Generate Brand Audit"
                    ) : (
                      "Next"
                    )}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Brand Audit Results
  if (currentStep === 2 && brandScores) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="bg-white border-gray-200 text-gray-700 px-4 py-2 mb-4">
                Step 2 of 3
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Brand Audit Results</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Here's how your brand performs across key metrics based on our AI analysis
              </p>
            </div>

            <div className="grid gap-8 mb-12">
              {/* Overall Score - Hero Card */}
              <Card className="border border-gray-200 bg-white shadow-lg overflow-hidden">
                <CardContent className="p-12 text-center">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <Award className="w-8 h-8 text-amber-500" />
                    <h3 className="text-2xl font-bold text-gray-900">Overall Brand Score</h3>
                  </div>
                  <div className={`text-8xl font-bold mb-4 ${getScoreColor(brandScores.overall)}`}>
                    {brandScores.overall}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-lg px-6 py-2 border-2 ${getScoreBackground(brandScores.overall)}`}
                  >
                    {getScoreLabel(brandScores.overall)}
                  </Badge>
                </CardContent>
              </Card>

              {/* Individual Scores */}
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="group border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Brand Awareness</h4>
                    <div className={`text-4xl font-bold mb-4 ${getScoreColor(brandScores.awareness)}`}>
                      {brandScores.awareness}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${brandScores.awareness >= 80 ? "bg-emerald-600" : brandScores.awareness >= 60 ? "bg-amber-600" : brandScores.awareness >= 36 ? "bg-orange-600" : "bg-rose-500"}`}
                        style={{ width: `${brandScores.awareness}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Brand Consistency</h4>
                    <div className={`text-4xl font-bold mb-4 ${getScoreColor(brandScores.consistency)}`}>
                      {brandScores.consistency}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ease-out delay-200 ${brandScores.consistency >= 80 ? "bg-emerald-600" : brandScores.consistency >= 60 ? "bg-amber-600" : brandScores.consistency >= 36 ? "bg-orange-600" : "bg-rose-500"}`}
                        style={{ width: `${brandScores.consistency}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-rose-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Brand Engagement</h4>
                    <div className={`text-4xl font-bold mb-4 ${getScoreColor(brandScores.engagement)}`}>
                      {brandScores.engagement}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ease-out delay-500 ${brandScores.engagement >= 80 ? "bg-emerald-600" : brandScores.engagement >= 60 ? "bg-amber-600" : brandScores.engagement >= 36 ? "bg-orange-600" : "bg-rose-500"}`}
                        style={{ width: `${brandScores.engagement}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl">
                    <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center mr-4">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    Summary of Findings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <h5 className="font-bold text-emerald-800 mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Strengths
                      </h5>
                      <p className="text-emerald-700">
                        {brandKit?.insightSummary || (
                          <>
                            <strong>{brandData.brandName}</strong> shows {brandScores.overall >= 70 ? "strong" : "moderate"}{" "}
                            brand performance with particular strengths in{" "}
                            {brandScores.consistency >= brandScores.awareness &&
                            brandScores.consistency >= brandScores.engagement
                              ? "brand consistency"
                              : brandScores.awareness >= brandScores.engagement
                                ? "brand awareness"
                                : "brand engagement"}
                            .
                          </>
                        )}
                      </p>
                    </div>
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                      <h5 className="font-bold text-blue-800 mb-2 flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Opportunities
                      </h5>
                      <p className="text-blue-700">
                        {brandKit?.summaryOfFindings || (
                          <>
                            Key opportunities for improvement include enhancing{" "}
                            {brandScores.awareness < brandScores.consistency &&
                            brandScores.awareness < brandScores.engagement
                              ? "brand awareness"
                              : brandScores.consistency < brandScores.engagement
                                ? "brand consistency"
                                : "brand engagement"}{" "}
                            to drive overall brand growth.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={generateBrandKit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Your Brand Kit...</span>
                  </div>
                ) : (
                  <>
                    Generate My Brand Kit
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Brand Kit
  if (currentStep === 3 && brandKit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="bg-white border-gray-200 text-gray-700 px-4 py-2 mb-4">
                Step 3 of 3
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Custom Brand Kit</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your personalized brand elements and strategic recommendations
              </p>
            </div>

            <div className="grid gap-8 mb-12">
              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mr-3">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      Brand Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-lg">{brandKit.mission}</p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl">
                      <div className="w-10 h-10 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center mr-3">
                        <Eye className="w-5 h-5 text-purple-600" />
                      </div>
                      Brand Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-lg">{brandKit.vision}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tagline */}
              <Card className="border border-gray-200 bg-rose-50 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Brand Tagline</h3>
                  <p className="text-3xl font-bold text-blue-600 italic mb-6">"{brandKit.tagline}"</p>
                  <div className="mt-6">
                    <h5 className="font-semibold text-gray-900 mb-2">Why This Tagline Works</h5>
                    <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                      {brandKit.taglineExplanation || `This tagline captures ${brandData.brandName}'s core value proposition in the ${brandData.industry.toLowerCase()} space. It's memorable, concise, and speaks directly to ${brandData.targetAudience.toLowerCase()}, positioning your brand as both innovative and reliable in your market.`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Typography & Colors */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border border-gray-200 bg-white shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl">
                      <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center mr-3">
                        <Type className="w-5 h-5 text-emerald-600" />
                      </div>
                      Typography
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Font Name</h5>
                        <p className="text-lg text-gray-700">{brandKit.typography}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Sample Text</h5>
                        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
                          <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: `${brandKit.typography}, sans-serif` }}>
                            {brandKit.tagline}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Why This Font Works</h5>
                        <p className="text-gray-700 leading-relaxed">
                          {brandKit.typographyExplanation || `${brandKit.typography} is perfect for ${brandData.brandName} because it combines modern professionalism with excellent readability. Its clean, geometric design conveys trust and reliability while remaining approachable for ${brandData.targetAudience.toLowerCase()}. The font's versatility ensures consistent brand communication across all digital and print materials.`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl">
                      <div className="w-10 h-10 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-center mr-3">
                        <Palette className="w-5 h-5 text-rose-500" />
                      </div>
                      Color Palette
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid gap-4">
                        {[
                          {
                            color: brandKit.colorPalette[0],
                            name: "Primary",
                            usage: "Main brand color for logos and key elements",
                          },
                          {
                            color: brandKit.colorPalette[1],
                            name: "Secondary",
                            usage: "Supporting color for accents and highlights",
                          },
                          {
                            color: brandKit.colorPalette[2],
                            name: "Accent",
                            usage: "Call-to-action buttons and important details",
                          },
                          {
                            color: brandKit.colorPalette[3],
                            name: "Background",
                            usage: "Page backgrounds and subtle sections",
                          },
                          {
                            color: brandKit.colorPalette[4],
                            name: "Text",
                            usage: "Primary text and content readability",
                          },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div
                              className="w-12 h-12 rounded-xl shadow-sm border-2 border-white flex-shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <div className="flex-1">
                              <h6 className="font-semibold text-gray-900">{item.name}</h6>
                              <p className="text-sm text-gray-600">{item.usage}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Why These Colors Work</h5>
                        <p className="text-gray-700 leading-relaxed">
                          {brandKit.colorPaletteExplanation || `This color palette perfectly reflects ${brandData.brandName}'s position in the ${brandData.industry.toLowerCase()} industry. The primary color establishes trust and professionalism, while the secondary and accent colors add energy and approachability. This combination resonates with ${brandData.targetAudience.toLowerCase()} and differentiates your brand in the marketplace while maintaining versatility across all brand applications.`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights */}
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl">
                    <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center mr-4">
                      <Lightbulb className="w-6 h-6 text-amber-600" />
                    </div>
                    Actionable Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {brandKit.insights.map((insight, index) => (
                      <div key={index} className="flex items-start p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                        <div className="w-8 h-8 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-gray-700 leading-relaxed">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowModal(true)}
              >
                Get Full Brand Kit Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-lg border border-gray-200 bg-white shadow-xl">
            <DialogHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900">Ready to Transform Your Brand?</DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                Get your complete brand kit and professional guidance from the Proweaver team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <p className="text-gray-700 text-center">
                Our brand experts will help you implement these recommendations and provide:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Complete brand guidelines</span>
                </div>
                <div className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Logo design & variations</span>
                </div>
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Marketing templates</span>
                </div>
                <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Implementation strategy</span>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300"
                >
                  Maybe Later
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.open("mailto:contact@proweaver.com?subject=Brand Kit Access Request", "_blank")}
                >
                  Contact Proweaver
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return null
}
