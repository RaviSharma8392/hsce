# Haryana Shakti College of Education

This monorepo contains the public website and an independent admin portal for Haryana Shakti College of Education, Kanjhawala, Delhi.

## Project structure

- user/ — public website built with React + Vite
- admin/ — admin dashboard built with React + Vite

## Scripts

```bash
npm run install:all
npm run dev:user
npm run dev:admin
npm run build:user
npm run build:admin
npm run lint:user
npm run lint:admin
```

## Local development

- Public website: http://localhost:5173
- Admin portal: http://localhost:5175

The apps are separate projects. Run `npm install` in `user/` and `admin/` (or `npm run install:all` from this folder). Copy each `.env.example` to `.env.local` and set the same Firebase web-app values in both apps before testing authentication or live content.

The admin portal has one full-access Admin sign-in and no staff/principal panels. Register the chosen email at `/admin/register`, verify it, then grant access in Firestore by creating `adminUsers/{uid}` with `role: "principal"`, `active: true`, and the account `email`. Public registration never grants its own role.

## Firebase connection

1. Create a Firebase project.
2. Enable Authentication, Firestore and Storage.
3. Copy `user/.env.example` and `admin/.env.example` to `.env.local` within each app and replace every example value with the Firebase web-app configuration. Configure a restricted unsigned Cloudinary preset in the admin app for notice PDF uploads.

The `user/` and `admin/` apps connect directly to Firebase through their client SDK configuration and can be hosted on Cloudflare Pages. Manage Firestore and Storage security rules in the Firebase Console. Local app code does not deploy or change those rules.

The local `firebase/` deployment folder has been removed. Deleting it does not remove services or rules already deployed in Firebase. Review the live Firestore and Storage rules in the Console and remove any staff access/bootstrap rules there if only the single Admin should retain access.

## Content status

Some contact and principal details are seeded in `user/src/data/collegeDetailsData.js`; verify each item against current official college records. Faculty profiles on the public site come from published Admin records. Review the local notice, committee, and activity fallback content before launch. The site does not invent recognition, affiliation, intake, or approval data.

## Deployment notes

- Deploy the public and admin apps separately to Cloudflare Pages.
- The public site's Admin Login link defaults to `https://office.hscekanjhawala.com/admin/signin` in production and `http://localhost:5175/admin/signin` locally. Set `VITE_ADMIN_PORTAL_URL` only when overriding those destinations.
- Protect the admin app with Firebase Authentication and the configured administrator identity.
- Do not expose secret files or API credentials in either frontend app.
