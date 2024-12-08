import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvYRzyCrazIHj2-KHZ8UXuXfP2tVPIIZk",
  authDomain: "practicegeneral-ab18c.firebaseapp.com",
  databaseURL: "https://practicegeneral-ab18c-default-rtdb.firebaseio.com",
  projectId: "practicegeneral-ab18c",
  storageBucket: "practicegeneral-ab18c.firebasestorage.app",
  messagingSenderId: "799394328558",
  appId: "1:799394328558:web:e72baf1faee2bcf14a68ff",
  measurementId: "G-1DMFZKG7WM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get the current category path from the URL
let path = window.location.pathname; // Get the full pathname
console.log(path);
if (!(path == '/' || path == '/homepage.html')) {
  path = path.split('/')[2].replace('.html', ''); // Extract the category
  console.log(path);
}

console.log("Current Category Path:", path);

// Signup Handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;
    const username = document.getElementById('username').value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString()
      });

      alert(`Account created successfully for ${username}`);
      window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
      alert(`Signup failed: ${error.message}`);
    }
  });
}

// Login Handler
const loginForm = document.getElementById('login');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve user details from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        alert(`Welcome back, ${userData.username}!`);
      } else {
        alert("Welcome back!");
      }
      window.location.href = "homepage.html"; // Redirect to homepage
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  });
}

// Add Post Form Rendering
try {
  const dynamicContainer = document.getElementById('dynamic-container');
  if (!dynamicContainer) {
    throw new Error("Dynamic container not found!");
  }

  const formHTML = `
    <div class="add-post-container">
      <form id="addPost">
        <textarea id="post-title" placeholder="Title" required></textarea>
        <textarea id="post-content" placeholder="Put post here..." required></textarea>
        <button class="submit-button">Post</button>
      </form>
    </div>
  `;

  dynamicContainer.innerHTML = formHTML;
} catch (err) {
  console.error("Error rendering the form:", err);
}

// Add Post to Firestore
try {
  const addPost = document.getElementById('addPost');
  addPost.addEventListener('submit', async (e) => {
    e.preventDefault();

    const postTitle = document.getElementById('post-title').value;
    const postContent = document.getElementById('post-content').value;

    const postsCollectionRef = collection(db, "Categories", path, "posts");
    const docRef = doc(postsCollectionRef);

    const data = {
      postTitle: postTitle,
      postContent: postContent,
      createdAt: new Date(),
    };
    await setDoc(docRef, data);

    alert("Document successfully written with ID:", docRef.id);
    window.location.href = `${path}.html`;
  });
} catch (err) {
  console.log("Error in adding post");
}

// Fetch Posts from Firestore and Add Delete Button
1

// Fetch Categories for Homepage
try {
  const categoriesContainer = document.getElementById('categories');
  const docRef = collection(db, 'Categories');

  const querySnapshot = await getDocs(docRef);

  querySnapshot.forEach((e) => {
    const data = e.data();
    categoriesContainer.innerHTML += `
      <a style="text-decoration: none;" href='Categories/${data.subTitle}.html'>
        <div class='container_home'>
          <h3>${data.subTitle}</h3>
        </div>
      </a>
    `;
  });
} catch (err) {
  console.log("Error in categories:", err);
}

console.log("Finished loading scripts.");
