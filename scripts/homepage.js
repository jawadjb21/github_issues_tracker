const allIssues = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
let singleIssue = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";
let searchIssue = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

let allIssuesData = [];
let openIssues = [];
let closedIssues = [];

const loadAllIssues = async () => {
    const issuesRes = await fetch(allIssues);
    const issuesJSON = await issuesRes.json();
    allIssuesData = issuesJSON.data;
    displayIssues(allIssuesData);
}

function displayIssues(issues, status = "all") {
    const container = document.getElementById("issue_container");
    container.innerHTML = "";

    openIssues.length = 0;
    closedIssues.length = 0;

    issues.forEach(issue => {
        if (issue.status === 'open') {
            openIssues.push(issue);
        } else if (issue.status === 'closed') {
            closedIssues.push(issue);
        }
    }
    )
    if(status === "open"){
        openIssues.forEach(issue => {
            container.appendChild(createIssueCard(issue));
        })
    }
    else if(status === "closed"){
        closedIssues.forEach(issue => {
            container.appendChild(createIssueCard(issue));
        })
    }
    else{
        issues.forEach(issue => {
            container.appendChild(createIssueCard(issue))
        })
    }
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
        <h6 class="font-semibold text-xl text-black">${issue.title}</h6>
        <p class="text-secondary">${issue.description}</p>
        <div class="flex gap-1 justify-start items-center">
            <button class="flex gap-1 justify-center items-center border border-red-300 rounded-xl p-2"><i class="fa-solid fa-bug"></i> <span class="text-red-500">${issue.labels[0]}</span></button>
            ${issue.labels[1]? `<button class="flex gap-1 justify-center items-center border border-yellow-300 rounded-xl p-2"><span class="text-yellow-500">${issue.labels[1]}</span></button>`:""}
            
        </div>
        <hr class="text-secondary">
        <p class="text-secondary">#${issue.id} by ${issue.author}</p>
        <p class="text-secondary">${issue.createdAt}</p>
        `;
    card.classList.add("bg-white", "flex", "flex-col", "gap-2","rounded-2xl", "shadow-sm","pt-.9", "pb-2", "px-5", "space-y-2");
    return card;
}


loadAllIssues()