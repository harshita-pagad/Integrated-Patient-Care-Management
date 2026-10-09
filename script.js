
/* =========================
   LOGIN SYSTEM
========================= */

const users = {
    admin: {
        password: "admin123",
        role: "Administrator",
        name: "Hospital Administrator"
    },
    doctor: {
        password: "doctor123",
        role: "Doctor",
        name: "Dr. Hospital"
    },
    reception: {
        password: "reception123",
        role: "Receptionist",
        name: "Front Desk"
    },
    nurse: {
        password: "nurse123",
        role: "Nurse",
        name: "Nursing Staff"
    },
    billing: {
        password: "billing123",
        role: "Billing Staff",
        name: "Billing Department"
    }
};

let currentUser = null;
let currentRole = null;

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const selectedRole = document.getElementById("loginRole").value;

    if (!users[username]) {
        alert("Invalid username.");
        return;
    }

    if (users[username].password !== password) {
        alert("Incorrect password.");
        return;
    }

    if (
        username !== selectedRole &&
        !(username === "reception" && selectedRole === "receptionist")
    ) {
        alert("Please select the correct role.");
        return;
    }

    currentUser = username;
    currentRole = username === "reception" ? "receptionist" : username;

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("welcomeUser").textContent = users[username].name;
    document.getElementById("currentRole").textContent = users[username].role;

    setupPermissions();
    showPage("home");
}

/* =========================
   LOGOUT
========================= */

