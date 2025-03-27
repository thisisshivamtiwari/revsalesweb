# RevSales Dashboard

A modern, responsive dashboard for RevSales built with React, TypeScript, and TailwindCSS.

## Features

- 🎨 Modern UI with dark theme
- 📱 Fully responsive design
- 🔐 Authentication system
- 📊 Lead management
- 📅 Calendar & Meeting Management
  - Day/Week/Month views
  - Meeting scheduling and rescheduling
  - Drag and drop functionality
  - Search and filter meetings
  - Real-time updates
- 👥 Team Management
  - Team member listings
  - Performance tracking
  - Lead and revenue statistics
  - Member search functionality
  - Quick member addition
- ✅ Task management
- 🎯 Real-time updates
- 🔍 Advanced search and filtering

## Tech Stack

- React 18
- TypeScript
- TailwindCSS
- Redux Toolkit
- RTK Query
- Shadcn UI
- Vite
- Lucide Icons
- React Hot Toast

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/thisisshivamtiwari/revsalesweb.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_BASE_URL=your_api_url
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── calendar/        # Calendar and meeting components
│   ├── dashboard/       # Dashboard components
│   ├── teams/          # Team management components
│   └── ui/             # Reusable UI components
├── lib/                 # Utilities and helpers
│   ├── features/        # Redux slices and API
│   │   ├── auth/       # Authentication slice
│   │   ├── calendar/   # Calendar and meetings API
│   │   └── teams/      # Teams management API
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── assets/             # Static assets
└── App.tsx             # Root component
```

## Features in Detail

### Calendar Management
- Interactive calendar with multiple view options (day, week, month)
- Drag and drop meeting rescheduling
- Meeting creation and editing
- Advanced search and filtering options
- Real-time updates for meeting changes

### Team Management
- Comprehensive team member listing
- Performance metrics tracking
  - Total leads generated
  - Revenue closed
  - Individual member statistics
- Quick search functionality for team members
- Easy member addition interface
- Real-time performance updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
