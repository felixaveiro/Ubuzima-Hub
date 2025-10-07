import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Use the default Node.js runtime so we can access the filesystem (fs).
export const runtime = 'nodejs'

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) return NextResponse.json({ files: [] })

    const files = fs.readdirSync(uploadsDir)
      .filter((name) => name.toLowerCase().endsWith('.pdf'))
      .map((name) => ({ name, url: `/uploads/${name}` }))
    return NextResponse.json({ files })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
