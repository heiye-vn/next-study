import fs from "fs/promises";
import path from "path";

export interface Comment {
  id: string;
  name: string;
  email: string;
  message: string;
  userAgent: string;
  createdAt: string;
}

const DB_FILE = path.join(process.cwd(), "db.json");

// 初始化数据库文件
async function initDb() {
  try {
    await fs.access(DB_FILE);
  } catch {
    // 若文件不存在，初始化为空数组
    await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

/**
 * 获取所有留言，默认按时间倒序排列
 */
export async function getComments(): Promise<Comment[]> {
  await initDb();
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const comments = JSON.parse(data) as Comment[];
    return comments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("读取留言数据库失败:", error);
    return [];
  }
}

/**
 * 添加一条新留言
 */
export async function addComment(
  comment: Omit<Comment, "id" | "createdAt">
): Promise<Comment> {
  await initDb();
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const comments = JSON.parse(data) as Comment[];
    
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    comments.push(newComment);
    await fs.writeFile(DB_FILE, JSON.stringify(comments, null, 2), "utf-8");
    return newComment;
  } catch (error) {
    console.error("写入新留言失败:", error);
    throw new Error("数据库写入失败");
  }
}
