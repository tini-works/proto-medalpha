# AGENTS.md instructions for /Users/apple/Desktop/proto-medalpha

<INSTRUCTIONS>
## Project Context
I'm a product designer. I'm going to build a prototype to visualize the solution for docs/requirement/REQUIREMENT.md. I don't know and don't care about code. I will focus only on UI and UX perspective to ensure the quality of solution serves the best for the user.

## Anti-Goals
- Do not implement production code or refactors unless explicitly requested.
- Do not make backend, API, or architecture decisions beyond what is required for UX context.
- Do not expand scope beyond docs/requirement/REQUIREMENT.md without approval.
- Do not prioritize technical deliverables (tests, builds, infra) over UI/UX outcomes.
- Do not default to generic UI patterns or bland aesthetics; keep the prototype design-led.

## Superpowers System

<EXTREMELY_IMPORTANT>
You have superpowers. Superpowers teach you new skills and capabilities. RIGHT NOW run: `~/.codex/superpowers/.codex/superpowers-codex bootstrap` and follow the instructions it returns.
</EXTREMELY_IMPORTANT>

<EXTREMELY_IMPORTANT>
Always use /superpowers:brainstorming to get started the session, no matter what the question is.
</EXTREMELY_IMPORTANT>

## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills that can be used. Each entry includes a name, description, and file path so you can open the source for full instructions when using a specific skill.
When a skill exists in this repo under `.codex/skills/<name>/SKILL.md`, use that file directly instead of global `~/.codex/skills` copies.
### Available skills
- change-request-impact-solutions: Use when analyzing a change request (CR) from a provided file path, explaining the problem space, checking a sitemap and userflow inventory for IA impact, and producing at least three solution alternatives in a single HTML file for review. (file: /Users/apple/.codex/skills/change-request-impact-solutions/SKILL.md)
- frontend-design: Use when building web components, pages, or apps and you need distinctive, production-grade interfaces that avoid generic AI aesthetics while delivering cohesive, working code. (file: /Users/apple/.codex/skills/frontend-design/SKILL.md)
- userflow: Use when generating user flow diagrams in D2 for JTBD ideation, CR approval, or current app inventory - outputs .d2 files only, with screen labels matching the sitemap and English action labels. (file: /Users/apple/.codex/skills/userflow/SKILL.md)
- skill-creator: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Codex's capabilities with specialized knowledge, workflows, or tool integrations. (file: /Users/apple/.codex/skills/.system/skill-creator/SKILL.md)
- skill-installer: Install Codex skills into $CODEX_HOME/skills from a curated list or a GitHub repo path. Use when a user asks to list installable skills, install a curated skill, or install a skill from another repo (including private repos). (file: /Users/apple/.codex/skills/.system/skill-installer/SKILL.md)
### How to use skills
- Discovery: The list above is the skills available in this session (name + description + file path). Skill bodies live on disk at the listed paths.
- Trigger rules: If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill's description shown above, you must use that skill for that turn. Multiple mentions mean use them all. Do not carry skills across turns unless re-mentioned.
- Missing/blocked: If a named skill isn't in the list or the path can't be read, say so briefly and continue with the best fallback.
- How to use a skill (progressive disclosure):
  1) After deciding to use a skill, open its `SKILL.md`. Read only enough to follow the workflow.
  2) If `SKILL.md` points to extra folders such as `references/`, load only the specific files needed for the request; don't bulk-load everything.
  3) If `scripts/` exist, prefer running or patching them instead of retyping large code blocks.
  4) If `assets/` or templates exist, reuse them instead of recreating from scratch.
- Coordination and sequencing:
  - If multiple skills apply, choose the minimal set that covers the request and state the order you'll use them.
  - Announce which skill(s) you're using and why (one short line). If you skip an obvious skill, say why.
- Context hygiene:
  - Keep context small: summarize long sections instead of pasting them; only load extra files when needed.
  - Avoid deep reference-chasing: prefer opening only files directly linked from `SKILL.md` unless you're blocked.
  - When variants exist (frameworks, providers, domains), pick only the relevant reference file(s) and note that choice.
- Safety and fallback: If a skill can't be applied cleanly (missing files, unclear instructions), state the issue, pick the next-best approach, and continue.
</INSTRUCTIONS>
