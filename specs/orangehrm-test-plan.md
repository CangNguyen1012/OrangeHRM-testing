# OrangeHRM Complete Application Test Plan

## Application Overview

OrangeHRM is a comprehensive HR management system featuring employee information management (PIM), leave administration, time tracking, recruitment, performance management, and company directory. This test plan provides comprehensive coverage of all major modules and user workflows in the open-source demo application.

## Test Scenarios

### 1. Authentication & Dashboard

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful Login with Valid Credentials

**File:** `tests/auth/login-valid.spec.ts`

**Steps:**
  1. Navigate to login page
    - expect: Login page displayed with Username and Password fields
    - expect: Login button is visible
  2. Enter username 'Admin'
    - expect: Username field populated with 'Admin'
  3. Enter password 'admin123'
    - expect: Password field populated
  4. Click Login button
    - expect: User authenticated successfully
    - expect: Redirected to Dashboard at /web/index.php/dashboard/index

#### 1.2. View Dashboard Widgets

**File:** `tests/dashboard/view-widgets.spec.ts`

**Steps:**
  1. Login and navigate to Dashboard
    - expect: Dashboard page loads successfully
  2. Observe Time at Work widget
    - expect: Punch-in status displayed
    - expect: Time worked today shown
  3. Observe My Actions widget
    - expect: Pending self-reviews listed
    - expect: Candidate interviews displayed
  4. Observe Quick Launch buttons
    - expect: Quick action buttons visible
    - expect: Buttons include Assign Leave, Leave List, Timesheets, Apply Leave, My Leave, My Timesheet

### 2. PIM - Employee Management

**Seed:** `tests/seed.spec.ts`

#### 2.1. View and Search Employee List

**File:** `tests/pim/employee-list-search.spec.ts`

**Steps:**
  1. Navigate to PIM module
    - expect: Employee List page displayed
  2. Enter employee name in search field
    - expect: Search field accepts input
  3. Click Search button
    - expect: Results filtered to matching employees
    - expect: Employee appears in list
  4. Click Reset button
    - expect: All filters cleared
    - expect: Full employee list displayed

#### 2.2. Filter Employees by Employment Status

**File:** `tests/pim/filter-employment-status.spec.ts`

**Steps:**
  1. Navigate to PIM Employee List
    - expect: Employee List page displayed
  2. Select employment status from dropdown
    - expect: Status options displayed
  3. Click Search
    - expect: Results filtered by employment status
    - expect: Only selected status employees shown

#### 2.3. Add New Employee

**File:** `tests/pim/add-employee.spec.ts`

**Steps:**
  1. Navigate to PIM module
    - expect: PIM page displayed
  2. Click 'Add Employee' button
    - expect: Add Employee form displayed
  3. Enter First Name and Last Name
    - expect: Form fields populated
  4. Click Save button
    - expect: Employee created successfully
    - expect: Confirmation message displayed
    - expect: New employee appears in list

### 3. Leave Management

**Seed:** `tests/seed.spec.ts`

#### 3.1. Apply for Leave

**File:** `tests/leave/apply-leave.spec.ts`

**Steps:**
  1. Navigate to Leave module
    - expect: Leave module page displayed
  2. Click Apply tab
    - expect: Leave application form displayed
  3. Select leave type and enter dates
    - expect: Form fields populated
  4. Click Submit
    - expect: Leave applied successfully
    - expect: Confirmation message shown
    - expect: Leave appears in list with Pending status

#### 3.2. View Leave List with Filters

**File:** `tests/leave/leave-list-filter.spec.ts`

**Steps:**
  1. Navigate to Leave module
    - expect: Leave List page displayed
  2. Enter From Date and To Date
    - expect: Date fields populated
  3. Click Search
    - expect: Results filtered by date range

#### 3.3. View My Leave History

**File:** `tests/leave/my-leave-history.spec.ts`

**Steps:**
  1. Navigate to Leave module
    - expect: Leave module page displayed
  2. Click My Leave tab
    - expect: Personal leave history displayed
  3. Observe leave records
    - expect: Approved leaves shown
    - expect: Pending leaves shown
    - expect: Rejected leaves shown

### 4. Admin Module

**Seed:** `tests/seed.spec.ts`

#### 4.1. Manage System Users

**File:** `tests/admin/manage-users.spec.ts`

**Steps:**
  1. Navigate to Admin module
    - expect: Admin User Management page displayed
  2. Observe user list
    - expect: System users displayed in table
  3. Search for a user
    - expect: User found in search results

#### 4.2. Manage Job Titles

**File:** `tests/admin/manage-job-titles.spec.ts`

**Steps:**
  1. Navigate to Admin module
    - expect: Admin page displayed
  2. Click Job tab
    - expect: Job Titles page displayed
  3. Click Add button
    - expect: Add Job Title form displayed
  4. Enter job title and description
    - expect: Form fields populated
  5. Click Save
    - expect: Job title created successfully
    - expect: New job appears in list

