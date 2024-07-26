# Synchronize - Comprehensive Healthcare Management Platform

## Overview

Synchronize is a cutting-edge web application designed for EnoObong Memorial Medical Services in Nigeria. This comprehensive platform aims to streamline and enhance the clinic's operations by facilitating efficient interactions between patients and the resident physician. The app is tailored to manage health records, appointments, and provide vital medical resources, thereby improving the overall healthcare experience.

**Category:** Health and Medical Services

**Story:** The goal of this project is to build a comprehensive web application for EnoObong Memorial Medical Services, a clinic in Nigeria. The app will enhance the clinic’s operations by facilitating patient and physician interactions through a seamless digital platform.

**Market:** This app is aimed at patients and physicians of EnoObong Memorial Medical Services. It targets both existing and potential patients who need an efficient way to manage their health records, appointments, and access medical resources.

**Habit:** The app is expected to be used frequently by both patients and physicians. Patients will use it to manage their profiles, view COVID-19 resources, find directions to the clinic, and receive notifications about their health. Physicians will use it to manage patient profiles, schedule appointments, and provide updates.

**Scope:** The initial scope includes a landing page, user authentication, profile management for patients, a COVID-19 resource section, a locate page with Google Maps integration, and a notification system. Future stretch goals include an AI chatbot for health diagnosis and additional interactive features.

Refer to the [Project Plan](https://docs.google.com/document/d/1qVpVUWfpK19PLDRcP0QqXiVbzNUfehxs9ig6wsnwLv4/edit?usp=sharing) for a more in-depth explanation.


## Technical Challenges

### Technical Challenge #1 - Patient+Physician Notification System
- **Problem:** Notifying stakeholders about updates to patient profiles and appointments.
- **Solution:** Use websockets to send real-time notifications for changes. Created an algorithm in the backend to enhance notifications. This includes handling cases where users are offline or have turned off notifications.
- **On this PR:** Revisit notifications by implementing a confirmation modal for turning off notifications for patients (on the physician's end), rendered based on certain conditions:
  - If a patient:
    - is an elder/infant
    - has appointments in the next 3 days
    - has at least 5 appointments on their appointment list.
  - **Milestones:**
    - Create an algorithm in the backend (notifications.js) that checks the conditions above (using weights of each condition to determine for which patient notifications should not be turned off and warned but allowed to turn off).
    - Integrate this algorithm into the put request in user.js for toggling patients' notifications on/off in PatientCards.
    - Implement the ConfirmationModal on the UI.

### Technical Challenge #2 - Prescription Recommendation System with Caching
- **Problem:** Simplify the prescription process based on patient symptoms.
- **Solution:** Develop an algorithm to recommend medications based on symptoms and patient attributes, incorporating a multi-level caching mechanism to optimize performance.
  - **Level 1 Cache:** Reuse prescriptions for identical symptoms and age.
  - **Level 2 Cache:** Calculate the distance between symptom vectors and reuse similar ones.
  - **Level 3 Cache:** Store and reuse compatibility scores for medications to save computation time.
Refer to the [Implementation plan](https://docs.google.com/document/d/1XbM15YjcYmMgJUj9eLimreuMpQ4XMU_Plr0ZVqzt_6Q/edit?usp=sharing).

### Author:
Ekomobong Ekanem
