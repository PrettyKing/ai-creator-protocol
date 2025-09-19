import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data: integrations, error } = await supabase
      .from('social_integrations')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    return NextResponse.json({ integrations })
  } catch (error) {
    console.error('Error fetching social integrations:', error)
    return NextResponse.json({ error: 'Failed to fetch social integrations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const integrationData = await request.json()

    const { data: integration, error } = await supabase
      .from('social_integrations')
      .insert(integrationData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ integration }, { status: 201 })
  } catch (error) {
    console.error('Error creating social integration:', error)
    return NextResponse.json({ error: 'Failed to create social integration' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { id, metrics } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 })
    }

    const { data: integration, error } = await supabase
      .from('social_integrations')
      .update({ metrics })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ integration })
  } catch (error) {
    console.error('Error updating social integration:', error)
    return NextResponse.json({ error: 'Failed to update social integration' }, { status: 500 })
  }
}