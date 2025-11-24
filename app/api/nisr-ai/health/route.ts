/**
 * NISR AI Health Check API Route
 * Checks if Python backend is available
 */

import { NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const response = await fetch(`${PYTHON_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          python_backend: 'error',
          message: 'Python backend returned error',
        },
        { status: 503 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'healthy',
      python_backend: 'ok',
      python_status: data.status,
      python_message: data.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        python_backend: 'unreachable',
        message: 'Python backend is not running',
        error: error.message,
        help: 'Start Python backend with: cd python-ai && python api_server.py',
      },
      { status: 503 }
    );
  }
}
