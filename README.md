# Ubuzima Hub 🇷🇼

> **AI-Powered Nutrition Intelligence for Combating Hidden Hunger**

Ubuzima Hub is a comprehensive data analytics platform designed to combat micronutrient deficiencies and malnutrition across Rwanda's 30 districts. Built for Rwanda's 2025 Big Data Hackathon (Track 2: Ending Hidden Hunger), this platform transforms complex nutrition and health datasets into actionable insights for policymakers, healthcare providers, and development organizations.

![Ubuzima Hub Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.2.25-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.9-38bdf8)

## 🎯 Mission Statement

**Ending Hidden Hunger Through Data Intelligence**

Our mission is to provide evidence-based insights that enable targeted interventions and policy decisions to improve nutrition outcomes across Rwanda, with a specific focus on reducing stunting, wasting, and micronutrient deficiencies in vulnerable populations.

## ✨ Key Features

### 📊 **Nutrition Intelligence Dashboard**
- Real-time monitoring of key nutrition indicators across all 30 districts
- Interactive visualization of stunting, wasting, and micronutrient deficiencies
- Historical trend analysis showing Rwanda's progress against malnutrition
- Food security status tracking with district-level breakdowns

### 🤖 **AI-Powered Insights**
- Machine learning models for predicting malnutrition hotspots
- Intelligent recommendations based on nutrition and health data
- Risk assessment algorithms for early intervention planning
- Evidence-based policy guidance and program optimization

### 🗺️ **Geographic Analysis**
- District-level and province-level nutrition mapping
- Comparative analysis across Rwanda's administrative divisions
- Geospatial visualization of nutrition indicators
- Regional trend identification and hotspot mapping

### 📈 **Data Explorer**
- Comprehensive dataset access from NISR Health Surveys
- DHS Rwanda 2020 integration
- Agricultural statistics correlation
- Market price data analysis
- Custom data filtering and export capabilities

## 🏗️ System Architecture

### **Frontend Stack**
- **Framework**: Next.js 14.2.25 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

### **Backend Services**
- **API Routes**: Next.js API Routes
- **AI Integration**: Groq API (Llama 3.1 70B)
- **Database**: PostgreSQL (Neon)
- **Environment**: Node.js

### **Key Dependencies**
```json
{
  "next": "14.2.25",
  "react": "^19",
  "typescript": "^5",
  "tailwindcss": "4.1.9",
  "@ai-sdk/groq": "^0.0.66",
  "recharts": "^2.15.0",
  "@radix-ui/react-*": "^1.1.2"
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
  ```bash
  git clone https://github.com/felixaveiro/Ubuzima-Hub.git
  cd ubuzima-hub
  ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # AI API Configuration
   GROQ_API_KEY=your_groq_api_key_here
   
   # Database Configuration
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Getting API Keys

#### Groq API Key (Required for AI Insights)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Create a new API key
4. Add to your `.env.local` file

