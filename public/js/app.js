// 1. IMPROVED IMPORTS (Using consistent version 10.8.0 and adding missing functions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  collection, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. IMPORT CONFIG
import { firebaseConfig } from "./firebase-config.js";

// 3. INITIALIZE FIREBASE (Only once!)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. ADMIN SETTINGS
const ADMIN_EMAILS = ["mohitmajoka123@gmail.com"]; // Add your admin emails here

// 5. HELPERS
const $ = (sel, root = document) => root.querySelector(sel);

// 6. ACCESS CONTROL
const currentPage = window.location.pathname.split("/").pop();
const protectedPages = [
  "booking.html",
  "complaint.html",
  "history.html",
  "admin.html",
];

if (protectedPages.includes(currentPage)) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("❌ You are not logged in. Please login first.");
      window.location.href = "login.html";
    }
  });
}

// 7. LOGIN LOGIC
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;
  const loginMsg = document.getElementById("login-msg");

  if (loginMsg) {
    loginMsg.className = "msg loading";
    loginMsg.textContent = "⏳ Logging in...";
  }

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    if (loginMsg) {
      loginMsg.className = "msg success";
      loginMsg.textContent = "✅ Login successful!";
    }
    window.location.href = "index.html"; // Redirect after login
  } catch (err) {
    console.error(err);
    if (loginMsg) {
      loginMsg.className = "msg error";
      loginMsg.textContent = "❌ Error: " + err.message;
    }
  }
});

// 8. PROFILE / UI HANDLING
onAuthStateChanged(auth, async (user) => {
  const loginBox = document.getElementById("login-box");
  const profileBox = document.getElementById("profile-box");

  if (loginBox && profileBox) {
    if (user) {
      loginBox.style.display = "none";
      profileBox.style.display = "block";

      let nameToShow = user.displayName || "N/A";
      let roleToShow = "user";

      try {
        const uref = doc(db, "users", user.uid);
        const usnap = await getDoc(uref);
        if (usnap.exists()) {
          const data = usnap.data();
          nameToShow = data.name || nameToShow;
          roleToShow = data.role || "user";
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
      }

      if (ADMIN_EMAILS.includes(user.email)) {
        nameToShow = "Admin";
        roleToShow = "admin";
      }

      if(document.getElementById("prof-name")) document.getElementById("prof-name").textContent = nameToShow;
      if(document.getElementById("prof-email")) document.getElementById("prof-email").textContent = user.email;
      if(document.getElementById("prof-role")) document.getElementById("prof-role").textContent = roleToShow;
    } else {
      loginBox.style.display = "block";
      profileBox.style.display = "none";
    }
  }
});

// 9. REGISTER LOGIC
document.getElementById("reg-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value;
  const regMsg = document.getElementById("reg-msg");

  if (regMsg) {
    regMsg.className = "msg loading";
    regMsg.textContent = "⏳ Creating account...";
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) await updateProfile(cred.user, { displayName: name });
    
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email: cred.user.email,
      name,
      role: ADMIN_EMAILS.includes(email) ? "admin" : "user",
      createdAt: serverTimestamp(),
    });

    await signOut(auth);

    if (regMsg) {
      regMsg.className = "msg success";
      regMsg.textContent = "✅ Register successful! Please login.";
    }
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
  } catch (err) {
    if (regMsg) {
      regMsg.className = "msg error";
      regMsg.textContent = "❌ " + err.message;
    }
  }
});

// 10. LOGOUT
document.querySelectorAll(".logout")?.forEach((btn) =>
  btn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (e) {
      alert("Logout error: " + e.message);
    }
  })
);

// 11. BOOKING
document.getElementById("booking-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const qty = parseInt(document.getElementById("qty").value, 10);
    const addr = document.getElementById("addr").value.trim();
    const user = auth.currentUser;
    const payment = document.querySelector('input[name="payment"]:checked')?.value;

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
        await addDoc(collection(db, "bookings"), {
          uid: user.uid,
          email: user.email,
          qty,
          address: addr,
          payment,
          status: "pending",
          createdAt: serverTimestamp(),
        });
        alert("Booking placed successfully!");
    } catch (err) {
        alert("Booking failed: " + err.message);
    }
});

// 12. HISTORY
if (document.getElementById("my-bookings-body")) {
  onAuthStateChanged(auth, (u) => {
    if (u) {
      const q = query(collection(db, "bookings"), where("uid", "==", u.uid), orderBy("createdAt", "desc"));
      onSnapshot(q, (snap) => {
        const tbody = document.getElementById("my-bookings-body");
        tbody.innerHTML = "";
        snap.forEach((docu) => {
          const b = docu.data();
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${b.createdAt?.toDate().toLocaleString() || ''}</td><td>${b.qty}</td><td>${b.address}</td><td>${b.status}</td>`;
          tbody.appendChild(tr);
        });
      });
    }
  });
}