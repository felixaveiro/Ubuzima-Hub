"use client"

import { useState, useEffect } from 'react'
import { Upload, FileText, Download, X, CheckCircle, AlertCircle, ExternalLink, FolderOpen } from 'lucide-react'

export default function DemoUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<Array<{name:string,url:string}>>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

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
    if (!file) {
      setMessage('Please select a PDF file first')
      setMessageType('error')
      return
    }
    setLoading(true)
    setMessage('')
    setMessageType('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/demo/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.success) {
        setMessage('File uploaded successfully')
        setMessageType('success')
        setFile(null)
        fetchFiles()
      } else {
        setMessage(data.error || 'Upload failed')
        setMessageType('error')
      }
    } catch (err) {
      setMessage('Upload error occurred')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Google Drive Section */}
      <div className="bg-gradient-to-br from-[#005BAC]/5 to-white rounded-2xl shadow-lg border-2 border-[#005BAC]/10 overflow-hidden mb-6">
        <div className="bg-[#005BAC] text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6" />
            <div>
              <h3 className="text-xl font-bold">Document Repository</h3>
              <p className="text-sm text-white/90">Access VitaScope resources and documentation</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
            <iframe
              title="VitaScope Documents"
              src="https://drive.google.com/embeddedfolderview?id=10Zi7YVFZAXz6jrAO8LK_N_TrsdYON0__#grid"
              className="w-full"
              style={{ height: 420, border: 0 }}
            />
          </div>
          <div className="mt-4 flex items-center justify-center">
            <a 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#005BAC] text-[#005BAC] rounded-lg hover:bg-[#005BAC] hover:text-white transition-all duration-300 font-semibold text-sm"
              href="https://drive.google.com/drive/folders/10Zi7YVFZAXz6jrAO8LK_N_TrsdYON0__" 
              target="_blank" 
              rel="noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Google Drive
            </a>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#005BAC]/10 overflow-hidden">
        <div className="bg-gradient-to-r from-[#005BAC] to-[#0070cc] text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <Upload className="h-6 w-6" />
            <div>
              <h3 className="text-xl font-bold">Upload Documents</h3>
              <p className="text-sm text-white/90">PDF files only • Max 10MB</p>
            </div>
          </div>
        </div>

        <form onSubmit={upload} className="p-6">
          {/* Drag & Drop Zone */}
          <div className="mb-6">
            <label 
              htmlFor="file-upload"
              className={`
                relative block w-full rounded-xl border-2 border-dashed 
                ${file ? 'border-[#005BAC] bg-[#005BAC]/5' : 'border-gray-300 bg-[#E6E8EB]/50'}
                hover:border-[#005BAC] hover:bg-[#005BAC]/5
                transition-all duration-300 cursor-pointer
              `}
            >
              <div className="p-8 text-center">
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#005BAC]/10 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-[#005BAC]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 truncate max-w-md">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setFile(null)
                        setMessage('')
                        setMessageType('')
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <X className="h-4 w-4" />
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-1">PDF files only</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null)
                  setMessage('')
                  setMessageType('')
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`
              mb-4 p-4 rounded-lg flex items-center gap-3
              ${messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}
            `}>
              {messageType === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#005BAC] text-white rounded-xl font-semibold hover:bg-[#004a8f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Upload File
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null)
                setMessage('')
                setMessageType('')
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Uploaded Files List */}
        <div className="border-t-2 border-gray-100 bg-[#E6E8EB]/30 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900">Uploaded Files</h4>
            <span className="px-3 py-1 bg-[#005BAC]/10 text-[#005BAC] rounded-full text-sm font-semibold">
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          
          {files.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No files uploaded yet</p>
              <p className="text-sm text-gray-400 mt-1">Upload your first PDF document to get started</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {files.map((f) => (
                <li 
                  key={`${f.name}-${f.url}`}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-[#005BAC] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-900 truncate">{f.name}</span>
                  </div>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#005BAC]/10 text-[#005BAC] rounded-lg hover:bg-[#005BAC] hover:text-white transition-all duration-300 font-semibold text-sm flex-shrink-0 ml-4 group-hover:shadow-md"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}