# Contributors Guide

## 🤝 Contributing to Rift Rewind

Thank you for your interest in contributing to the Rift Rewind AWS Riot Games Hackathon project! This guide will help you get started with development and understand our tooling recommendations.

## 📋 Prerequisites

- **AWS CLI** configured with appropriate permissions
- **Node.js 18+** and **Yarn** package manager
- **Python 3.11+** for Lambda development
- **Riot Games Developer Account** for API access

## 🛠️ Recommended Development Tools

To expedite local development and improve productivity, we recommend these modern CLI tools:

### Essential Tools
- **[fzf](https://github.com/junegunn/fzf)** — Fuzzy finder for command history (`Ctrl+R`) and file search
- **[ripgrep (rg)](https://github.com/BurntSushi/ripgrep)** — Super fast text search across projects
- **[fd](https://github.com/sharkdp/fd)** — User-friendly alternative to `find` command
- **[jq](https://stedolan.github.io/jq/)** — Command-line JSON parser and processor

### Productivity Enhancers
- **[zoxide](https://github.com/ajeetdsouza/zoxide)** — Smarter `cd` command with frecency algorithm
- **[eza](https://github.com/eza-community/eza)** — Modern replacement for `ls` with colors and icons
- **[starship](https://starship.rs/)** — Universal shell prompt (clean + fast)
- **[direnv](https://direnv.net/)** — Per-project environment variables (keeps secrets out of Git)

### Development Environment
- **[tmux](https://github.com/tmux/tmux)** — Terminal multiplexer for splits and session persistence
- **[bat](https://github.com/sharkdp/bat)** — `cat` with syntax highlighting and Git integration
- **[httpie](https://httpie.io/)** — Clean HTTP client for API testing
- **[fx](https://github.com/antonmedv/fx)** — Interactive JSON viewer and processor

### Installation (macOS)
```bash
# Install via Homebrew
brew install fzf ripgrep fd jq zoxide eza starship direnv tmux bat httpie fx

# Configure shell integration
echo 'eval "$(fzf --bash)"' >> ~/.bashrc
echo 'eval "$(zoxide init bash)"' >> ~/.bashrc
echo 'eval "$(starship init bash)"' >> ~/.bashrc
```

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon.git
cd rift-rewind-aws-riot-games-hackathon

# Install dependencies
cd riot-api-cdk && npm install
cd ../rift-rewind-hackathon-aws && yarn install
```

### 2. Local Development
```bash
# Frontend development server
cd rift-rewind-hackathon-aws
yarn dev

# CDK development
cd riot-api-cdk
npx cdk synth  # Validate infrastructure
npx cdk diff   # Check changes
```

### 3. Testing Changes
```bash
# Frontend build test
yarn build

# Lambda function test
cd riot-api-cdk/lambda/riot-api-source
python lambda_function.py
```

## 🔧 Development Workflow

### Branch Strategy
- **main** — Production-ready code
- **feature/*** — New features
- **fix/*** — Bug fixes
- **docs/*** — Documentation updates

### Commit Convention
```bash
feat: add new REST constraint demo
fix: resolve TypeScript compilation errors
docs: update API documentation
refactor: optimize Lambda cold start performance
```

### Pull Request Process
1. Fork the repository
2. Create feature branch from `main`
3. Make changes with proper commit messages
4. Test locally (frontend build + CDK synth)
5. Submit PR with detailed description
6. Address review feedback
7. Merge after approval

## 🧪 Testing Guidelines

### Frontend Testing
```bash
# Type checking
yarn type-check

# Build validation
yarn build

# Local preview
yarn preview
```

### Infrastructure Testing
```bash
# CDK validation
npx cdk synth --quiet

# Security scan
gitleaks detect --source . --verbose
```

### API Testing
```bash
# Test Lambda locally
cd riot-api-cdk/lambda/riot-api-source
python -c "from lambda_function import lambda_handler; print(lambda_handler({}, {}))"

# Test API endpoints
http GET https://your-lambda-url.lambda-url.us-east-2.on.aws/challenger
```

## 🔒 Security Best Practices

### Secret Management
- **Never commit API keys** — Use SSM Parameter Store
- **Use direnv** — Keep local secrets in `.envrc` (gitignored)
- **Scan before commit** — Run `gitleaks detect` locally

### Example `.envrc`
```bash
# Local development environment
export RIOT_API_KEY="RGAPI-your-development-key"
export AWS_PROFILE="your-dev-profile"
export AWS_REGION="us-east-2"
```

## 📁 Project Structure

```
rift-rewind-aws-riot-games-hackathon/
├── rift-rewind-hackathon-aws/     # React frontend
│   ├── src/components/            # UI components
│   ├── src/services/             # API services
│   └── dist/                     # Build output
├── riot-api-cdk/                # AWS infrastructure
│   ├── lib/                     # CDK stacks
│   └── lambda/                  # Lambda functions
├── .github/workflows/           # CI/CD pipeline
└── docs/                       # Documentation
```

## 🎯 Contribution Areas

### Frontend Enhancements
- Additional REST constraint demonstrations
- UI/UX improvements with Cloudscape components
- Performance optimizations
- Accessibility improvements

### Backend Improvements
- New Riot API integrations
- Lambda performance optimizations
- Error handling enhancements
- Monitoring and observability

### Infrastructure
- Cost optimization strategies
- Security hardening
- Multi-region deployment
- Automated testing

### Documentation
- API documentation
- Architecture diagrams
- Tutorial content
- Best practices guides

## 🐛 Issue Reporting

When reporting issues, please include:
- **Environment details** (OS, Node version, AWS region)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Error messages** and logs
- **Screenshots** if applicable

## 💡 Feature Requests

For new features, please provide:
- **Use case description**
- **Proposed implementation**
- **Impact assessment**
- **Alternative solutions considered**

## 📞 Getting Help

- **GitHub Issues** — Bug reports and feature requests
- **GitHub Discussions** — Questions and community support
- **AWS Builder Profile** — [@bryanChasko](https://builder.aws.com/community/@bryanChasko)

## 🏆 Recognition

Contributors will be recognized in:
- Project README
- AWS Builder Center articles
- Conference presentations
- Community showcases

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy coding!** 🚀 Let's build something amazing together.