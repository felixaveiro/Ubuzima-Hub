import { Heart, BarChart3, Users, TrendingUp, Target, Map, Brain, Shield, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import dynamic from 'next/dynamic'
import Script from 'next/script'


const stats = [
  { 
    value: "85%", 
    label: "Food Security Rate", 
    trend: "up", 
    change: "+5.1%",
    color: "text-green-600",
    bgColor: "bg-green-50/80",
    borderColor: "border-green-100",
    hoverBgColor: "hover:bg-green-100/90"
  },
  { 
    value: "2%", 
    label: "Children Wasted", 
    trend: "stable", 
    change: "±0%",
    color: "text-amber-600",
    bgColor: "bg-amber-50/80",
    borderColor: "border-amber-100",
    hoverBgColor: "hover:bg-amber-100/90"
  },
  { 
    value: "17%", 
    label: "Anemia in Women", 
    trend: "down", 
    change: "-3.2%",
    color: "text-purple-600",
    bgColor: "bg-purple-50/80",
    borderColor: "border-purple-100",
    hoverBgColor: "hover:bg-purple-100/90"
  },
  { 
    value: "85%", 
    label: "Food Security Rate", 
    trend: "up", 
    change: "+5.1%",
    color: "text-green-600",
    bgColor: "bg-green-50/80",
    borderColor: "border-green-100",
    hoverBgColor: "hover:bg-green-100/90"
  },
]

const features = [
  {
    icon: BarChart3,
    title: "Nutrition Mapping",
    description: "Interactive visualization of stunting, wasting, and micronutrient deficiencies across all 30 districts",
    color: "text-[#005BAC]",
    benefits: ["Real-time data", "District-level insights", "Trend analysis"]
  },
  {
    icon: Brain,
    title: "AI Risk Prediction", 
    description: "Machine learning models identify communities at highest risk for targeted intervention planning",
    color: "text-[#005BAC]",
    benefits: ["Predictive analytics", "Early warning", "Resource optimization"]
  },
  {
    icon: Target,
    title: "Root Cause Analysis",
    description: "Deep analysis of underlying factors across health, agriculture, and socioeconomic dimensions",
    color: "text-[#005BAC]",
    benefits: ["Multi-factor analysis", "Evidence-based insights", "Policy guidance"]
  },
  {
    icon: Shield,
    title: "Smart Interventions",
    description: "Data-driven recommendations for nutrition programs and policy interventions with measurable impact",
    color: "text-[#005BAC]",
    benefits: ["Targeted programs", "Impact measurement", "Cost efficiency"]
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6E8EB] to-white font-sans">
      {/* Hero Section */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-[#005BAC]/5 via-white to-[#005BAC]/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative z-10 max-w-7xl">
          <Badge variant="secondary" className="mb-10 px-6 py-3 text-lg font-semibold bg-white shadow-sm border border-[#005BAC]/10 text-[#005BAC]">
            <Heart className="h-6 w-6 mr-2 text-red-500" />
            Rwanda's Fight Against Hidden Hunger  and malnutriton in children under 5 years
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-balance mb-10 leading-tight tracking-tight text-gray-900">
            UBUZIMA<span className="text-[#005BAC] relative font-black">
             HUB
              <div className="absolute -inset-2 bg-[#005BAC]/10 rounded-xl -z-10 transform rotate-1"></div>
            </span> <br />
            in Rwanda
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-5xl mx-auto leading-relaxed">
           Rwanda continues to face high rates of stunting, wasting, anemia, and food insecurity among children and women.
           Policymakers, health workers, and planners lack a unified, data-driven tool to identify malnutrition hotspots,
           track key nutrition indicators, and prioritize interventions. Ubuzima hub in Rwanda integrates national datasets,
           maps local nutrition challenges, and provides actionable, AI-driven insights to guide targeted nutrition programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="text-lg px-12 py-6 shadow-xl bg-[#005BAC] hover:bg-[#004a8f] text-white transition-all duration-300 transform hover:scale-105 rounded-xl font-bold" asChild>
              <Link href="/dashboard">
                Explore Nutrition Dashboard <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-12 py-6 shadow-xl border-2 border-[#005BAC] text-[#005BAC] hover:bg-[#005BAC] hover:text-white transition-all duration-300 rounded-xl font-bold" asChild>
              <Link href="/data">
                View Malnutrition Data
              </Link>
            </Button>
          </div>
          
          {/* Key Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className={`p-6 ${stat.bgColor} ${stat.borderColor} ${stat.hoverBgColor} backdrop-blur-sm border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${stat.color} mb-2 tracking-tight`}>{stat.value}</div>
                  <div className="text-sm font-medium text-gray-700 mb-3">{stat.label}</div>
                  <Badge 
                    variant={stat.trend === "up" ? "default" : stat.trend === "down" ? "secondary" : "outline"}
                    className="text-xs font-semibold px-3 py-1 rounded-full text-gray-700"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Comprehensive Nutrition Intelligence Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform transforms complex nutrition data into actionable insights for policymakers, 
              healthcare providers, and development organizations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-[#E6E8EB] border-2 border-[#005BAC]/10 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="p-0 mb-6">
                  <div className="w-14 h-14 bg-[#005BAC]/10 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className={`h-4 w-4 ${feature.color}`} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rwanda Nutrition Map Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-7xl">
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-6 bg-[#E6E8EB]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 tracking-tight">
                Driving Measurable Impact in <span className="text-[#005BAC]">Rwanda's Nutrition Landscape</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                By leveraging comprehensive datasets from NISR, DHS Rwanda 2020, and agricultural statistics, 
                we provide evidence-based insights that enable targeted interventions and policy decisions.
              </p>
              <div className="space-y-6">
                {[
                  "Real-time monitoring of nutrition indicators across all 30 districts",
                  "Predictive models for early identification of at-risk populations",
                  "Evidence-based recommendations for program optimization"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <CheckCircle className="h-6 w-6 text-[#005BAC]" />
                    <span className="text-lg text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="p-10 bg-gradient-to-br from-[#005BAC]/5 to-[#005BAC]/10 border-2 border-[#005BAC]/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <Map className="h-20 w-20 text-[#005BAC] mx-auto mb-6" />
                  <h3 className="text-3xl font-bold mb-3 text-gray-900">30 Districts</h3>
                  <p className="text-gray-600 mb-8 text-lg">Comprehensive coverage across Rwanda</p>
                  <Button variant="outline" className="w-full text-lg px-8 py-4 border-2 border-[#005BAC] text-[#005BAC] hover:bg-[#005BAC] hover:text-white transition-all duration-300 rounded-xl font-semibold" asChild>
                    <Link href="/data">
                      Explore Geographic Data <ArrowRight className="ml-3 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#005BAC]/5 via-white to-[#005BAC]/10">
        <div className="container mx-auto text-center max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 tracking-tight">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the mission to end hidden hunger in Rwanda. Access comprehensive nutrition data, 
            AI-powered insights, and evidence-based recommendations to drive meaningful change in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="text-lg px-12 py-6 shadow-xl bg-[#005BAC] hover:bg-[#004a8f] text-white transition-all duration-300 transform hover:scale-105 rounded-xl font-bold" asChild>
              <Link href="/dashboard">
                Start Exploring Data <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-12 py-6 shadow-xl border-2 border-[#005BAC] text-[#005BAC] hover:bg-[#005BAC] hover:text-white transition-all duration-300 rounded-xl font-bold" asChild>
              <Link href="/insights">
                View AI Insights
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}