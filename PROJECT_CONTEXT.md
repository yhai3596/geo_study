# GEO Learning Platform - Project Context

## Project Overview
A React-based educational platform focused on geography learning with interactive features, case studies, and learning resources.

## Technology Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui integration
- **Package Manager**: npm
- **Linting**: ESLint

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── error-boundary.tsx
│   └── layout/          # Layout components
├── contexts/            # React contexts
│   └── LearningContext.tsx
├── hooks/              # Custom React hooks
│   └── use-mobile.tsx
├── lib/                # Utility functions
│   └── utils.ts
├── pages/              # Page components
│   ├── CaseStudiesPage.tsx
│   ├── HomePage.tsx
│   ├── LearningPathsPage.tsx
│   ├── ProfilePage.tsx
│   ├── ResourceDetailPage.tsx
│   ├── ResourcesPage.tsx
│   └── ToolsPage.tsx
└── App.tsx             # Main application component

public/
└── data/               # Static data files
    ├── case_studies/
    ├── charts/
    ├── learning_guides/
    ├── learning_resources/
    └── tools_templates/
```

## Core Features
1. **Home Page** - Landing page with platform overview
2. **Learning Paths** - Structured learning journeys
3. **Resources** - Educational materials and content
4. **Case Studies** - Real-world geography examples
5. **Tools** - Interactive learning tools
6. **Profile** - User profile and progress tracking

## Key Components
- **LearningContext**: Global state management for learning data
- **ErrorBoundary**: Error handling and fallback UI
- **Layout Components**: Consistent page structure
- **Mobile Hook**: Responsive design utilities

## Configuration Files
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui component configuration
- `eslint.config.js` - ESLint rules

## Data Structure
Static data is organized in `/public/data/` with separate folders for:
- Case studies
- Charts and visualizations
- Learning guides
- Educational resources
- Tools and templates

## Development Status
- ✅ Basic project structure established
- ✅ Core pages created
- ✅ Context and hooks setup
- ✅ Error boundary implementation
- 🔄 Content and data population needed
- 🔄 Component implementation in progress
- 🔄 Styling and responsive design

## Next Steps
1. Implement page components with actual content
2. Populate data files with educational content
3. Add routing and navigation
4. Implement interactive features
5. Add user authentication and progress tracking
6. Optimize performance and accessibility

## Important Notes
- Uses npm package management
- Follows TypeScript strict mode
- Implements error boundaries for robust error handling
- Designed with mobile-first responsive approach
- Modular component architecture for scalability

---
*Last updated: Current session*
*For new conversations, reference this file to understand project context*