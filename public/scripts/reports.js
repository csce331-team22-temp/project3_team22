// Insert the report box into the body (initially hidden)
document.body.insertAdjacentHTML('afterbegin', `
    <div id="reportBox" style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 800px;
        max-height: 60vh;
        overflow-y: auto;
        padding: 20px;
        border: 2px solid #333;
        background-color: #fff;
        text-align: left;
        font-size: 1.1rem;
        display: none;  /* Initially hidden */
        z-index: 10;
        box-shadow: 0 0 15px rgba(0,0,0,0.3);
        border-radius: 8px;
    ">
    </div>
`);

const reportBox = document.getElementById("reportBox");

// Restore report content from localStorage (if any)
const savedReport = localStorage.getItem("lastReportText");
if (savedReport) {
    reportBox.innerHTML = savedReport;
}

// Check sessionStorage to see if report was generated during this session
const reportGeneratedThisSession = sessionStorage.getItem("reportGenerated");

// If the report was generated during this session, make it visible after refresh
if (reportGeneratedThisSession) {
    reportBox.style.display = "block";
}

// Function to generate the report HTML
function generateReportHtml(data, reportType = 'X') {
    const totalTender =
        parseFloat(data.paymentSummary.cash || 0) +
        parseFloat(data.paymentSummary.credit || 0) +
        parseFloat(data.paymentSummary.debit || 0) +
        parseFloat(data.paymentSummary.giftcard || 0);

    let totalDrinksSold = 0;
    let totalDrinkSales = 0;
    const drinkSalesHtml = data.drinkSales.map(drink => {
        totalDrinksSold += parseFloat(drink.quantity_sold);
        totalDrinkSales += parseFloat(drink.total_sales);
        return `
            <tr>
                <td style="padding: 8px 12px;">${drink.drinkname}</td>
                <td style="padding: 8px 12px; text-align: center;">${drink.quantity_sold}</td>
                <td style="padding: 8px 12px;">$${parseFloat(drink.total_sales).toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    const text = `
        <div id="report-body" style="padding: 20px;">
            <div id="report-title" style="font-size: 1.8rem; font-weight: bold; margin-bottom: 20px; text-align: left;">
                ${reportType === 'X' ? 'X-Report' : 'Z-Out Reset Report'}
            </div>

            <div id="report-address" style="font-size: 1rem; margin-bottom: 25px; line-height: 1.6; text-align: left;">
                <strong>ShareTea</strong><br>
                <strong>123 Main Street</strong><br>
                <strong>Anytown, USA</strong>
            </div>

            <div id="report-time_subtitle" style="font-size: 0.95rem; color: gray; margin-bottom: 35px; text-align: left;">
                Report run on <strong>${new Date().toLocaleDateString()}</strong> at <strong>${new Date().toLocaleTimeString()}</strong>
            </div>

            <div id="report-content" style="text-align: left; margin-bottom: 40px;">
                <div id="report-content-title" style="font-size: 1.4rem; font-weight: bold; margin-bottom: 10px;">
                    Tender Summary
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tbody>
                        <tr>
                            <td style="padding: 8px 12px;">Cash:</td>
                            <td style="padding: 8px 12px;">$${parseFloat(data.paymentSummary.cash || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px;">Credit:</td>
                            <td style="padding: 8px 12px;">$${parseFloat(data.paymentSummary.credit || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px;">Debit:</td>
                            <td style="padding: 8px 12px;">$${parseFloat(data.paymentSummary.debit || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px;">Gift Card:</td>
                            <td style="padding: 8px 12px;">$${parseFloat(data.paymentSummary.giftcard || 0).toFixed(2)}</td>
                        </tr>
                        <tr style="font-weight: bold;">
                            <td style="padding: 12px 12px;">Total Tender:</td>
                            <td style="padding: 12px 12px;">$${totalTender.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div id="drink-sales" style="text-align: center;">
                <div id="drink-sales-title" style="font-size: 1.4rem; font-weight: bold; margin-bottom: 10px;">
                    Drink Sales Summary
                </div>
                <table style="width: 100%; border-collapse: collapse; margin: 0 auto 20px auto;">
                    <thead style="font-weight: bold;">
                        <tr>
                            <td style="padding: 8px 12px;">Drink Name</td>
                            <td style="padding: 8px 12px; text-align: center;">Quantity Sold</td>
                            <td style="padding: 8px 12px;">Total Sales</td>
                        </tr>
                    </thead>
                    <tbody>
                        ${drinkSalesHtml}
                        <tr style="font-weight: bold;">
                            <td style="padding: 12px 12px;">TOTAL</td>
                            <td style="padding: 12px 12px; text-align: center;">${totalDrinksSold}</td>
                            <td style="padding: 12px 12px;">$${totalDrinkSales.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    reportBox.innerHTML = text;
    reportBox.style.display = "block";

    // Store the report content in localStorage and flag it in sessionStorage
    localStorage.setItem("lastReportText", text);
    sessionStorage.setItem("reportGenerated", "true");

    return text;
}

// Button event listeners for X and Z Reports
document.getElementById("x-reportBtn").addEventListener("click", async function () {
    try {
        const response = await fetch(`/staff/reports/x`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        const html = generateReportHtml(data, 'X');

        reportBox.style.display = "block";
        localStorage.setItem("lastReportText", html);

    } catch (error) {
        console.error("X Report Error:", error);
        reportBox.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        reportBox.style.display = "block";
    }
});

document.getElementById("z-reportBtn").addEventListener("click", async function () {
    try {
        const response = await fetch(`/staff/reports/z`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        const html = generateReportHtml(data, 'Z');

        reportBox.style.display = "block";
        localStorage.setItem("lastReportText", html);

    } catch (error) {
        console.error("Z Report Error:", error);
        reportBox.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        reportBox.style.display = "block";
    }
});


function goToManagerDashboard() {
    window.location.href = "/staff/manager-dashboard";
}
