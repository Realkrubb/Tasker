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
