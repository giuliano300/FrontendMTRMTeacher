import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({selector:'app-guide-page',standalone:true,imports:[CommonModule,RouterLink],templateUrl:'./guide-page.component.html',styleUrl:'./guide-page.component.scss'})
export class GuidePageComponent {
 readonly portal='Teacher';
 readonly sections=[
  {
    "id": "getting-started",
    "title": "Your teaching workspace",
    "intro": "Your portal connects you with the sessions assigned by the training office.",
    "steps": [
      "Use Dashboard for an overview and My sessions for the schedule.",
      "Search by course title, classroom or material name from the header. Ctrl / ⌘ K focuses search.",
      "Open the bell to review upcoming sessions, unrecorded attendance and materials shared in the last 30 days."
    ],
    "note": "Search results and updates are restricted to your assigned activity. Read status is stored in this browser.",
    "url": "/dashboard",
    "link": "Open dashboard"
  },
  {
    "id": "sessions",
    "title": "Start and complete a session",
    "intro": "Keep the training office informed of the session's progress.",
    "steps": [
      "Open My sessions and check the course, dates and venue.",
      "Choose Start session when teaching begins and review the confirmation.",
      "Record attendance for all learners, then choose Mark completed and confirm."
    ],
    "note": "You cannot reopen a completed session from this portal. Contact the training office if a correction is needed.",
    "url": "/sessions",
    "link": "Open my sessions"
  },
  {
    "id": "attendance",
    "title": "Record learner attendance",
    "intro": "Use the attendance register for each assigned session.",
    "steps": [
      "Open Attendance and select the session.",
      "Choose Record beside a learner. Select Present, Absent, Excused or Registered and add any relevant notes.",
      "Save attendance for each learner. Registered means attendance has not yet been confirmed."
    ],
    "note": "Learner personal details cannot be edited here. If an issued certificate blocks an attendance correction, contact the training office.",
    "url": "/attendance",
    "link": "Open attendance"
  },
  {
    "id": "materials",
    "title": "Download teaching resources",
    "intro": "Resources are shared by the training office for your course or session.",
    "steps": [
      "Open Course materials or use the header search to find a file.",
      "Choose Download to save the available resource.",
      "If a file is unavailable or needs replacing, contact the training office."
    ],
    "note": "The teacher portal does not upload or edit course resources.",
    "url": "/materials",
    "link": "Open course materials"
  },
  {
    "id": "profile",
    "title": "Profile and account",
    "intro": "Keep your contact and professional details current.",
    "steps": [
      "Open My profile and choose Edit profile.",
      "Update your phone number and qualifications, then save the side panel.",
      "Use Log out when you finish."
    ],
    "note": "Your name, sign-in email and access password are managed by the training office. Contact them if you cannot sign in.",
    "url": "/profile",
    "link": "Open my profile"
  }
];
}
