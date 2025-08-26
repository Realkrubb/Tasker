// เก็บข้อมูล task ในรูปแบบ array
let tasks = [];

// ฟังก์ชันสร้าง Task ใหม่
function createTask(accountID, taskName, dueTime, reward) {
    // สร้าง object task
    const newTask = {
        taskID: Date.now(), // ใช้ timestamp เป็น id
        accountID: accountID,
        taskName: taskName,
        dueTime: dueTime, // รูปแบบเช่น "2025-08-12 19:00"
        reward: reward,
        status: "pending" // pending, finished
    };

    tasks.push(newTask);
    console.log("Task created:", newTask);
    return newTask;
}

// ฟังก์ชันเช็ค Task ของ accountID
function checkTask(accountID) {
    const userTasks = tasks.filter(task => task.accountID === accountID);
    console.log("Tasks for account:", accountID, userTasks);
    return userTasks;
}

// 🧪 ตัวอย่างการใช้งาน
createTask(1, "Do sit up", "2025-08-12 19:00", "Eating");
createTask(1, "Do homework", "2025-08-12 20:00", "Eat milk");
createTask(2, "Read book", "2025-08-12 21:00", "Watch TV");

checkTask(1); // แสดงเฉพาะ task ของ accountID 1

// finish task
function finishTask(taskID) {
    // หา task จาก ID
    const taskIndex = tasks.findIndex(task => task.taskID === taskID);

    if (taskIndex === -1) {
        console.error("❌ Task not found:", taskID);
        return;
    }

    // อัพเดท task status
    const finishedTask = tasks[taskIndex];
    finishedTask.status = "finished";

    // แสดง popup
    showFinishPopup(finishedTask);

    // ลบ task ออกจากฐานข้อมูลหลังทำ task เสร็จ
    tasks.splice(taskIndex, 1);

    console.log("✅ Task finished & removed:", finishedTask);
}

// ทำ Popup โชว์รางวัล (ชั่วคราว)🛑
// รอfrontend pop-up ทำUI
function showFinishPopup(task) {
    const popup = document.createElement("div");
    popup.classList.add("popup");

    popup.innerHTML = `
        <div class="popup-content">
            <h3>🎉 Congratulations!</h3>
            <p>You finished: <b>${task.taskName}</b></p>
            <p>Reward: <b>${task.reward}</b></p>
            <button id="closePopupBtn">Close</button>
        </div>
    `;

    // Basic inline CSS style
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0,0,0,0.5)";
    popup.style.display = "flex";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "center";
    popup.style.zIndex = "1000";

    popup.querySelector(".popup-content").style.background = "#fff";
    popup.querySelector(".popup-content").style.padding = "20px";
    popup.querySelector(".popup-content").style.borderRadius = "8px";
    popup.querySelector(".popup-content").style.textAlign = "center";

    // Append popup to DOM
    document.body.appendChild(popup);

    // Close button
    document.getElementById("closePopupBtn").onclick = () => {
        popup.remove();
    };
}

// ตัวอย่างการสร้างและเสร็จ tasks
const t1 = createTask(1, "Sleep 8 hours", "2025-08-12 18:00", "Watch a movie");
checkTask(1);
// User finishes the task → call on button click
finishTask(t1.taskID);
