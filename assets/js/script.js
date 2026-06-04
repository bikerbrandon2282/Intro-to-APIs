
const API_KEY ="tM05mA69Jpab1_4Th77nGL2KPQA";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if (response.ok) {
        displayStatus(data);
    }
    else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    document.getElementById("resultsModalTitle").innerText = "API Key Status";
    document.getElementById("results-content").innerHTML = `<div>Your API key is valid until</div><div class="key-status">${data.expiry}</div>`;
    resultsModal.show();
}

async function postForm(e) {
    e.preventDefault();
    const form = new FormData(document.getElementById("checksform"));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY
        },
        body: form
    });
    const data = await response.json();
    if (response.ok) {
        displayErrors(data);
        document.getElementById("results-content").innerHTML = `<div>Errors: ${data.errors.length}</div><div>Source: <pre>${data.source}</pre></div>`;
        resultsModal.show();
    }
    else {
        throw new Error(data.error);
    }
}

async function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors.length === 0) {
        results = `<div class="no-errors">No errors reported!</div>`;
    } 
    else {
        results = `<div>Total Errors: <span class="error-count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `; 
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
        document.getElementById("resultsModalTitle").innerText = heading;
        document.getElementById("results-content").innerHTML = results;
        resultsModal.show();
    }
}