### 5. Time Tracking

**Seed:** `tests/seed.spec.ts`

#### 5.1. View Time at Work Status

**File:** `tests/time/time-at-work.spec.ts`

**Steps:**
  1. Navigate to Dashboard
    - expect: Dashboard page displayed
  2. Observe Time at Work widget
    - expect: Punch-in status displayed
    - expect: Time worked today shown
    - expect: Weekly time summary displayed

#### 5.2. Access Time Module

**File:** `tests/time/access-time-module.spec.ts`

**Steps:**
  1. Click Time in left sidebar
    - expect: Time module page displayed
    - expect: Time management options available

### 6. Recruitment

**Seed:** `tests/seed.spec.ts`

#### 6.1. View Job Vacancies and Applicants

**File:** `tests/recruitment/vacancies-applicants.spec.ts`

**Steps:**
  1. Navigate to Recruitment module
    - expect: Recruitment module displayed
  2. View vacancies
    - expect: Open job vacancies listed
  3. View applicants
    - expect: Job applicants displayed
    - expect: Applicant status shown

#### 6.2. Filter Applicants by Status

**File:** `tests/recruitment/filter-applicants.spec.ts`

**Steps:**
  1. Navigate to Recruitment Applicants
    - expect: Applicants page displayed
  2. Select status filter
    - expect: Status options available
  3. Click Search
    - expect: Applicants filtered by status

### 7. User Profile & Personal Information

**Seed:** `tests/seed.spec.ts`

#### 7.1. View and Edit My Info

**File:** `tests/profile/my-info.spec.ts`

**Steps:**
  1. Navigate to My Info
    - expect: Personal information page displayed
    - expect: User details visible
  2. Click Edit button
    - expect: Edit mode enabled
  3. Modify a field
    - expect: Field editable
  4. Click Save
    - expect: Changes saved successfully
    - expect: Updated information reflected

#### 7.2. Access User Menu

**File:** `tests/profile/user-menu.spec.ts`

**Steps:**
  1. Click profile icon in top right corner
    - expect: User dropdown menu displayed
  2. Observe menu options
    - expect: User menu items visible

### 8. Performance Management

**Seed:** `tests/seed.spec.ts`

#### 8.1. Access Performance Module

**File:** `tests/performance/access-performance.spec.ts`

**Steps:**
  1. Click Performance in left sidebar
    - expect: Performance module page displayed

#### 8.2. View Pending Self Reviews

**File:** `tests/performance/pending-reviews.spec.ts`

**Steps:**
  1. Navigate to Performance module
    - expect: Performance page displayed
  2. Look for pending self-reviews
    - expect: Pending reviews section visible
    - expect: Number of pending reviews shown

### 9. Directory

**Seed:** `tests/seed.spec.ts`

#### 9.1. Search and View Employee Directory

**File:** `tests/directory/employee-search.spec.ts`

**Steps:**
  1. Navigate to Directory module
    - expect: Directory page displayed
  2. Enter employee name in search
    - expect: Search field accepts input
  3. Click Search
    - expect: Employee details displayed in directory
    - expect: Contact information visible

### 10. Buzz - Social Communication

**Seed:** `tests/seed.spec.ts`

#### 10.1. View Buzz Feed and Create Post

**File:** `tests/buzz/buzz-feed.spec.ts`

**Steps:**
  1. Navigate to Buzz module
    - expect: Buzz feed page displayed
  2. Observe existing posts
    - expect: Multiple posts visible with author and date
  3. Click post creation area
    - expect: Post input form displayed
  4. Enter post content
    - expect: Text entered in form
  5. Click Post button
    - expect: Post created successfully
    - expect: New post appears in feed

### 11. Error Handling & Validation

**Seed:** `tests/seed.spec.ts`

#### 11.1. Validate Required Form Fields

**File:** `tests/error-handling/required-fields.spec.ts`

**Steps:**
  1. Navigate to a form (e.g., Add Employee)
    - expect: Form displayed
  2. Attempt to submit without filling required fields
    - expect: Validation error messages appear
    - expect: Form submission blocked

#### 11.2. Handle Invalid Date Format

**File:** `tests/error-handling/invalid-date.spec.ts`

**Steps:**
  1. Navigate to a form with date fields
    - expect: Date fields displayed
  2. Enter invalid date format
    - expect: Error message shown or auto-correction applied
    - expect: Form prevents invalid submission

#### 11.3. Handle Special Characters in Search

**File:** `tests/error-handling/special-chars-search.spec.ts`

**Steps:**
  1. Navigate to a search page
    - expect: Search field available
  2. Enter special characters in search
    - expect: System handles gracefully
    - expect: Results displayed or error shown
