const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const pool = require("./db");
const { PDFDocument } = require("pdf-lib");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("page-change", async ({ userId, pageId }) => {
    try {
      console.log("page change")
      const sessionId = await getSessionId(userId);
      await pool.query(
        "UPDATE Sessions SET active_page_id = $1 WHERE session_id = $2",
        [pageId, sessionId]
      );
      io.emit("update-user-count");
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected");
    io.emit("update-user-count");
  });
});

app.get("/active-users", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT COUNT(DISTINCT user_id) AS active_users FROM Sessions WHERE is_active = TRUE"
  );
  res.json(rows[0]);
});  

app.get("/active-page1-users", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT COUNT(DISTINCT user_id) AS active_users FROM Sessions WHERE active_page_id=1 AND is_active = true"
  );
  res.json(rows[0]);
});

app.get("/report/date/:date", async (req, res) => {
  const { date } = req.params;
  const { rows } = await pool.query(
    `SELECT COUNT(DISTINCT user_id) AS total_users,
            JSON_AGG(page_id) AS page_visit_count,
            AVG(duration) AS average_duration
     FROM Page_Visits
     WHERE entry_time::DATE = $1
     GROUP BY page_id`,
    [date]
  );
  res.json(rows);
});

app.get("/report/download/:date", async (req, res) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText("Report Data", { x: 50, y: 700 });
  const pdfBytes = await pdfDoc.save();
  res.contentType("application/pdf");
  res.send(pdfBytes);
});

app.post("/user", async (req, res) => {
  const { username } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO Users (username) VALUES ($1) RETURNING user_id",
      [username]
    );

    const userId = result.rows[0].user_id;

    const sessionResult = await pool.query(
      "INSERT INTO Sessions (user_id) VALUES ($1) RETURNING session_id",
      [userId]
    );

    const sessionId = sessionResult.rows[0].session_id;

    res.json({ userId, sessionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user and start session" });
  }
});

app.post("/page-visit", async (req, res) => {
  const { sessionId, pageId } = req.body;

  try {
    await pool.query(
      "INSERT INTO Page_Visits (session_id, page_id, entry_time) VALUES ($1, $2, CURRENT_TIMESTAMP)",
      [sessionId, pageId]
    );

    await pool.query(
      "UPDATE Sessions SET active_page_id = $1 WHERE session_id = $2",
      [pageId, sessionId]
    );

    io.emit("update-user-count");
    res.status(200).json({ message: "Page visit logged" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log page visit" });
  }
});

server.listen(4000, () =>
  console.log("Server running on http://localhost:4000")
);

async function getSessionId(userId) {
  const { rows } = await pool.query(
    "SELECT session_id FROM Sessions WHERE user_id = $1 AND is_active = true",
    [userId]
  );
  return rows[0]?.session_id;
}
