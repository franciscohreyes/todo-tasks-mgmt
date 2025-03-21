# Todo Tasks - Task Management Application

A modern, responsive task management application built with React, TypeScript, and TailwindCSS. Features drag-and-drop functionality, dark mode support, and real-time updates.

## 🌟 Features

- **Task Management**
  - Create, edit, and delete tasks
  - Drag and drop tasks between columns
  - Organize tasks by status (To Do, In Progress, Completed)
  - Real-time updates and persistence

- **User Interface**
  - Modern and clean design
  - Responsive layout for all devices
  - Dark mode support
  - Beautiful animations and transitions
  - Drag and drop with visual feedback

- **Technical Features**
  - TypeScript for type safety
  - React with modern hooks
  - TailwindCSS for styling
  - React Beautiful DnD for drag and drop
  - Local storage and API persistence
  - Environment-based configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/franciscohreyes/todo-tasks-mgmt
   cd todo-tasks-mgmt
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment files:
   ```bash
   cp .env.example .env
   cp .env.example .env.production
   ```

4. Update the environment variables in `.env` and `.env.production` with your configuration.

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Build the application:
```bash
npm run build
# or
yarn build
```

Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **Drag and Drop**: React Beautiful DnD
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Package Manager**: npm/yarn

## 📁 Project Structure

```
todo-tasks-mgmt/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API and service functions
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── public/            # Static assets
├── .env.example       # Example environment variables
├── .env.production    # Production environment variables
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:3000/api
```

### API Configuration

The application supports both local storage and API persistence. Configure the storage type in your environment variables:

```env
VITE_STORAGE_TYPE=local  # Options: 'local' or 'api'
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd)
- [Vite](https://vitejs.dev/)
