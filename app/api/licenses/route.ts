import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const assetId = request.nextUrl.searchParams.get('assetId')
    const licenseeId = request.nextUrl.searchParams.get('licenseeId')

    let query = supabase.from('licenses').select('*')

    if (assetId) {
      query = query.eq('asset_id', assetId)
    }

    if (licenseeId) {
      query = query.eq('licensee_id', licenseeId)
    }

    const { data: licenses, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ licenses })
  } catch (error) {
    console.error('Error fetching licenses:', error)
    return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const licenseData = await request.json()

    const { data: license, error } = await supabase
      .from('licenses')
      .insert(licenseData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ license }, { status: 201 })
  } catch (error) {
    console.error('Error creating license:', error)
    return NextResponse.json({ error: 'Failed to create license' }, { status: 500 })
  }
}