#### Database Setup (Optional - Mock data available)
1. Create a PostgreSQL database (recommended: [Neon](https://neon.tech/))
2. Add connection string to `.env.local`
3. Run database migrations (if applicable)

## 📁 Project Structure

```
ubuzima-hub/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── ai-insights/          # AI-powered analysis
│   │   ├── analytics/            # Data analytics endpoints
│   │   ├── data/                 # Data access APIs
│   │   │   ├── agricultural/     # Agricultural statistics
│   │   │   ├── markets/          # Market price data
│   │   │   └── nutrition/        # Nutrition indicators
│   │   ├── recommendations/      # AI recommendations
│   │   └── weather/              # Weather data integration
│   ├── dashboard/                # Main analytics dashboard
│   ├── data/                     # Data explorer interface
│   ├── insights/                 # AI insights page
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI components
│   ├── navigation.tsx           # Main navigation
│   ├── mobile-nav.tsx           # Mobile navigation
│   └── [other-components].tsx
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
└── public/                      # Static assets
```

## 🔌 API Documentation

### Core Endpoints

#### **AI Insights API**
```typescript
POST /api/ai-insights
Content-Type: application/json

{
  "region": "string (optional)",
  "cropData": "array",
  "foodSecurity": "array", 
  "marketPrices": "array"
}

Response: {
  "insight": "string - AI-generated analysis and recommendations"
}
```

#### **Nutrition Data API**
```typescript
GET /api/data/nutrition
Query Parameters:
- district: string (optional)
- indicator: "stunting" | "wasting" | "anemia" | "breastfeeding"
- year: number (optional)

Response: {
  "data": [
    {
      "district": "string",
      "indicator": "string", 
      "value": "number",
      "year": "number",
      "trend": "improving" | "stable" | "worsening"
    }
  ]
}
```

#### **Market Data API**
```typescript
GET /api/data/markets
Query Parameters:
- commodity: string (optional)
- district: string (optional)
- dateFrom: string (optional)
- dateTo: string (optional)

Response: {
  "data": [
    {
      "commodity": "string",
      "price": "number", 
      "district": "string",
      "date": "string",
      "change": "number"
    }
  ],
  "trends": "array"
}
```

## 📊 Data Sources

### **Primary Datasets**
- **NISR Health Survey 2020**: National nutrition indicators
- **DHS Rwanda 2020**: Demographic and health statistics  
- **Agricultural Statistics**: Crop production and yield data
- **Market Price Monitoring**: Food commodity prices
- **Geographic Data**: District and province boundaries

### **Supported Indicators**
- **Stunting**: Children under 5 height-for-age
- **Wasting**: Children under 5 weight-for-height
- **Anemia**: Women aged 15-49 hemoglobin levels
- **Exclusive Breastfeeding**: 0-6 months feeding practices
- **Food Security**: Household food access status
- **Micronutrient Status**: Vitamin A, Iron, Zinc deficiencies

## 🎨 Design System

### **Color Palette**
```css
/* Primary Colors */
--primary: oklch(0.5 0.2 240);        /* Professional Blue */
--accent: oklch(0.6 0.15 160);        /* Success Green */
--warning: oklch(0.7 0.15 80);        /* Warning Yellow */
--destructive: oklch(0.6 0.2 20);     /* Alert Red */

/* Chart Colors */
--chart-1: #3B82F6;  /* Blue - Primary indicators */
--chart-2: #10B981;  /* Green - Positive outcomes */  
--chart-3: #EF4444;  /* Red - Risk indicators */
--chart-4: #F59E0B;  /* Orange - Moderate risk */
```

### **Typography**
- **Primary Font**: Geist Sans (Variable)
- **Monospace**: Geist Mono (Variable)
- **Fallback**: Inter, -apple-system, BlinkMacSystemFont

### **Responsive Design**
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Large tap targets, swipe gestures

## 🧪 Testing & Development

### **Development Commands**
```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### **Testing Strategy**
- **Component Testing**: React Testing Library
- **API Testing**: Jest + Supertest
- **E2E Testing**: Playwright (planned)
- **Performance**: Lighthouse CI

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Environment Variables**
```env
# Required
GROQ_API_KEY=gsk_your_api_key_here

# Optional
DATABASE_URL=postgresql://user:pass@host:port/db
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

### **Branch Naming**
- `feature/`: New features
- `bugfix/`: Bug fixes
- `hotfix/`: Critical fixes
- `docs/`: Documentation updates

## 📈 Performance Metrics

### **Core Web Vitals**
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)  
- **CLS**: < 0.1 (Cumulative Layout Shift)

### **Bundle Analysis**
```bash
npm run build
npm run analyze  # View bundle analyzer
```

## 🔒 Security

### **Data Protection**
- **API Keys**: Environment variables only
- **Rate Limiting**: Implemented on AI endpoints
- **Input Validation**: Zod schema validation
- **HTTPS Only**: Production deployment requirement

### **Privacy Compliance**
- **Data Minimization**: Only necessary data collected
- **Anonymization**: Personal identifiers removed
- **Audit Trail**: API access logging

## 🆘 Support & Troubleshooting

### **Common Issues**

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### API Issues  
```bash
# Check environment variables
echo $GROQ_API_KEY

# Test API connectivity
curl -X POST http://localhost:3000/api/ai-insights
```

#### Styling Issues
```bash
# Rebuild Tailwind
npm run build:css
```

### **Getting Help**
- **Issues**: [GitHub Issues](https://github.com/felixaveiro/ubuzima-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/felixaveiro/ubuzima-hub/discussions)
- **Email**: [felix@vitascope.rw](mailto:felix@vitascope.rw)

## 📋 Roadmap

### **Phase 1: Foundation** ✅
- [x] Core dashboard implementation
- [x] AI insights integration  
- [x] Basic data visualization
- [x] Mobile responsiveness

### **Phase 2: Enhancement** 🚧
- [ ] Real-time data sync
- [ ] Advanced ML models
- [ ] Geographic mapping
- [ ] Report generation

### **Phase 3: Scale** 📋
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Advanced analytics
- [ ] Integration APIs

## 🏆 Hackathon Context

**Event**: Rwanda's 2025 Big Data Hackathon  
**Track**: Track 2 - Ending Hidden Hunger  
**Challenge**: Combat micronutrient deficiencies and malnutrition using data-driven approaches  
**Impact**: Targeting Rwanda's goal to reduce stunting from 38% to 25% by 2030

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ministry of Health Rwanda** - Health sector guidance
- **NISR (National Institute of Statistics Rwanda)** - Data provision
- **WFP Rwanda** - Nutrition expertise  
- **UNICEF Rwanda** - Child nutrition insights
- **Rwanda's ICT Ministry** - Technical support

## 📞 Contact

**Project Maintainer**: Felix Bikorimana  
**Portfolio**: [https://rugangazi.netlify.app/](https://rugangazi.netlify.app/)  
**Email**: [bikofelix2020@gmail.com](mailto:bikofelix2020@gmail.com)  
**LinkedIn**: [Felix Bikorimana](https://www.linkedin.com/in/felix-bikorimana-1972ba261/)  
**GitHub**: [@felixaveiro](https://github.com/felixaveiro)  
**Phone**: +250780941222

---

<div align="center">
  <strong>🇷🇼 Building a Malnutrition-Free Rwanda Through Data Intelligence 🇷🇼</strong>
  <br />
  <br />
  <em>Made with ❤️ for Rwanda's 2025 Big Data Hackathon</em>
</div>
