---
name: project-analyzer
description: Quickly understand and analyze project structure, architecture, technology stack, and configuration. Use this skill whenever the user asks to understand a project, analyze project structure, explore codebase, generate project documentation, get an overview of the tech stack, or needs any kind of project analysis. Even if the user doesn't explicitly say "analyze," trigger this skill when they want to understand what a project does, how it's organized, or what technologies it uses.
---

This skill helps users quickly understand and document software projects by analyzing their structure, architecture, technology stack, and configuration files.

When this skill triggers, the user wants to understand a project - they may be new to the codebase, need to onboard someone else, or want to create documentation.

## Analysis Workflow

Follow this systematic approach to analyze the project:

### 1. Initial Discovery

Start by gathering basic information about the project:
- **Project type detection**: Use `ls` and file patterns to identify the project (web, mobile, backend, data science, etc.)
- **Key configuration files**: Look for `package.json`, `requirements.txt`, `pom.xml`, `build.gradle`, `Cargo.toml`, `go.mod`, `composer.json`, etc.
- **Read critical files**: Check for README.md, CONTRIBUTING.md, .gitignore, and any documentation files
- **Directory structure**: Use `ls -la` and explore the top-level directory structure

### 2. Architecture Analysis

Analyze the project's organization and structure:
- **Code organization**: Identify how the code is structured (MVC, modular, microservices, monorepo, etc.)
- **Key directories**: Understand the purpose of major directories (src, app, lib, tests, docs, config, etc.)
- **Entry points**: Find the main entry files (index.js, main.py, App.java, etc.)
- **Module boundaries**: Understand how different modules or components are separated
- **Dependency patterns**: Identify how modules interact with each other

Use Glob patterns to find key files:
- `**/*.json` - configuration files
- `**/*.md` - documentation files
- `src/**/*` - source code
- `**/*.config.*` - build/config files
- `Dockerfile`, `docker-compose.yml` - containerization

### 3. Technology Stack Analysis

Identify and document all technologies used:

**Programming Languages**: From file extensions and configuration files
- JavaScript/TypeScript: .js, .ts, .jsx, .tsx, package.json, tsconfig.json
- Python: .py, requirements.txt, setup.py, pyproject.toml
- Java: .java, pom.xml, build.gradle
- Go: .go, go.mod
- Rust: .rs, Cargo.toml
- Ruby: .rb, Gemfile
- PHP: .php, composer.json
- C#: .cs, .csproj, .sln
- Swift: .swift, Package.swift

**Frameworks and Libraries**: Read configuration files to extract dependencies
- Frontend: React, Vue, Angular, Svelte, Next.js, Express, etc.
- Backend: Spring, Django, Flask, Rails, FastAPI, etc.
- Testing: Jest, PyTest, JUnit, RSpec, etc.
- Build tools: Webpack, Vite, Gradle, Maven, etc.

**Infrastructure and DevOps**:
- Containerization: Docker, Kubernetes
- CI/CD: GitHub Actions, GitLab CI, Jenkins, CircleCI
- Databases: From ORM configs and migration files
- Cloud services: From deployment configs

### 4. Configuration Analysis

Analyze all configuration and setup files:
- **Build configuration**: webpack.config.js, vite.config.js, tsconfig.json, etc.
- **Environment configuration**: .env files, environment variables
- **Testing configuration**: jest.config.js, pytest.ini, etc.
- **Linting and formatting**: .eslintrc, .prettierrc, pylintrc, etc.
- **Dependencies**: Check production vs development dependencies
- **Scripts**: Available npm/yarn/pip scripts

### 5. Generate Output

Provide both a conversational summary AND a comprehensive Markdown report.

**Conversational Summary**:
Keep it concise (2-3 paragraphs) and highlight:
- What type of project this is
- Main technologies and frameworks
- Key architectural patterns
- Quick overview of the structure

**Markdown Report**:

Create a detailed `PROJECT_ANALYSIS.md` file using this structure:

```markdown
# Project Analysis Report

## Project Overview
[Project name, purpose, and type]

## Technology Stack

### Programming Languages
- [Language 1] - [Usage context]
- [Language 2] - [Usage context]

### Frameworks & Libraries
- [Framework] - [Version if available, usage]
- [Library] - [Usage context]

### Build & DevTools
- [Tool 1] - [Purpose]
- [Tool 2] - [Purpose]

### Testing
- [Testing framework] - [Coverage/type]
- [Additional testing tools]

### Infrastructure
- [Containerization]
- [CI/CD]
- [Databases]
- [Cloud services]

## Project Architecture

### Directory Structure
```
[Show simplified tree of important directories]
```

### Architectural Patterns
- [Pattern 1] - [Description]
- [Pattern 2] - [Description]

### Key Modules/Components
- [Module 1] - [Purpose]
- [Module 2] - [Purpose]

### Entry Points
- [Entry point file] - [Description]

## Configuration

### Build Configuration
- [Key build settings and configurations]

### Environment Variables
- [Important environment variables]

### Scripts
- `npm run [script]` - [Description]

## Dependencies

### Production Dependencies
[List key dependencies with their purposes]

### Development Dependencies
[List key dev dependencies]

## Notable Patterns & Conventions
- [Code patterns]
- [Naming conventions]
- [File organization style]
```

## Best Practices

- **Use available tools efficiently**: Use Glob, Grep, and Read in parallel when possible
- **Prioritize information**: Start with README and config files for quick context
- **Be systematic**: Follow the workflow steps consistently
- **Adapt depth**: Adjust analysis depth based on project size (smaller projects = more detail, larger projects = focus on key areas)
- **Verify assumptions**: Use Grep to confirm technology usage when unsure
- **Document uncertainty**: If something is unclear, mention it rather than guessing

## Common Project Patterns

Recognize these common patterns:

**Monorepo**: Multiple packages in one repo (lerna, nx, Turborepo)
- Look for `packages/`, `apps/` directories
- Check for workspace configs

**Microservices**: Multiple independent services
- Separate `service-*/` directories
- Multiple Dockerfiles
- API gateways or service meshes

**Monolith**: Single application
- Single entry point
- Centralized routing
- Shared database

**Component Library**: UI component collection
- Storybook configuration
- Component directories
- Examples/demos

**API-first**: API with separate clients
- OpenAPI/Swagger specs
- Client SDK directories
- API versioning

## When to Deepen Analysis

Provide more detailed analysis for:
- Projects with complex architecture (microservices, event-driven, etc.)
- Projects with unusual technology choices
- Large codebases where understanding structure is critical
- Projects being migrated or refactored

Keep analysis high-level for:
- Small, straightforward projects
- Well-documented projects with existing good documentation
- Quick overviews for onboarding

Remember: The goal is to help users understand the project quickly and accurately, not to create exhaustive documentation. Focus on insights that matter for understanding how the project works and how to work with it.
