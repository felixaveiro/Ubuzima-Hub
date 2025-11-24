/**
 * NISR AI Chat API Route
 * Proxies requests to Python AI backend
 */

import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, max_context_docs = 5 } = body;

    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    if (query.length > 1000) {
      return NextResponse.json(
        { error: 'Query too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Call Python backend
    const response = await fetch(`${PYTHON_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        max_context_docs,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: 'AI service error',
          details: errorData.detail || 'Unknown error',
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('NISR AI API error:', error);

    // Check if Python backend is unreachable
    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        {
          error: 'AI service unavailable',
          message: 'Python backend is not running. Please start it with: cd python-ai && python api_server.py',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'NISR AI Chat API',
    usage: 'Send POST request with { "query": "your question" }',
    documentation: '/python-ai/README.md',
  });
}