function logout() {
    currentUser = null;
    currentRole = null;

    document.getElementById("app").style.display = "none";
    document.getElementById("loginPage").style.display = "flex";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

/* =========================
   NAVIGATION
========================= */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    document.querySelectorAll(".navbar button").forEach(btn => {
        btn.classList.remove("active");
    });

    document.querySelectorAll(".navbar button").forEach(btn => {
        const text = btn.textContent.toLowerCase();
        const target = pageId === "printPage" ? "print" : pageId;

        if (text.includes(target)) {
            btn.classList.add("active");
        }
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================
   ROLE PERMISSIONS
========================= */

function setupPermissions() {
    setupPatients();
    setupPrescriptions();
    setupBilling();
    setupDischarge();
}

/* =========================
   PATIENT MANAGEMENT
========================= */

function setupPatients() {
    const container = document.getElementById("patientAccess");

    if (currentRole === "admin" || currentRole === "receptionist") {
        container.innerHTML = `
            <div class="card">
                <h2>Register New Patient</h2>
                <br>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Patient ID</label>
                        <input id="patientId"
                            value="P${Math.floor(1000 + Math.random() * 9000)}"
                            readonly>
                    </div>

                    <div class="form-group">
                        <label>Full Name</label>
                        <input id="patientName" placeholder="Patient name">
                    </div>

                    <div class="form-group">
                        <label>Age</label>
                        <input id="patientAge" type="number" placeholder="Age">
                    </div>

                    <div class="form-group">
                        <label>Gender</label>
                        <select id="patientGender">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Blood Group</label>
                        <select id="bloodGroup">
                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                            <option>O+</option>
                            <option>O-</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Phone</label>
                        <input id="patientPhone" placeholder="10 digit number">
                    </div>

                    <div class="form-group">
                        <label>Department</label>
                        <select id="patientDepartment">
                            <option>Cardiology</option>
                            <option>Neurology</option>
                            <option>Orthopaedics</option>
                            <option>Paediatrics</option>
                            <option>General Medicine</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Attending Doctor</label>
                        <select id="patientDoctor">
                            <option>Dr. Ananya Sharma</option>
                            <option>Dr. Rahul Mehta</option>
                            <option>Dr. Priya Rao</option>
                            <option>Dr. Arjun Kumar</option>
                        </select>
                    </div>
                </div>

                <div class="form-actions">
                    <button class="primary-btn" onclick="registerPatient()">
                        Register Patient
                    </button>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="card">
                <div class="access-denied">
                    <div class="lock">👁️</div>
                    <h2>View-Only Access</h2>
                    <p>
                        Your role can view patient records but cannot
                        modify patient registration information.
                    </p>
                </div>
            </div>
        `;
    }

    container.innerHTML += `
        <div class="card">
            <h2>Patient Directory</h2>
            <br>

            <div class="search-box">
                <input id="patientSearch"
                    placeholder="Search by Patient ID, name, phone or doctor"
                    onkeyup="searchPatients()">
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Blood</th>
                            <th>Department</th>
                            <th>Doctor</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody id="patientTable">
                        <tr>
                            <td>P1001</td>
                            <td>Rahul Sharma</td>
                            <td>42</td>
                            <td>O+</td>
                            <td>Cardiology</td>
                            <td>Dr. Ananya Sharma</td>
                            <td><span class="status green">Active</span></td>
                        </tr>

                        <tr>
                            <td>P1002</td>
                            <td>Priya Patil</td>
                            <td>29</td>
                            <td>A+</td>
                            <td>Neurology</td>
                            <td>Dr. Rahul Mehta</td>
                            <td><span class="status orange">Under Care</span></td>
                        </tr>

                        <tr>
                            <td>P1003</td>
                            <td>Arun Kumar</td>
                            <td>58</td>
                            <td>B+</td>
                            <td>Orthopaedics</td>
                            <td>Dr. Arjun Kumar</td>
                            <td><span class="status green">Active</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/* =========================
   REGISTER PATIENT
========================= */

function registerPatient() {
    const name = document.getElementById("patientName").value.trim();
    const age = document.getElementById("patientAge").value;
    const phone = document.getElementById("patientPhone").value.trim();

    if (!name || !age || !phone) {
        alert("Please fill all required patient details.");
        return;
    }

    const id = document.getElementById("patientId").value;
    const blood = document.getElementById("bloodGroup").value;
    const department = document.getElementById("patientDepartment").value;
    const doctor = document.getElementById("patientDoctor").value;

    const row = document.createElement("tr");

    [id, name, age, blood, department, doctor].forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = "status green";
    status.textContent = "Active";
    statusCell.appendChild(status);
    row.appendChild(statusCell);

    document.getElementById("patientTable").appendChild(row);

    alert("Patient registered successfully!\nPatient ID: " + id);

    // Prepare another ID for the next patient.
    document.getElementById("patientId").value =
        "P" + Math.floor(1000 + Math.random() * 9000);

    document.getElementById("patientName").value = "";
    document.getElementById("patientAge").value = "";
    document.getElementById("patientPhone").value = "";
}

/* =========================
   SEARCH PATIENTS
========================= */

function searchPatients() {
    const input = document.getElementById("patientSearch").value.toLowerCase();
    const rows = document.querySelectorAll("#patientTable tr");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}

/* =========================
   PRESCRIPTIONS
========================= */

function setupPrescriptions() {
    const container = document.getElementById("prescriptionAccess");

    if (currentRole === "admin" || currentRole === "doctor") {
        container.innerHTML = `
            <div class="card">
                <h2>Doctor Prescription Panel</h2>

                <p style="color:#777;margin-top:8px">
                    Only authorized doctors or administrators can
                    create and modify prescriptions.
                </p>
                <br>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Patient ID</label>
                        <input id="rxPatient" placeholder="P1001">
                    </div>

                    <div class="form-group">
                        <label>Diagnosis</label>
                        <input id="rxDiagnosis" placeholder="Diagnosis">
                    </div>

                    <div class="form-group">
                        <label>Medicine</label>
                        <input id="medicine" placeholder="Medicine name">
                    </div>

                    <div class="form-group">
                        <label>Dosage</label>
                        <input id="dosage" placeholder="Example: 1 tablet">
                    </div>

                    <div class="form-group">
                        <label>Duration</label>
                        <input id="duration" placeholder="Example: 5 days">
                    </div>

                    <div class="form-group">
                        <label>Doctor Notes</label>
                        <textarea id="doctorNotes" rows="3"
                            placeholder="Clinical instructions"></textarea>
                    </div>
                </div>

                <button class="primary-btn" onclick="savePrescription()">
                    💊 Save Prescription
                </button>
            </div>

            <div class="card">
                <h2>Prescription History</h2>
                <br>

                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Diagnosis</th>
                                <th>Medicine</th>
                                <th>Dosage</th>
                                <th>Duration</th>
                                <th>Doctor</th>
                            </tr>
                        </thead>

                        <tbody id="prescriptionTable">
                            <tr>
                                <td>P1001</td>
                                <td>Hypertension</td>
                                <td>Medicine A</td>
                                <td>1 tablet</td>
                                <td>5 days</td>
                                <td>Dr. Ananya Sharma</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="card">
                <div class="access-denied">
                    <div class="lock">🔒</div>
                    <h2>Access Restricted</h2>
                    <p>
                        Only doctors and administrators can create
                        or modify patient prescriptions.
                    </p>
                </div>
            </div>
        `;
    }
}

/* =========================
   SAVE PRESCRIPTION
========================= */

function savePrescription() {
    const patient = document.getElementById("rxPatient").value.trim();
    const diagnosis = document.getElementById("rxDiagnosis").value.trim();
    const medicine = document.getElementById("medicine").value.trim();
    const dosage = document.getElementById("dosage").value.trim();
    const duration = document.getElementById("duration").value.trim();

    if (!patient || !medicine || !dosage) {
        alert("Please enter patient and medicine details.");
        return;
    }

    const row = document.createElement("tr");
    const values = [
        patient,
        diagnosis,
        medicine,
        dosage,
        duration,
        "Authorized Doctor"
    ];

    values.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    document.getElementById("prescriptionTable").appendChild(row);

    alert("Prescription saved successfully.");

    document.getElementById("rxPatient").value = "";
    document.getElementById("rxDiagnosis").value = "";
    document.getElementById("medicine").value = "";
    document.getElementById("dosage").value = "";
    document.getElementById("duration").value = "";
    document.getElementById("doctorNotes").value = "";
}

/* =========================
   BILLING
========================= */

function setupBilling() {
    const container = document.getElementById("billingAccess");

    if (currentRole === "admin" || currentRole === "billing") {
        container.innerHTML = `
            <div class="card">
                <h2>Create Patient Invoice</h2>
                <br>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Patient ID</label>
                        <input id="billPatient" placeholder="P1001">
                    </div>

                    <div class="form-group">
                        <label>Room / Bed Charges</label>
                        <input id="bedCharge" type="number" value="500" min="0">
                    </div>

                    <div class="form-group">
                        <label>Doctor Consultation</label>
                        <input id="doctorCharge" type="number" value="500" min="0">
                    </div>

                    <div class="form-group">
                        <label>Lab Charges</label>
                        <input id="labCharge" type="number" value="300" min="0">
                    </div>

                    <div class="form-group">
                        <label>Medicine Charges</label>
                        <input id="medicineCharge" type="number" value="200" min="0">
                    </div>
                </div>

                <button class="primary-btn" onclick="generateBill()">
                    💳 Generate Invoice
                </button>
            </div>

            <div class="card">
                <h2>Invoice</h2>
                <div id="invoice">
                    <p>Enter patient details and generate invoice.</p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="card">
                <div class="access-denied">
                    <div class="lock">🔒</div>
                    <h2>Access Restricted</h2>
                    <p>
                        Billing records can only be modified by
                        billing staff or administrators.
                    </p>
                </div>
            </div>
        `;
    }
}

/* =========================
   GENERATE BILL
========================= */

function generateBill() {
    const patient = document.getElementById("billPatient").value.trim();

    const bed = Number(document.getElementById("bedCharge").value);
    const doctor = Number(document.getElementById("doctorCharge").value);
    const lab = Number(document.getElementById("labCharge").value);
    const medicine = Number(document.getElementById("medicineCharge").value);

    if (!patient) {
        alert("Please enter the Patient ID.");
        return;
    }

    if ([bed, doctor, lab, medicine].some(value => !Number.isFinite(value) || value < 0)) {
        alert("Please enter valid, non-negative charges.");
        return;
    }

    const total = bed + doctor + lab + medicine;
    const invoice = document.getElementById("invoice");

    invoice.replaceChildren();

    const wrapper = document.createElement("div");
    wrapper.className = "table-wrapper";

    const table = document.createElement("table");

    const rows = [
        ["Patient ID", patient],
        ["Bed Charges", `₹${bed}`],
        ["Doctor Consultation", `₹${doctor}`],
        ["Lab Charges", `₹${lab}`],
        ["Medicine Charges", `₹${medicine}`],
        ["Grand Total", `₹${total}`]
    ];

    rows.forEach(([label, value], index) => {
        const row = document.createElement("tr");
        const heading = document.createElement("th");
        const cell = document.createElement("td");

        heading.textContent = label;
        cell.textContent = value;

        if (index === rows.length - 1) {
            const strong = document.createElement("strong");
            strong.textContent = value;
            cell.textContent = "";
            cell.appendChild(strong);
        }

        row.append(heading, cell);
        table.appendChild(row);
    });

    wrapper.appendChild(table);
    invoice.appendChild(wrapper);
    invoice.appendChild(document.createElement("br"));

    const printButton = document.createElement("button");
    printButton.className = "print-btn";
    printButton.textContent = "🖨️ Print Invoice";
    printButton.onclick = () => window.print();

    invoice.appendChild(printButton);
}

/* =========================
   DISCHARGE
========================= */

function setupDischarge() {
    const container = document.getElementById("dischargeAccess");

    if (currentRole === "admin" || currentRole === "doctor") {
        container.innerHTML = `
            <div class="card">
                <h2>Patient Discharge Summary</h2>
                <br>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Patient ID</label>
                        <input id="dischargePatient" placeholder="P1001">
                    </div>

                    <div class="form-group">
                        <label>Doctor</label>
                        <input id="dischargeDoctor" value="Authorized Doctor">
                    </div>

                    <div class="form-group full-field">
                        <label>Final Diagnosis</label>
                        <textarea id="finalDiagnosis" rows="3"></textarea>
                    </div>

                    <div class="form-group full-field">
                        <label>Discharge Instructions</label>
                        <textarea id="dischargeInstructions" rows="4"></textarea>
                    </div>
                </div>

                <button class="primary-btn" onclick="completeDischarge()">
                    📄 Complete Discharge
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="card">
                <div class="access-denied">
                    <div class="lock">🔒</div>
                    <h2>Access Restricted</h2>
                    <p>
                        Discharge summaries can only be completed
                        by doctors or administrators.
                    </p>
                </div>
            </div>
        `;
    }
}

/* =========================
   COMPLETE DISCHARGE
========================= */

function completeDischarge() {
    const patient = document.getElementById("dischargePatient").value.trim();
    const diagnosis = document.getElementById("finalDiagnosis").value.trim();

    if (!patient || !diagnosis) {
        alert("Please enter patient ID and diagnosis.");
        return;
    }

    alert("Discharge completed successfully for " + patient);
}

/* =========================
   APPOINTMENTS
========================= */

function bookAppointment() {
    const patient = document.getElementById("appointmentPatient").value.trim();
    const doctor = document.getElementById("appointmentDoctor").value;
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;

    if (!patient || !date || !time) {
        alert("Please enter patient, date and time.");
        return;
    }

    const list = document.getElementById("appointmentList");
    const item = document.createElement("li");

    const timeLabel = document.createElement("b");
    timeLabel.textContent = time;

    const details = document.createElement("small");
    details.textContent = `Patient: ${patient} | ${date}`;

    item.append(
        timeLabel,
        document.createTextNode(" — " + doctor),
        document.createElement("br"),
        details
    );

    list.appendChild(item);

    alert("Appointment booked successfully.");

    document.getElementById("appointmentPatient").value = "";
    document.getElementById("appointmentDate").value = "";
    document.getElementById("appointmentTime").value = "";
    document.getElementById("appointmentReason").value = "";
}

/* =========================
   DOCTOR APPOINTMENT
========================= */

function doctorAppointment(doctor) {
    showPage("appointments");
    document.getElementById("appointmentDoctor").value = doctor;
}

/* =========================
   STARTUP
========================= */

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginPage").style.display = "flex";
});
