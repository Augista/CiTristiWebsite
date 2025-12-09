import { query } from "./db"

export async function verifyAdmin(email: string, password: string) {
  try {
    const result = await query("SELECT * FROM admin_users WHERE email = $1", [email])

    if (!result || result.length === 0) {
      return null
    }

    const user = result[0]

    // Simple password comparison (in production, use bcrypt)
    // For demo: comparing plain text password
    const passwordValid = await comparePasswords(password, user.password_hash)

    if (!passwordValid) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch (error) {
    console.error(" Auth verification error:", error)
    return null
  }
}

async function comparePasswords(password: string, hash: string): Promise<boolean> {
  // Simple comparison for demo (in production, use bcrypt)
  try {
    const response = await fetch("/api/auth/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, hash }),
    })
    const data = await response.json()
    return data.valid
  } catch (error) {
    console.error(" Password comparison error:", error)
    return password === hash
  }
}

export async function createAdmin(email: string, name: string, password: string) {
  try {
    const hashedPassword = await hashPassword(password)
    const result = await query(
      "INSERT INTO admin_users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, name, hashedPassword],
    )
    return result[0]
  } catch (error) {
    console.error(" Create admin error:", error)
    throw error
  }
}

async function hashPassword(password: string): Promise<string> {
  try {
    const response = await fetch("/api/auth/hash-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    const data = await response.json()
    return data.hash
  } catch (error) {
    console.error(" Password hashing error:", error)
    return password // Fallback to plain text for demo
  }
}
