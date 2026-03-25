const allIssues = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
let singleIssue = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";
let searchIssue = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

let allIssuesData = [];
let issue_count = document.getElementById("issue_count");


const loadAllIssues = async (status) => {
    // manageSpinner() here as displayIssues is synchronous anyway.
    manageSpinner(true);
    const issuesRes = await fetch(allIssues);
    const issuesJSON = await issuesRes.json();
    allIssuesData = issuesJSON.data;
    displayIssues(allIssuesData, status);
    manageSpinner(false);
}

function displayIssues(issues, status = "all", search = "no") {
    const container = document.getElementById("issue_container");
    container.innerHTML = "";

    // Changed to accommodate the function call, as now we're calling displayIssue directly.
    if (search.toLowerCase() === 'no') {
        activeBtn(status);
    }

    if (search === "yes") {
        removeActiveBtn();
    }

    if (status === "all") {
        issue_count.innerText = issues.length;
        issues.forEach(issue => {
            container.appendChild(createIssueCard(issue))
        });
    } else {
        // Refactor array using filter
        const filtered = issues.filter(issue => issue.status === status);
        issue_count.innerText = filtered.length;

        filtered.forEach(issue => {
            container.appendChild(createIssueCard(issue));
        });
    };
}

function createIssueCard(issue) {
    const card = document.createElement("div");
    const borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";
    const priorityColor = issue.priority === "high" ? "red" : issue.priority === "medium" ? "yellow" : "gray";
    card.innerHTML = `
        <hr class="border-t-4 rounded-full ${borderColor}">
        <div class="flex justify-between items-center">
            <img src="${issue.status === "open" ? "./assets/Open-Status.png" : "./assets/Closed-Status.png"}" alt="image describing the state of the task">
            <p class="text-${priorityColor}-500 bg-${priorityColor}-300 rounded-xl text-center p-2">${issue.priority.toUpperCase()}</p>
        </div>
        <h6 class="font-semibold text-xl text-black h-10 mb-4">${issue.title}</h6>
        <p class="text-secondary h-25">${issue.description}</p>
        <div class="flex gap-1 justify-start items-center">
            <button class="flex gap-1 justify-center items-center border border-red-300 rounded-xl p-2"><i class="fa-solid fa-bug"></i> <span class="text-red-500">${issue.labels[0]}</span></button>
            ${issue.labels[1] ? `<button class="flex gap-1 justify-center items-center border border-yellow-300 rounded-xl p-2"><span class="text-yellow-500">${issue.labels[1]}</span></button>` : ""}
            
        </div>
        <hr class="text-secondary">
        <div class="flex justify-between items-center">
            <div class="flex flex-col justify-between items-start">
                <p class="text-secondary">#${issue.id} by ${issue.author}</p>
                <p class="text-secondary">${issue.createdAt}</p>
            </div>
            <i onclick="loadIssueDetails(${issue.id})" class="fa-solid fa-circle-info"></i>
        </div>
            `;
    card.classList.add("bg-white", "flex", "flex-col", "gap-2", "rounded-2xl", "shadow-sm", "pt-[.9]", "pb-2", "px-5", "space-y-2");

    return card;
}

async function loadIssueDetails(id) {
    const url = singleIssue + id;
    const detailsRes = await fetch(url);
    const detailsJSON = await detailsRes.json();
    displayDetails(detailsJSON.data);
}

function displayDetails(issue) {
    const container = document.getElementById("details_container");
    const status = issue.status === "open" ? "Opened" : "Closed";
    const statusColor = issue.status === "open" ? "green" : "purple";
    const priorityColor = issue.priority === "high" ? "red" : issue.priority === "medium" ? "yellow" : "gray";

    container.innerHTML = `
    <h6 class="font-semibold text-xl text-black h-10 mb-4">${issue.title}</h6>
    <div class="flex justify-start items-center gap-3">
        <p class="text-white bg-${statusColor}-500 rounded-xl text-center p-2">${status}</p>
        <p class="text-secondary">${status} by ${issue.author}</p>
    </div>
    <div class="flex gap-1 justify-start items-center">
            <button class="flex gap-1 justify-center items-center border border-red-300 rounded-xl p-2"><i class="fa-solid fa-bug"></i> <span class="text-red-500">${issue.labels[0]}</span></button>
            ${issue.labels[1] ? `<button class="flex gap-1 justify-center items-center border border-yellow-300 rounded-xl p-2"><span class="text-yellow-500">${issue.labels[1]}</span></button>` : ""}
            
    </div>
    <p class="text-secondary h-25">${issue.description}</p>
    <div class="flex justify-around items-center w-full bg-gray-300 px-3 py-5 rounded-xl shadow-sm">
        <div class="flex flex-col gap-1">
            <p class="text-secondary">Assignee:</p>
            <h6 class="font-medium text-black">${issue.assignee}</h6>
        </div>
        <div class="flex flex-col gap-1">
            <p class="text-secondary">Priority:</p>
             <p class="text-white bg-${priorityColor}-500 rounded-xl text-center px-3">${issue.priority.toUpperCase()}</p>
        </div>
    </div>
    `;

    container.className = "flex flex-col gap-y-2 justify-center items-start shadow-xl p-5 rounded-xl";

    document.getElementById("word_modal").showModal();

}

const activeBtn = (status = "all") => {
    removeActiveBtn();
    const active = document.getElementById(`btn_${status}`);
    active.classList.add("active");
}

const removeActiveBtn = () => {
    // Fetches all buttons with this pattern, maybe regex.
    const tabButtons = document.querySelectorAll("[id^='btn_']");
    tabButtons.forEach(btn => btn.classList.remove("active"));
}

const manageSpinner = (load_status) => {
    if (load_status === true) {
        document.getElementById("spinner").classList.remove("hidden");
    } else {
        document.getElementById("spinner").classList.add("hidden");
    }
}

const fetchSearch = async (word) => {
    if (!word) {
        displayIssues(allIssuesData, "all");
        return;
    }

    const searchTerm = searchIssue + word;
    const searchRes = await fetch(searchTerm);
    const searchJSON = await searchRes.json();
    displayIssues(searchJSON.data, "all", "yes");
}

// const searchIssues = async (word) => {
//     const filtered = allIssuesData.filter(issue => {
//         return (issue.title?.toLowerCase().includes(word) || issue.description?.toLowerCase().includes(word))
//     });
//     displayIssues(filtered, "all", "yes");
// }

// Refactored it to displayIssue directly to avoid having to fetch on each click. Since, we're already fetching once and retrieving all data.
document.getElementById("btn_all").addEventListener("click", () => displayIssues(allIssuesData, "all"));
document.getElementById("btn_all_nav").addEventListener("click", () => displayIssues(allIssuesData, "all"));

document.getElementById("btn_open").addEventListener("click", () => displayIssues(allIssuesData, "open"));
document.getElementById("btn_open_nav").addEventListener("click", () => displayIssues(allIssuesData, "open"));

document.getElementById("btn_closed").addEventListener("click", () => displayIssues(allIssuesData, "closed"));
document.getElementById("btn_closed_nav").addEventListener("click", () => displayIssues(allIssuesData, "closed"));

document.getElementById("btn_search").addEventListener("click", () => fetchSearch(document.getElementById("search_input").value.trim().toLowerCase()));

// Fetch Data.
loadAllIssues()