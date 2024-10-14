document.getElementById("finance-form").addEventListener("submit", addFinanceEntry);
document.getElementById("reset-button").addEventListener("click", resetFinanceData);

let financeData = JSON.parse(localStorage.getItem("financeData")) || [];

function addFinanceEntry(e) {
	e.preventDefault();

	const description = document.getElementById("description").value;
	const amount = parseFloat(document.getElementById("amount").value);
	const type = document.getElementById("type").value;

	const entry = {
		description,
		amount,
		type,
	};

	financeData.push(entry);
	localStorage.setItem("financeData", JSON.stringify(financeData));
	displayFinanceData();
	updateChart();
	e.target.reset();
}

function displayFinanceData() {
	const financeList = document.getElementById("finance-list");
	financeList.innerHTML = "";
	financeData.forEach((entry) => {
		const li = document.createElement("li");
		li.className = "list-group-item";
		li.textContent = `${entry.description}: ${entry.type === "income" ? "+" : "-"}${entry.amount}`;
		financeList.appendChild(li);
	});
}

const ctx = document.getElementById("financeChart").getContext("2d");
let financeChart;

function updateChart() {
	const income = financeData.filter((entry) => entry.type === "income").reduce((acc, entry) => acc + entry.amount, 0);
	const expense = financeData.filter((entry) => entry.type === "expense").reduce((acc, entry) => acc + entry.amount, 0);

	const data = {
		labels: ["Pemasukan", "Pengeluaran"],
		datasets: [
			{
				label: "Total Keuangan",
				data: [income, expense],
				backgroundColor: ["#28a745", "#dc3545"],
			},
		],
	};

	if (financeChart) {
		financeChart.destroy();
	}
	financeChart = new Chart(ctx, {
		type: "bar",
		data: data,
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	});
}

function resetFinanceData() {
	if (confirm("Apakah Anda yakin ingin menghapus semua catatan keuangan?")) {
		financeData = [];
		localStorage.removeItem("financeData");
		displayFinanceData();
		updateChart();
	}
}

// Load existing data on page load
window.onload = function () {
	displayFinanceData();
	updateChart();
};
