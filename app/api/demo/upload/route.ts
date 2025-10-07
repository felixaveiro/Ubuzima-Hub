import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Use Node.js runtime to allow filesystem access for demo uploads.
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    // Basic validation: enforce PDF uploads only
    const contentType = (file as any).type || ''
    const filename = (file as any).name || ''
    const isPdfMime = contentType === 'application/pdf'
    const isPdfExt = filename.toLowerCase().endsWith('.pdf')
    if (!isPdfMime && !isPdfExt) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(uploadsDir, safeName)
    fs.writeFileSync(filePath, buffer)

    return NextResponse.json({ success: true, file: `/uploads/${safeName}` })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
