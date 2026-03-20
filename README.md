1. Executive Summary
The Heritage Gas Agency web application is a specialized ERP (Enterprise Resource Planning) solution for LPG distribution. It bridges the gap between customer demand and inventory supply through a real-time, cloud-synced dashboard.

{u can use my Admin Acc.for testing
email: mohitmajoka123@gmail.com
password: mohit1234   and live link: https://heritage-gas-project.web.app/        }.

2. Tech Stack Architecture
Frontend: HTML5, CSS3 (Custom Modular UI), JavaScript (ES6+ Modules).

Backend-as-a-Service (BaaS): Firebase (v10.12.0).

Database: Cloud Firestore (NoSQL Document Store).

Authentication: Firebase Auth (Identity Platform).

Security: Server-side Firestore Rules with role-based access control (RBAC).

3. Core Feature Set
Role-Based Access Control: Secure login for customers and a "Master Admin" bypass for the agency owner.

Live Inventory Tracking: Real-time stock decrementing upon order approval.

Booking Management: A streamlined "Pending -> Delivered/Rejected" workflow for LPG barrels.

Broadcast System: Global alert system to notify all users of price changes or stock availability.

🚀 Installation & Cloning Guide
To run this project locally or transfer it to a new computer, follow these steps precisely.

Prerequisites
A code editor (e.g., VS Code).

A local server extension (e.g., Live Server for VS Code).

A Google/Firebase account.

Step 1: Clone the Project from my git hub repo-
If you have the files locally, skip to Step 2. If you are moving to a new machine:

Create a folder named heritage-gas. (paste the all files there.)

Step 2: Firebase Project Setup
Since the API keys are linked to your project, you must ensure the Firebase backend is ready:

Go to the Firebase Console.

Select heritage-gas-project.

Go to Project Settings and confirm your apiKey matches the one in your code.

Crucial: Go to Authentication > Settings > Authorized Domains and add localhost if it’s not there.

Step 3: Apply Security Rules
For the "Post Notice" and "Booking" features to work without the "Insufficient Permissions" error, copy the rules we discussed earlier:

In Firebase Console, go to Firestore Database > Rules.

Paste the updated rules (the ones including the isAdmin() function and match /agency/{docId}).

Click Publish.

Step 4: Running the App
Open the folder in VS Code.

Right-click index.html (or login.html).

Select "Open with Live Server".

Note: Do not just double-click the file in your folder; Firebase Auth requires a 
http:// protocol to function correctly.

<img width="958" height="545" alt="1" src="https://github.com/user-attachments/assets/1718833a-5fef-4735-87da-5b1c8f07c7cb" />

<img width="872" height="584" alt="2" src="https://github.com/user-attachments/assets/0ed3fd49-dca8-4e1c-a305-b617b966ef11" />

<img width="874" height="397" alt="3" src="https://github.com/user-attachments/assets/0b05742e-aeb4-41db-aa2c-29a4fd02f5ea" />

<img width="812" height="551" alt="4" src="https://github.com/user-attachments/assets/ea8c1cf4-6f5a-43ee-99d5-e19a94e162a7" />


<img width="883" height="617" alt="5" src="https://github.com/user-attachments/assets/1399a755-931f-47ed-be65-bb660291cba8" />


<img width="885" height="541" alt="6" src="https://github.com/user-attachments/assets/1c4d63f6-b211-476f-a091-0e74bbc46753" />


