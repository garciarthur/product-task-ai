# Product Task AI

Product Task AI is a lightweight product management tool designed to transform product problems, needs and improvement ideas into structured development tasks.

The application receives a product need as input and organizes it into a task containing:

- Title
- Description
- Objective
- Acceptance criteria

The project is currently being developed as a learning and product-building experiment focused on Product Management, AI experiences and modern SaaS interfaces.

---

## Overview

Product Managers and Product Owners often receive problems in an unstructured format:

> "The agent filter on the dashboard is not working correctly."

Before sending this problem to a development team, it usually needs to be translated into a clearer structure.

Product Task AI helps transform that raw input into something closer to:

### Title

Fix agent filtering on the Dashboard

### Description

The Dashboard agent filter is not correctly displaying or filtering the agents associated with the selected project.

### Objective

Allow users to correctly filter Dashboard information by the agents belonging to the selected project.

### Acceptance Criteria

- The agent filter must display agents associated with the selected project.
- Selecting an agent must update the relevant Dashboard information.
- The filtering behavior must work consistently across supported projects.

The user can then review the generated content before using it in their product workflow.

---

## Current Features

- Product problem input
- Structured task generation
- Title generation
- Description generation
- Objective generation
- Acceptance criteria generation
- Result preview
- Regenerate task
- Copy task
- Start a new task
- Loading state
- Success state
- Error state
- Retry generation
- Backend availability check
- Responsive interface
- Custom Design System
- Disabled states and contextual tooltips
- Human-in-the-loop review before using the generated task

---

## Product Flow

The current flow is:

```text
Product problem
      ↓
Task generation
      ↓
Structured result
      ↓
User review
      ↓
Copy task
