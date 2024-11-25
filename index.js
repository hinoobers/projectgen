const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static("public/"))
app.use(express.json());

let parsedProjects = JSON.parse(fs.readFileSync("ideas.json"))
// sort from lowest to highest time estimate, otherwise we would give user project that would take like 5 days, even though they only need 1 :/ 
parsedProjects.sort((a, b) => {
    const aHours = parseFloat(a.time_estimate.replace("h", "").replace("d", "") * (a.time_estimate.endsWith("d") ? 24 : 1));
    const bHours = parseFloat(b.time_estimate.replace("h", "").replace("d", "") * (b.time_estimate.endsWith("d") ? 24 : 1));
    return aHours - bHours;
})

// I think POST request best for this?
app.post("/generate", (req, res) => {
    const {
        hours
    } = req.body;

    if(!hours) {
        return res.status(400).json({
            error: "Please provide hours"
        });
    }

    let optimalProjects = [];
    // There are many ways to achieve this goal, however we want the most optimal way
    // For eaxmple, if we have 1h project and 2h project and 6h project, and user wants 5h, we should give them 1h and 2h project, not 6h project
    let remainingHours = hours;
    for(let i = 0; i < parsedProjects.length; i++) {
        const proj = parsedProjects[i];
        const projHours = parseFloat(proj.time_estimate.replace("h", "").replace("d", "") * (proj.time_estimate.endsWith("d") ? 24 : 1));

        if(projHours <= remainingHours) {
            optimalProjects.push(proj);
            remainingHours -= projHours;
        }

        if(remainingHours <= 0) {
            break;
        }
    }

    return res.json({projects: optimalProjects});
})

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});