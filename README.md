# Task Management Project

## Project Description

This is a simple task management project I built using React with TypeScript. Its purpose is to organize daily tasks and manage teams effectively.

I started this project to solve a personal problem in organizing tasks, and it evolved to become a complete system that can be used in different environments.

## Available Features

- **Dashboard**: Display task statistics and progress
- **Task Management**: Add, edit, and delete tasks
- **User Management**: View, add, edit, and delete user information
- **Reusable Tables**: Display data in an organized manner
- **Responsive Design**: Works on mobile and desktop
- **Excel File Import**: Ability to import data from Excel files

## Technologies Used

I chose these technologies after experimentation and research:

**Foundation:**
- React 19.1.0 - for interactive interfaces
- TypeScript - for safer code and easier maintenance
- Vite - for fast building during development

**Data Management:**
- Redux Toolkit - for application state management
- React Redux - connecting Redux with React

**User Interface:**
- Mantine - ready-made and beautiful component library
- Tabler Icons - diverse icon collection

**Helper Tools:**
- Day.js - for handling dates
- XLSX - for reading Excel files
- React Router - for navigation between pages

## How to Run the Project

### Requirements
- Node.js (version 18 or newer)
- npm or yarn

### Running Steps

1. **Download the project**
```bash
git clone https://github.com/nazemms1/task-management.git
cd task-management
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the project**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## File Structure

```
src/
├── components/          
│   ├── Dashboard/        
│   ├── Layout/           
│   ├── Table/           
│   ├── Tasks/           
│   └── Users/           
├── pages/               
├── services/             
├── store/               
├── types/                
├── hooks/                 
├── constants/           
└── utils/              
```

## Available NPM Commands

- `npm run dev` - run local server
- `npm run build` - build the project
- `npm run preview` - preview the build
- `npm run lint` - check code quality

## Important Development Points

### Choosing Mantine
I chose Mantine because it provides ready-made and beautiful components, and significantly reduces development time.

### Using TypeScript
TypeScript helped me a lot in avoiding errors and making the code clearer, especially in large projects.

### Redux Toolkit
I used it to manage the global state of the application, especially shared user and task data.
