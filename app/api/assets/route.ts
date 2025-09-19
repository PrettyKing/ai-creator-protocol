import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const userId = request.nextUrl.searchParams.get('userId')
    const status = request.nextUrl.searchParams.get('status')

    let query = supabase.from('ip_assets').select('*')

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: assets, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const assetData = await request.json()

    const { data: asset, error } = await supabase
      .from('ip_assets')
      .insert(assetData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ asset }, { status: 201 })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, status, ip_id, license_terms } = body

    if (!id) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 })
    }

    const updateQuery = supabase
      .from('ip_assets')
      .update({
        ...(status && { status }),
        ...(ip_id && { ip_id }),
        ...(license_terms && { license_terms })
      })
      .eq('id', id)
      .select()
      .single()

    const { data: asset, error } = await updateQuery

    if (error) {
      throw error
    }

    return NextResponse.json({ asset })
  } catch (error) {
    console.error('Error updating asset:', error)
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 })
  }
}