# Claude Code Examples Repository

A collection of demonstration projects showcasing Claude Code's capabilities in software development, testing, security analysis, and code review.

## 🎯 Purpose

This repository contains multiple example projects that demonstrate how Claude Code can be effectively used for various engineering tasks. Each project folder represents a different technology stack or use case.

## 📁 Projects

### Next.js Full-Stack Demo (`nextjs/`)
A comprehensive full-stack demonstration application showcasing Claude Code's capabilities in modern web development with AI agent collaboration.

**Technologies:** Next.js 15, React 19, TypeScript, Material-UI, FastAPI, SQLite, SQLAlchemy

**Features:**
- Professional indigo/purple design system
- User management system with CRUD operations
- Interactive API documentation
- AI agent collaboration showcase (Frontend, Backend, Testing)
- Full-stack integration with real-time data
- Responsive design with glassmorphism effects

### Backend Python Agent (`backend-python-agent/`)
A specialized agent configuration for backend development with Python, MySQL, and AWS integration. Includes comprehensive examples for building production-ready, scalable backend systems.

**Technologies:** Python 3.9+, FastAPI, SQLAlchemy, MySQL, Redis, Celery, AWS Services, Docker

### [More projects coming soon...]

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (for JavaScript/TypeScript projects)
- Git
- A code editor (VS Code recommended)

### Installation & Running Projects

Each project has its own dependencies and setup. Navigate to the specific project folder and follow these general steps:

#### For Next.js Full-Stack Project

```bash
# Navigate to the Next.js project
cd nextjs

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Run both frontend and backend concurrently
# Terminal 1 - Frontend (Next.js)
npm run dev

# Terminal 2 - Backend (FastAPI)
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Access Points:**
- Frontend Application: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Interactive API Docs: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

**Features to Explore:**
- Home page with live demo sections
- User management with search and filtering
- API documentation with live testing
- AI agents showcase page

#### General Pattern for Node.js Projects

```bash
# Navigate to project folder
cd [project-name]

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run development server (check package.json for specific scripts)
npm run dev

# Run tests if available
npm test

# Build project
npm run build
```

## 📖 Documentation

- Each project contains its own README.md with specific instructions
- See `Claude.md` for Claude Code-specific context and guidelines
- Check individual project folders for technology-specific documentation

## 🧪 Testing

Testing approaches vary by project:

- **Next.js**: Uses Jest and React Testing Library (when configured)
- Additional testing frameworks will be documented as projects are added

## 🔒 Security

These are demonstration projects. While they follow security best practices, they should not be deployed to production without proper security review.

## 🤝 Contributing

This is a personal demonstration repository. Feel free to fork and create your own examples!

## 📝 Claude Code Usage

When using Claude Code with this repository:

1. Claude Code will recognize the `Claude.md` file for context
2. Each project folder is treated as an independent project
3. Claude Code will follow project-specific conventions and patterns
4. Use Claude Code for:
   - Feature development
   - Bug fixes
   - Testing
   - Code reviews
   - Security analysis
   - Documentation updates

## 🛠️ Development Workflow

1. Choose a project folder to work in
2. Install dependencies for that specific project
3. Use Claude Code to assist with development tasks
4. Test changes locally
5. Review code with Claude Code before finalizing

## ☁️ Deployment

### Vercel Deployment (Next.js Frontend Only)

The Next.js application is ready for deployment to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
cd nextjs
vercel

# Or deploy with build command
vercel --build-env NODE_ENV=production
```

**Note:** The FastAPI backend will need to be deployed separately to a platform like Railway, Render, or AWS. Update the frontend API URLs accordingly.

### Local Production Build

```bash
cd nextjs
npm run build
npm start
```

## 📌 Notes

- Each demonstration project is self-contained
- Projects may use different package managers (npm, yarn, pnpm)
- Check individual project README files for specific requirements
- The Next.js demo includes both frontend and backend components
- For production deployment, consider separating frontend and backend services

## 🚦 Project Status

| Project | Status | Description |
|---------|--------|-------------|
| Next.js Full-Stack | ✅ Active | Complete demo with AI agents, user management, API docs |
| Backend Python Agent | ✅ Active | Specialized agent for Python backend development with AWS |
| [TBD] | 🔜 Planned | Additional demonstrations coming soon |

---

*This repository is specifically designed to showcase Claude Code capabilities across different engineering scenarios.*