"use client"

import { useState, useEffect } from 'react'

export default function DemoUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<Array<{name:string,url:string}>>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { fetchFiles() }, [])

  async function fetchFiles() {
    try {
      const res = await fetch('/api/demo/list')
      const data = await res.json()
      setFiles(data.files || [])
    } catch (e) {
      console.error(e)
    }
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return setMessage('Select a file first')
    setLoading(true)
    setMessage('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/demo/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.success) {
        setMessage('Upload successful')
        setFile(null)
        fetchFiles()
      } else {
        setMessage(data.error || 'Upload failed')
      }
    } catch (err) {
      setMessage('Upload error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border">
      <h3 className="text-lg font-semibold mb-3">Demo Uploads</h3>
      {/* Embedded Google Drive folder view (public folder) */}
      {/* Folder ID: 10Zi7YVFZAXz6jrAO8LK_N_TrsdYON0__ */}
      <div className="mb-4">
        <div className="mb-2 text-sm text-gray-600">Documents (from Google Drive) — view and download from the embedded folder below:</div>
        <div className="w-full" style={{ maxWidth: '100%' }}>
          <iframe
            title="VitaScope Documents"
            src={`https://drive.google.com/embeddedfolderview?id=10Zi7YVFZAXz6jrAO8LK_N_TrsdYON0__#grid`}
            style={{ width: '100%', height: 420, border: 0 }}
          />
          <div className="mt-2 text-sm">
            <a className="text-[#1E3A8A]" href={`https://drive.google.com/drive/folders/10Zi7YVFZAXz6jrAO8LK_N_TrsdYON0__`} target="_blank" rel="noreferrer">Open folder in Google Drive</a>
          </div>
        </div>
      </div>
      <form onSubmit={upload} className="flex flex-col gap-3">
        {/* accept only PDF files */}
        <input accept="application/pdf" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="flex gap-2">
          <button disabled={loading} className="px-4 py-2 bg-[#1E3A8A] text-white rounded">Upload</button>
          <button type="button" onClick={() => { setFile(null); setMessage('') }} className="px-4 py-2 border rounded">Clear</button>
        </div>
        {message && <div className="text-sm text-gray-700">{message}</div>}
      </form>

      <hr className="my-4" />

      <div>
        <h4 className="font-medium mb-2">Uploaded Files</h4>
        {files.length === 0 && <div className="text-sm text-muted-foreground">No files yet</div>}
        <ul className="space-y-2">
          {files.map((f) => (
            <li key={`${f.name}-${f.url}`} className="flex items-center justify-between">
              <span className="text-sm truncate max-w-xs">{f.name}</span>
              <a className="text-sm text-[#1E3A8A]" href={f.url} target="_blank" rel="noreferrer" download>{/* download attr lets browser save the file */}
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
