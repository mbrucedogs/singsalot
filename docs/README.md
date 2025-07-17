# 📄 Documentation & Reference Models

This `/docs` folder contains **Product Requirements Documents (PRD)**, **data model definitions**, and **Firebase schema references** for the Karaoke Web App project.

These files are intended for:
- 📃 Developers reviewing the business logic and architecture.
- 🤖 AI tools like Cursor or Copilot that reference documentation for context-aware coding.
- 📝 Project planning, architecture decisions, and future enhancements.

---

## Contents

| File | Purpose |
|------|---------|
| `PRD.md` | Primary Product Requirements Document — outlines business goals, functional specs, UI/UX notes, and data access model. |
| `types.ts` | Reference TypeScript interfaces used for modeling app objects. **Not imported into app runtime code.** |
| `firebase_schema.json` | Example Firebase Realtime Database structure for understanding data relationships and CRUD operations. |

---

## Important Notes
- ✅ These files are **not intended for direct import or use in application runtime**.
- ✅ Validation logic and data models here serve as **development references only**.
- ✅ Any updates to business logic, data flow, or app architecture should be reflected here for documentation purposes.
- ✅ AI tools may use this information to assist with code generation but will not access `/src` directly.

---

## How to Use
- Developers can reference these files during implementation, especially when defining CRUD operations or integrating Firebase sync.
- When using AI-assisted development tools, ensure they have access to the `/docs` folder for accurate context.

---

_If in doubt, assume these files are **guides, not code.**_

