// Insert the report box into the body (centered)
document.body.insertAdjacentHTML('afterbegin', `
    <div id="reportBox" style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        max-height: 80%;
        max-width: 600px;
        padding: 20px;
        border: 2px solid #333;
        background-color: #fff;
        text-align: center;
        font-size: 1.2rem;
        display: none;
        z-index: 10;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        border-radius: 8px;
    ">
    </div>
`);

const reportBox = document.getElementById("reportBox");

// Restore report content from localStorage (if any)
const savedReport = localStorage.getItem("lastReportText");
if (savedReport) {
    reportBox.innerHTML = savedReport;
    reportBox.style.display = "block";
}

// Button event listeners
document.getElementById("x-reportBtn").addEventListener("click", async function () {
    const text = "📄 Here is the X Report data (placeholder text)";
    reportBox.innerHTML = text;
    reportBox.style.display = "block";
    localStorage.setItem("lastReportText", text);
});

document.getElementById("z-reportBtn").addEventListener("click", async function () {
    try {
        const response = await fetch(`/staff/reports/add`);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        const text = `
        <div id="report-body">
            <div id="report-title"><strong>Z-Out Reset Report</strong></div>
            <div id="report-address">
                ShareTea<br>
                123 Main Street<br>
                Anytown, USA
            </div>
            <br>
            <div id="report-time_subtitle">
                Report was run on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
            </div>
        </div>
        <br><br>
        <div id="report-content">
            <div id="report-content-title"><strong>Tender Summary</strong></div>
            <div id="report-content-body">
                <p><strong>Cash:</strong> $${parseFloat(data.cash || 0).toFixed(2)}</p>
                <p><strong>Credit:</strong> $${parseFloat(data.credit || 0).toFixed(2)}</p>
                <p><strong>Debit:</strong> $${parseFloat(data.debit || 0).toFixed(2)}</p>
                <p><strong>Gift Card:</strong> $${parseFloat(data.giftCard || 0).toFixed(2)}</p>
            </div>
        </div>
        `;

        reportBox.innerHTML = text;
        reportBox.style.display = "block";
        localStorage.setItem("lastReportText", text);

    } catch (error) {
        console.error("Error fetching report data:", error);
        reportBox.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        reportBox.style.display = "block";
    }
});


function goToManagerDashboard() {
    window.location.href = "/staff/manager-dashboard";
}
