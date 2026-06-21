---
name: feature-development-workflow
description: >-
  An end-to-end orchestration skill that guides the agent through professional codebase exploration, extensible architecture design, implementation, and autonomous quality review for major feature development.
---

# Feature Development Workflow

## Overview
This skill acts as a Standard Operating Procedure (SOP) for developing major features or epics. It ensures that the agent follows a highly professional, autonomous workflow involving thorough codebase exploration, robust architectural planning, coding, and self-directed quality review. It minimizes unnecessary interruptions by independently resolving minor bugs and architecture gaps.

## Dependencies
None. This skill orchestrates native agent capabilities (file reading, writing, searching, and artifact creation).

## Quick Start
To trigger this skill, the user should provide a prompt like:
"Use the feature-development-workflow to build a new payment processing module."

## Workflow

### 1. Codebase Exploration
- **Action**: Autonomously explore the repository using tools like `grep_search`, `list_dir`, and `view_file` to map out dependencies and existing patterns.
- **Guidance**: Act as a senior engineer. Do **not** stop to ask the user for basic contextual guidance. If architectural patterns are unclear, use professional judgment to assume and propose an extensible design based on industry best practices.

### 2. Architecture Design
- **Action**: Formulate a robust, modular design plan for the new feature.
- **Output**: Create an `implementation_plan.md` artifact detailing the proposed changes, the overarching design pattern, and the strategy for ensuring future maintainability. Use diagrams (like Mermaid) if they add clarity.
- **Guidance**: Focus on a "good design architecture flow" so that future problems can be easily solved. Present this plan to the user for final approval before writing significant code.

### 3. Implementation
- **Action**: Execute the approved implementation plan. Write the necessary code, tests, and configuration files.
- **Guidance**: Break down the work into logical steps and update a `task.md` artifact to track progress. Maintain high coding standards and preserve existing documentation.

### 4. Quality Review
- **Action**: Independently review the newly written code for linting errors, logical bugs, and security flaws.
- **Guidance**: You must proactively and automatically fix minor flaws and bugs without asking for permission. 
- **Escalation**: You may **only** pause to ask the user for guidance if you discover a "big bug" — a critical issue that requires a major architectural rewrite or significantly impacts the project scope.

### 5. Finalization
- **Action**: Create a `walkthrough.md` summarizing the changes made and the verification results. 
- **Bonus**: If applicable, push the code to a new branch and open a Pull Request.

## Common Mistakes
- **Asking Too Many Questions**: Do not bother the user with trivial questions during codebase exploration or for minor bug fixes. Handle them autonomously.
- **Skipping Architecture Design**: Jumping straight into coding without a clear, documented, and extensible design will lead to technical debt. Always plan first.
- **Silent Failures**: If a "big bug" is found during the quality review, failing to escalate it properly to the user can result in merged flawed logic.
