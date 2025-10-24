// Users & posts data
let currentUser = {
  name: "John Doe",
  profilePic: "https://i.pravatar.cc/150",
  followers: 0,
  posts: []
};

let notifications = [];

// Page switcher
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
}

// Add new post
function addPost() {
  const content = document.getElementById("postContent").value.trim();
  const imageInput = document.getElementById("postImage");
  let imageUrl = "";

  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imageUrl = e.target.result;
      savePost(content, imageUrl);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    savePost(content, imageUrl);
  }
}

// Save post and update feed/profile
function savePost(content, imageUrl) {
  if (!content && !imageUrl) return alert("Add text or image!");

  const post = {
    author: currentUser.name,
    content,
    image: imageUrl,
    likes: 0,
    comments: []
  };

  currentUser.posts.unshift(post);
  document.getElementById("postContent").value = "";
  document.getElementById("postImage").value = "";

  updateFeed();
  updateProfilePosts();
}

// Update home feed
function updateFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  currentUser.posts.forEach((post, idx) => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="author">${post.author}</div>
      <div class="content">${post.content}</div>
      ${post.image ? `<img src="${post.image}" alt="Post Image">` : ""}
      <div class="actions">
        <span onclick="likePost(${idx})">❤️ Like (${post.likes})</span>
        <span onclick="commentPost(${idx})">💬 Comment</span>
      </div>
    `;
    feed.appendChild(div);
  });
}

// Update profile posts
function updateProfilePosts() {
  const profilePosts = document.getElementById("profilePosts");
  profilePosts.innerHTML = "";

  currentUser.posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="content">${post.content}</div>
      ${post.image ? `<img src="${post.image}" alt="Post Image">` : ""}
      <div class="actions">
        ❤️ Likes: ${post.likes} | 💬 Comments: ${post.comments.length}
      </div>
    `;
    profilePosts.appendChild(div);
  });
}

// Like post
function likePost(idx) {
  currentUser.posts[idx].likes++;
  updateFeed();
  updateProfilePosts();
}

// Comment post
function commentPost(idx) {
  const comment = prompt("Enter comment:");
  if (!comment) return;
  currentUser.posts[idx].comments.push(comment);

  notifications.unshift(`${currentUser.name} commented on their post: "${comment}"`);
  updateNotifications();
  updateFeed();
  updateProfilePosts();
}

// Follow user
function followUser() {
  currentUser.followers++;
  document.getElementById("profileFollowers").textContent = `Followers: ${currentUser.followers}`;
  notifications.unshift("Someone followed you!");
  updateNotifications();
}

// Update notifications
function updateNotifications() {
  const list = document.getElementById("notificationsList");
  list.innerHTML = "";
  notifications.forEach(note => {
    const div = document.createElement("div");
    div.className = "notification";
    div.textContent = note;
    list.appendChild(div);
  });
}

// Initialize
updateFeed();
updateProfilePosts();
updateNotifications();
