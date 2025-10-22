# Student & Faculty Profile Management System

**Admin Only Access**

A Student and Faculty Profile Management System is a web-based application designed to store, manage, and update personal and academic/professional profiles of students and faculty members within a school, college, or university. This system is accessible only to administrators.

## System Modules

### 📊 Dashboard
- Display total number of students and faculty
- Charts: Number of students per course and number of faculty per department
- Quick overview of system statistics

### 👩‍🏫 Faculty Management
- Can add, edit, and archive faculty member information
- Can filter faculty members by department
- Can search faculty members
- Comprehensive faculty profile management

### 🎓 Students Management
- Can add, edit, and archive student information
- Can filter students by course and department
- Can search students
- Complete student profile management

### 📈 Reports
- Can generate reports filtered by course for students
- Can generate reports filtered by department for faculty
- Export functionality for data analysis

### ⚙️ System Settings
**In tab format:**
- Can add, edit, and archive course information
- Can add, edit, and archive department information
- Can add, edit, and archive academic year information

### 👤 My Profile (Admin)
- Can edit signed-in admin profile
- Can log out signed-in profile
- Profile management for administrators

## Technology Stack

- **Backend**: Laravel 7
- **Frontend**: React.js with Laravel Mix
- **Database**: MySQL/PostgreSQL
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Tailwind CSS

## Installation & Setup

### Prerequisites
- PHP 7.2.5 or higher
- Composer
- Node.js and npm
- MySQL/PostgreSQL

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-faculty-management
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database configuration**
   - Update your `.env` file with database credentials
   - Create a database for the application

6. **Run migrations and seeders**
   ```bash
   php artisan migrate --seed
   ```

7. **Build assets**
   ```bash
   npm run dev
   # or for production
   npm run production
   ```

8. **Start the development server**
   ```bash
   php artisan serve
   ```

## 🛠️ Step-by-Step Implementation Tasks

### Phase 1: Project Setup & Authentication ✅
- [x] Set up Laravel 7 project with PHP 8.2 compatibility
- [x] Configure database (SQLite for development)
- [x] Create user authentication system
- [x] Set up React frontend with Laravel Mix
- [x] Implement login/logout functionality
- [x] Create admin user seeder

### Phase 2: Database Design & Models ✅
- [x] Create migration for users table
- [x] Create migration for departments table
- [x] Create migration for courses table
- [x] Create migration for academic_years table
- [x] Create migration for students table
- [x] Create migration for faculty table
- [x] Create Eloquent models with relationships
- [x] Set up foreign key constraints

### Phase 3: Backend API Development 🔄
- [x] Create API controllers structure
- [x] Implement authentication middleware
- [x] Create ProfileController for admin profile management
- [ ] Create DashboardController for statistics
- [ ] Create StudentController with CRUD operations
- [ ] Create FacultyController with CRUD operations
- [ ] Create CourseController for system settings
- [ ] Create DepartmentController for system settings
- [ ] Create AcademicYearController for system settings
- [ ] Create ReportController for data export
- [ ] Implement search and filter functionality

### Phase 4: Frontend Components Development 🔄
- [x] Create main App component with navigation
- [x] Create Login component
- [x] Set up authentication state management
- [ ] Create Dashboard component with charts
- [ ] Create Students management component
- [ ] Create Faculty management component
- [ ] Create System Settings component (tabbed interface)
- [ ] Create Reports component
- [ ] Create Profile management component
- [ ] Implement search and filter UI components

### Phase 5: Dashboard & Analytics 📝
- [ ] Implement student count by course chart
- [ ] Implement faculty count by department chart
- [ ] Create dashboard statistics API endpoints
- [ ] Integrate Chart.js for data visualization
- [ ] Add real-time data updates
- [ ] Create dashboard widgets

### Phase 6: Student Management Module 📝
- [ ] Create student registration form
- [ ] Implement student edit functionality
- [ ] Add student archive/restore feature
- [ ] Create student profile view
- [ ] Implement course and department filters
- [ ] Add student search functionality
- [ ] Create bulk operations for students

### Phase 7: Faculty Management Module 📝
- [ ] Create faculty registration form
- [ ] Implement faculty edit functionality
- [ ] Add faculty archive/restore feature
- [ ] Create faculty profile view
- [ ] Implement department filters
- [ ] Add faculty search functionality
- [ ] Create bulk operations for faculty

### Phase 8: System Settings Module 📝
- [ ] Create tabbed interface for settings
- [ ] Implement course management (CRUD)
- [ ] Implement department management (CRUD)
- [ ] Implement academic year management (CRUD)
- [ ] Add validation for system settings
- [ ] Create settings backup/restore functionality

### Phase 9: Reports & Data Export 📝
- [ ] Create student reports by course
- [ ] Create faculty reports by department
- [ ] Implement CSV export functionality
- [ ] Create PDF report generation
- [ ] Add report filtering options
- [ ] Create scheduled reports

### Phase 10: Advanced Features 📝
- [ ] Implement advanced search with multiple criteria
- [ ] Add data import functionality (Excel/CSV)
- [ ] Create audit trail for data changes
- [ ] Implement user activity logging
- [ ] Add data validation and sanitization
- [ ] Create system backup functionality

### Phase 11: UI/UX Improvements 📝
- [ ] Implement responsive design for mobile devices
- [ ] Add loading states and error handling
- [ ] Create confirmation dialogs for destructive actions
- [ ] Implement toast notifications
- [ ] Add form validation with real-time feedback
- [ ] Create help tooltips and documentation

### Phase 12: Testing & Deployment 📝
- [ ] Write unit tests for API endpoints
- [ ] Create frontend component tests
- [ ] Implement integration tests
- [ ] Set up continuous integration
- [ ] Create deployment documentation
- [ ] Perform security audit
- [ ] Optimize performance
- [ ] Create user manual

## 📋 Current Status
- ✅ **Authentication**: Working login/logout system
- ✅ **Database**: SQLite setup with migrations and seeders
- ✅ **Backend API**: Basic structure with authentication
- ✅ **Frontend**: React components with routing
- 🔄 **In Progress**: Core module development
- 📝 **Pending**: Advanced features and testing

## Default Admin Credentials

- **Email**: admin@admin.com
- **Password**: password

## API Endpoints

### Authentication
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Students
- `GET /api/students` - Get all students (with search and filters)
- `POST /api/students` - Create new student
- `GET /api/students/{id}` - Get specific student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Archive student

### Faculty
- `GET /api/faculty` - Get all faculty (with search and filters)
- `POST /api/faculty` - Create new faculty member
- `GET /api/faculty/{id}` - Get specific faculty member
- `PUT /api/faculty/{id}` - Update faculty member
- `DELETE /api/faculty/{id}` - Archive faculty member

### System Settings
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Archive course

- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Archive department

- `GET /api/academic-years` - Get all academic years
- `POST /api/academic-years` - Create new academic year
- `PUT /api/academic-years/{id}` - Update academic year
- `DELETE /api/academic-years/{id}` - Archive academic year

### Reports
- `GET /api/reports/students-by-course` - Get students report by course
- `GET /api/reports/faculty-by-department` - Get faculty report by department

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile

## Database Schema

### Tables
- `users` - Admin users
- `departments` - Academic departments
- `courses` - Academic courses/programs
- `academic_years` - Academic year and semester information
- `students` - Student profiles and information
- `faculty` - Faculty member profiles and information

## Development

### Running in Development Mode
```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Asset compilation with hot reloading
npm run watch
```

### Building for Production
```bash
npm run production
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).