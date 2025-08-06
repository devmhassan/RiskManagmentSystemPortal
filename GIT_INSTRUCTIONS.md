# Git Instructions for Risk Management Project

## Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/abdelrhmanabdelslam/RiskManagement.git
cd RiskManagement
```

2. Install dependencies:
```bash
npm install
```

## Development Workflow

### 1. Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- Feature branches - `feature/feature-name`
- Bug fix branches - `fix/bug-name`

### 2. Starting New Work

Create a new branch from develop:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 3. Making Changes

1. Make your changes in the feature branch
2. Stage your changes:
```bash
git add .
```

3. Commit your changes:
```bash
git commit -m "type(scope): descriptive message"
```

Commit Message Format:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc)
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

### 4. Keeping Your Branch Updated

```bash
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop
```

### 5. Pushing Changes

```bash
git push origin feature/your-feature-name
```

### 6. Creating a Pull Request

1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill in the PR template
5. Request reviews from team members

## Important Git Commands

### Check Status
```bash
git status
```

### View Branch History
```bash
git log --oneline --graph --decorate
```

### Discard Local Changes
```bash
git checkout -- filename  # Discard changes in specific file
git reset --hard HEAD    # Discard all changes
```

### Stash Changes
```bash
git stash                # Stash changes
git stash list          # List stashes
git stash pop           # Apply and remove last stash
```

## Best Practices

1. **Commit Often**: Make small, focused commits
2. **Write Clear Messages**: Use descriptive commit messages
3. **Pull Before Push**: Always pull latest changes before pushing
4. **Branch Names**: Use clear, descriptive branch names
5. **Code Review**: Request reviews for all changes
6. **Testing**: Run tests before committing

## GitHub Copilot Usage

### 1. Writing Code with Copilot

- Let Copilot suggest completions as you type
- Press Tab to accept suggestions
- Use Alt+[ and Alt+] to cycle through suggestions
- Press Esc to dismiss suggestions

### 2. Getting Contextual Help

- Write comments describing what you want to do
- Be specific in your comments
- Include expected input/output in comments

### 3. Best Practices with Copilot

- Review all suggestions before accepting
- Verify generated code works as expected
- Test edge cases
- Don't accept sensitive data suggestions
- Use descriptive variable names

### 4. Copilot Command Palette

Access Copilot features:
1. Press Ctrl+Shift+P
2. Type "Copilot"
3. Select from available commands:
   - Toggle Copilot
   - Open Copilot
   - Generate tests
   - Explain code
   - etc.

### 5. Improving Copilot Suggestions

Write better comments by:
- Being specific about requirements
- Including type information
- Mentioning edge cases
- Describing expected behavior
- Using consistent terminology

Example:
```typescript
// Calculate the total risk score
// Input: impact (1-5) and likelihood (1-5)
// Output: risk score (1-25)
// Edge cases: handle invalid inputs (return -1)
function calculateRiskScore(impact: number, likelihood: number): number {
  // Copilot will suggest implementation
}
```
