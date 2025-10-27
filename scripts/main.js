// Responsive menu toggle
const menuButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

menuButton.addEventListener("click", () => {
  navigation.classList.toggle("open");
  menuButton.textContent = navigation.classList.contains("open") ? "✖" : "☰";
});

// Footer dynamic data
document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;

// Course data
const courses = [
  { code: "WDD 130", name: "Web Fundamentals", credits: 3, status: "completed" },
  { code: "CSE 110", name: "Programming Building Blocks", credits: 2, status: "completed" },
  { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 3, status: "in-progress" },
  { code: "CSE 210", name: "Programming with Classes", credits: 3, status: "planned" },
  { code: "WDD 231", name: "Frontend Web Development", credits: 3, status: "planned" }
];

const list = document.querySelector("#courseList");
const totalCredits = document.querySelector("#totalCredits");

function displayCourses(filter = "all") {
  list.innerHTML = "";
  const filtered = filter === "all" ? courses : courses.filter(c => c.status === filter);
  
  filtered.forEach(course => {
    const li = document.createElement("li");
    li.textContent = `${course.code}: ${course.name} (${course.credits} credits)`;
    if (course.status === "completed") {
      li.style.background = "#ffb6c9";
      li.style.fontWeight = "600";
    } else if (course.status === "in-progress") {
      li.style.background = "#ffe6f0";
    }
    list.appendChild(li);
  });
  
  const total = filtered.reduce((sum, c) => sum + c.credits, 0);
  totalCredits.textContent = `Total Credits: ${total}`;
}

// Filter buttons
document.querySelectorAll(".filter-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-buttons button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    displayCourses(btn.dataset.filter);
  });
});

displayCourses();
