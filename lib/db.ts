// import { neon } from "@neondatabase/serverless"

// const dbUrl = process.env.NEON_NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.NEON_POSTGRES_URL || ""

// if (!dbUrl) {
//   throw new Error(" Database URL not found. Please set NEON_DATABASE_URL environment variable.")
// }

// const sql = neon(dbUrl)

// export { sql }

// export async function query(text: string, params?: any[]) {
//   try {
//     console.log(" Executing query with", params?.length || 0, "parameters")
//     const result = await sql.query(text, params || [])
//     console.log(" Query successful, returned", result.rows?.length || 0, "rows")
//     return result.rows
//   } catch (error) {
//     console.error(" Database query error:", error)
//     throw error
//   }
// }
