# Flowky ⚡️

Flowky is a modern, full-stack project management and collaboration platform built to help teams organize tasks, manage projects, and collaborate efficiently. Inspired by the best agile productivity tools, Flowky offers a seamless Kanban-style interface, comprehensive views, and robust real-time capabilities to streamline workflows.

## 🌟 Key Features

- **Workspaces & Projects**: Create isolated workspaces for different teams and organize work into dedicated projects.
- **Visual Kanban Boards**: Intuitive drag-and-drop task management to track progress across different stages.
- **Task Management Engine**: Create, edit, and track tasks with robust metadata—including priorities, assignees, statuses, and due dates.
- **Powerful Data Views**: Switch seamlessly between Kanban boards, structured Data Tables, and interactive Calendar views.
- **Team Collaboration**: Invite members via unique codes, manage roles, and assign tasks contextually.
- **Real-time Analytics**: Built-in dashboards with visual charts to track project velocity, tasks completion, and team productivity.
- **Authentication**: Secure email/password login integrated with OAuth providers (Google, GitHub).
- **Responsive & Themed**: Fully responsive design with an elegant Light/Dark mode toggle.

## 💻 Tech Stack

Flowky is built with modern, cutting-edge web technologies to ensure a scalable, type-safe, and highly responsive experience.

### Core Frameworks
- **[Next.js 16 (App Router)](https://nextjs.org/)**: React framework for server-side rendering, routing, and static generation.
- **[React 19](https://react.dev/)**: The library for web and native user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: Static typing for robust JavaScript development.

### Backend & Database
- **[Hono](https://hono.dev/)**: Ultrafast, lightweight web framework for the API layer (`app/api/[[...route]]`).
- **[Appwrite](https://appwrite.io/)**: Open-source Backend-as-a-Service providing the Database, Authentication (including OAuth), and Storage capabilities.
- **[node-appwrite](https://github.com/appwrite/sdk-for-node)**: Appwrite Server SDK for secure server-side operations.

### Data Fetching & State Management
- **[TanStack Query (React Query)](https://tanstack.com/query/latest)**: Powerful asynchronous state management, caching, and data synchronization.
- **[Hono RPC](https://hono.dev/docs/guides/rpc)**: Type-safe RPC client linking the frontend to Hono API routes.
- **[nuqs](https://nuqs.47ng.com/)**: URL query state management for React.

### UI, Styling & Components
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework for rapid and responsive styling.
- **[Shadcn UI](https://ui.shadcn.com/)** & **[Radix UI](https://www.radix-ui.com/)**: Beautiful, accessible, and customizable interactive components.
- **[Base UI](https://base-ui.com/)**: Unstyled, accessible UI primitives for robust component foundations.

### Specialized Tools & Libraries
- **Drag & Drop**: [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd) for the interactive Kanban boards.
- **Forms & Validation**: [`react-hook-form`](https://react-hook-form.com/) combined with [`zod`](https://zod.dev/) for type-safe form validation and `@hono/zod-validator` for backend validation.
- **Tables & Data Grids**: [`@tanstack/react-table`](https://tanstack.com/table/latest) for headless, highly customizable data tables.
- **Calendars & Dates**: [`react-big-calendar`](https://github.com/jquense/react-big-calendar), [`react-day-picker`](https://daypicker.dev/), and [`date-fns`](https://date-fns.org/) for managing and displaying task timelines.
- **Charts**: [`recharts`](https://recharts.org/) for beautiful, responsive analytics data visualizations.
- **Icons**: [`lucide-react`](https://lucide.dev/) and [`react-icons`](https://react-icons.github.io/react-icons/) for comprehensive icon sets.
- **Toasts**: [`sonner`](https://sonner.emilkowal.ski/) for elegant, toast-based notifications.

---

## 🚀 Getting Started

Follow these instructions to get a copy of Flowky up and running on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed on your machine:
- **[Bun](https://bun.sh/)** (recommended) or **npm**/**yarn**/**pnpm**.
- An active [Appwrite](https://appwrite.io/) instance (Cloud or Self-Hosted).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/flowky.git
cd flowky
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

### 3. Environment Variables Configuration

Create a `.env` file in the root of your project. You will need to populate it with your specific Appwrite instance details:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"

NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT="your-appwrite-project-id"

# Appwrite Server API Key (Do not expose to the client)
NEXT_APPWRITE_KEY="your-appwrite-secret-api-key"

# Appwrite Database and Collection IDs
NEXT_PUBLIC_APPWRITE_DATABASE_ID="your-database-id"
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID="your-workspaces-collection-id"
NEXT_PUBLIC_APPWRITE_MEMBERS_ID="your-members-collection-id"
NEXT_PUBLIC_APPWRITE_PROJECTS_ID="your-projects-collection-id"
NEXT_PUBLIC_APPWRITE_TASKS_ID="your-tasks-collection-id"
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID="your-storage-bucket-id"
```

### 4. Run the Development Server

Start the local development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will automatically reload if you change any of the source files.

---

## 📂 Project Structure Overview

```text
flowky/
├── app/                    # Next.js App Router root
│   ├── (auth)/             # Authentication pages (sign-in, sign-up)
│   ├── (dashboard)/        # Protected dashboard & workspace routes
│   ├── (standalone)/       # Standalone specific views (e.g., invites)
│   ├── api/[[...route]]/   # Hono aggregated API route handler
│   └── oauth/              # OAuth callback routes
├── components/             # Global, reusable React components
│   └── ui/                 # Shadcn UI base components
├── config/                 # App configurations (e.g. environment definitions)
├── features/               # Domain-driven feature modules (Auth, Workspaces, Projects, Tasks, Members)
│   ├── api/                # TanStack query custom hooks for client-side fetching
│   ├── components/         # Feature-specific components
│   ├── server/             # Hono backend route handlers specific to the domain
│   └── types.ts/schemas.ts # Types and zod validation schemas
├── hooks/                  # Global custom React utility hooks
├── lib/                    # Core utilities (Appwrite clients, RPC initialization, session management)
└── public/                 # Static assets
```

## 🛠️ Scripts

- `bun run dev` - Starts the development server.
- `bun run build` - Builds the application for production deployment.
- `bun run start` - Starts the built production server.
- `bun run lint` - Runs ESLint to catch errors and enforce code styling.
