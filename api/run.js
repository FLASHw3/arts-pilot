function loadUsers() {
  // Önerilen kullanım: ADMIN_USERS='[{"username":"berk","password":"...","role":"admin","name":"Berk"}]'
  if (process.env.ADMIN_USERS) {
    try {
      const users = JSON.parse(process.env.ADMIN_USERS);
      if (Array.isArray(users)) return users;
    } catch (e) {
      // Aşağıda tek kullanıcı yöntemine düşer.
    }
  }

  const username = process.env.ARTS_ADMIN_USERNAME || process.env.ADMIN_USERNAME || "berk";
  const password = process.env.ARTS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!password) return [];
  return [{ username, password, role: "admin", name: process.env.ARTS_ADMIN_NAME || username }];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Sadece POST desteklenir." });
  }

  const users = loadUsers();
  if (!users.length) {
    return res.status(500).json({
      success: false,
      error: "Yönetici bilgileri tanımlı değil. Vercel Environment Variables bölümüne ARTS_ADMIN_USERNAME ve ARTS_ADMIN_PASSWORD ekle."
    });
  }

  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");

  const user = users.find(u =>
    String(u.username || "").trim() === username &&
    String(u.password || "") === password
  );

  if (!user) {
    return res.status(401).json({ success: false, error: "Kullanıcı adı veya şifre hatalı." });
  }

  return res.status(200).json({
    success: true,
    username: user.username,
    name: user.name || user.username,
    role: user.role || "admin"
  });
}
