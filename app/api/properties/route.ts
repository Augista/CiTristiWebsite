import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const district = searchParams.get("district")
    const propertyType = searchParams.get("type")
    const popup = searchParams.get("popup") === "true"
    const q = searchParams.get("q")
    const hashtag = searchParams.get("hashtag")

    let query = supabase
      .from("citristiproperties")
      .select("*")
      .eq("listing_status", "available")
      .order("created_at", { ascending: false })

    if (popup) {
      query = query.eq("is_popup_promo", true).limit(1)
    } else {
      if (district) query = query.eq("district", district)
      if (propertyType) query = query.eq("property_type", propertyType)
      if (q) query = query.ilike("title", `%${q}%`)
      if (hashtag) query = query.ilike("hashtags", `%${hashtag}%`)
      }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Get properties error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      description,
      location,
      district,
      property_type,
      price,
      size_sqm,
      bedrooms,
      bathrooms,
      featured_image_url,
      gallery_images,
      amenities,
      contact_phone,
      contact_email,
      is_popup_promo,
      badge,
      hashtags,
      social_links,
    } = body

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from("citristiproperties")
      .insert([
        {
          admin_id: 1,
          title,
          description,
          location,
          district,
          property_type,
          price: Number(price),
          size_sqm: size_sqm ? Number(size_sqm) : null,
          bedrooms: bedrooms ? Number(bedrooms) : null,
          bathrooms: bathrooms ? Number(bathrooms) : null,
          featured_image_url,
          gallery_images: gallery_images || [],
          amenities: Array.isArray(amenities) ? amenities : [amenities],
          contact_phone,
          contact_email,
          is_popup_promo: is_popup_promo || false,
          badge: badge || null,
          hashtags: hashtags || null,
          social_links: social_links || {},
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Create property error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
