/**
 * Tạm ẩn app/admin và app/api khỏi App Router rồi chạy `next build` (static export).
 * Đổi tên được hoàn tác trong finally — kể cả khi build lỗi.
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = __dirname;
const appDir = path.join(root, "app");

const moves = [
  { from: "admin", to: "_admin", label: "admin" },
  { from: "api", to: "_api", label: "api" },
];

function log(msg) {
  console.log(`[export-static] ${msg}`);
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function safeRename(fromPath, toPath, desc) {
  if (!exists(fromPath)) return false;
  if (exists(toPath)) {
    throw new Error(`Không đổi tên ${desc}: đích đã tồn tại — ${toPath}`);
  }
  fs.renameSync(fromPath, toPath);
  return true;
}

let exitCode = 0;
const applied = [];

try {
  log("Tạm đổi tên thư mục động (nếu có)…");
  for (const { from, to, label } of moves) {
    const fromPath = path.join(appDir, from);
    const toPath = path.join(appDir, to);
    if (safeRename(fromPath, toPath, label)) {
      applied.push({ fromPath, toPath, label });
      log(`  → ${from}/ → ${to}/`);
    } else {
      log(`  (bỏ qua app/${from}/ — không có)`);
    }
  }

  const nextDir = path.join(root, ".next");
  if (exists(nextDir)) {
    log("Xóa .next (tránh lệch types khi đổi tên route)…");
    fs.rmSync(nextDir, { recursive: true, force: true });
  }

  log("Chạy: npx next build");
  const result = spawnSync("npx", ["next", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  exitCode = result.status ?? (result.error ? 1 : 0);
  if (exitCode !== 0) {
    log(`Build kết thúc với mã ${exitCode}.`);
  } else {
    log("Build thành công. Kết quả trong thư mục out/");
  }
} catch (err) {
  console.error("[export-static] Lỗi:", err.message || err);
  exitCode = 1;
} finally {
  log("Khôi phục tên thư mục…");
  for (let i = applied.length - 1; i >= 0; i--) {
    const { fromPath, toPath, label } = applied[i];
    try {
      if (exists(toPath) && !exists(fromPath)) {
        fs.renameSync(toPath, fromPath);
        log(`  ← ${path.basename(toPath)}/ → ${path.basename(fromPath)}/`);
      }
    } catch (e) {
      console.error(`[export-static] CRITICAL: không đổi lại ${label}:`, e.message || e);
      exitCode = 1;
    }
  }
  log("Trạng thái app/ đã được khôi phục.");
}

process.exit(exitCode);
