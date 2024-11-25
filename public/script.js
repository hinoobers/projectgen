document.addEventListener("DOMContentLoaded", function() {
    console.log("Loaded!")

    const form = document.querySelector("form");
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const hours = document.getElementById("hours").value

        fetch("/generate", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({hours})
        }).then(res => res.json()).then(data => {
            const projects = data.projects;

            const resultsDiv = document.querySelector(".projects");
            resultsDiv.innerHTML = "";
            for(let i = 0; i < projects.length; i++) {
                const result = document.createElement("div");
                result.classList.add("project");

                const title = document.createElement("h3");
                title.textContent = projects[i].project_name
                result.appendChild(title);

                const description = document.createElement("p");
                description.textContent = projects[i].description;
                result.appendChild(description);

                const hours = document.createElement("h4");
                hours.textContent = projects[i].time_estimate;
                result.appendChild(hours);

                resultsDiv.appendChild(result);
            }
        }).then(err => {
            console.error(err)
        })
    })
})