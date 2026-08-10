---
name: conventional-commit
description: Create well-formatted conventional commits following the Conventional Commits specification. Use when the user asks to commit changes, create a commit, or needs help with commit messages.
allowed-tools: Bash, Read, Grep
---

# Conventional Commit Skill

This skill helps create well-formatted commits following the [Conventional Commits specification](https://www.conventionalcommits.org/).

For this repository, prefer commit messages that reflect changes in the
ServiceNow bug design, shared support metadata, and GitHub instructions.

## When to Use

- User asks to "commit" or "create a commit"
- User requests help with commit messages
- User mentions "conventional commits"
- After completing code changes and user wants to save them

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature for the user
- **fix**: Bug fix
- **docs**: Documentation only changes (see note below)
- **style**: Changes that don't affect code meaning (formatting, whitespace)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or correcting tests
- **chore**: Changes to build process or auxiliary tools
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes affecting build system or dependencies
- **revert**: Reverts a previous commit

#### docs vs feat: Choosing the Right Type

The choice between `docs` and `feat` depends on **what the repository delivers to users**:

| Repository Type                               | Documentation Changes      | Use Type |
| --------------------------------------------- | -------------------------- | -------- |
| Code project (app, library, API)              | README, comments, API docs | `docs`   |
| Documentation site (MkDocs, Docusaurus, etc.) | User-facing content pages  | `feat`   |

**Key principle**: If documentation IS the product (like this repo), then
changes to the published design content under `service_now/` are usually
`feat`. Use `docs` for meta-documentation such as README updates, skill
instructions, Copilot guidance, or contributor-facing files.

**Examples for documentation repositories:**

- `feat: add authentication API reference` - new user-facing docs
- `feat: update getting started guide` - improving user content
- `docs: update CONTRIBUTING.md` - meta-docs for contributors
- `docs: fix typo in README` - not user-facing content

### Scope

Optional component/module/area affected (e.g., `auth`, `api`, `ui`, `parser`)

For this repo, prefer concise scopes such as:

- `bug`
- `routing`
- `table`
- `support-org`
- `docs`
- `github`
- `ci`

### Description

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Maximum 50 characters
- Focus on WHY, not WHAT

### Body

- Wrap at 72 characters
- Explain the motivation for the change
- Contrast with previous behavior
- Separate from description with blank line
- Use a multiline body only when it adds clarity; simple commits can
  stay subject-only
- For repo docs and design changes, bullets are preferred for grouped
  details

### Footer

- Reference issues: `Closes #123` or `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

## Process

1. **Analyze Changes**
   - Run `git status` to see modified files
   - Run `git diff --staged` to see staged changes (or `git diff` for unstaged)
   - Run `git log --oneline -5` to see recent commit style
   - Prioritize files under `service_now/`, `support-organization/`, and `.github/`

2. **Determine Type & Scope**
   - Identify primary change type from the list above
   - Determine affected scope (component/module) if applicable
   - Keep scope concise (1-2 words)
   - Use `feat` for published design content and `docs` for meta-docs

3. **Write Description**
   - Focus on the purpose/reason for changes
   - Use imperative mood ("add feature" not "added feature")
   - Keep under 50 characters
   - Don't mention what files changed (that's in the diff)

4. **Add Body (if needed)**
   - Complex changes need explanation
   - Explain WHY, not WHAT
   - Wrap at 72 characters

5. **Create Commit**
   - Use heredoc for multi-line messages:

   ```bash
   git commit -m "$(cat <<'EOF'
   type(scope): description

   Optional body explaining why this change was needed.
   Wrap at 72 characters for readability.

   Closes #123
   EOF
   )"
   ```

## Examples

### Simple Feature

```
feat(routing): refine bug routing matrix
```

### Bug Fix with Body

```
fix(table): prevent invalid routing seed values

The seed data was missing validation for optional fields before
generation, which could produce invalid routing records.

Fixes #456
```

### Documentation

```
docs(github): update copilot instructions
```

### Breaking Change

```
feat(bug): change bug intake taxonomy

BREAKING CHANGE: The bug routing taxonomy now uses a different
grouping model. Existing design references and routing mappings
must be updated to match the new structure.
```

### Chore

```
chore(support-org): refresh team metadata
```

## Automated Validation

This project uses **gitlint** to automatically validate commit messages against conventional commit standards. The validation runs as a pre-commit hook configured in `.pre-commit-config.yaml`.

**Gitlint Configuration:**

- Automatically checks commit messages before they are created
- Enforces conventional commit format
- Prevents commits with malformed messages
- See [gitlint documentation](https://jorisroovers.com/gitlint/0.19.x/commit_hooks/) for details

**Pre-commit Hook:**

```yaml
- repo: https://github.com/jorisroovers/gitlint
  rev: v0.19.1
  hooks:
    - id: gitlint
```

If your commit message fails gitlint validation, you'll see an error message explaining what needs to be fixed. Common issues include:

- Title too long (>50 characters)
- Missing type prefix (feat, fix, etc.)
- Incorrect format
- Body lines exceeding 72 characters

## Important Rules

1. **NEVER mention Copilot or Copilot CLI** in commit messages
2. **Keep commits atomic** - one logical change per commit
3. **Focus on purpose** - explain why, not what changed
4. **Be concise** - description ≤50 chars, body wrapped at 72 chars
5. **Use imperative mood** - "add", "fix", "update" (not "added", "fixed", "updated")
6. **Stage relevant files first** - ensure only intended changes are committed
7. **Commit messages are validated automatically** - gitlint will reject malformed messages
8. **Use multiline bodies selectively** - add one only when it explains
   scope, rationale, or impact better than the title alone

## Workflow

When user requests a commit:

1. Check what files are changed: `git status`
2. Review the actual changes: `git diff --staged` (or `git diff`)
3. Review recent commits for style: `git log --oneline -5`
4. Analyze changes to determine type, scope, and purpose
5. Generate conventional commit message
6. Stage any unstaged files if needed: `git add <files>`
7. Create the commit with generated message
8. Confirm with `git log -1` or `git status`

## Reference

For complete specification, see [conventionalcommits.org](https://www.conventionalcommits.org/)
