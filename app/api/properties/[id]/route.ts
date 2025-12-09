import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from("citristiproperties")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } 
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

    const body = await request.json();
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
      amenities,
      contact_phone,
      contact_email,
      badge,
      hashtags,
      social_links,
      is_popup_promo,
    } = body;

    const { data, error } = await supabase
      .from("citristiproperties")
      .update({
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
        amenities: Array.isArray(amenities) ? amenities : [amenities],
        contact_phone,
        contact_email,
        badge,
        hashtags,
        social_links: social_links || {},
        is_popup_promo: Boolean(is_popup_promo),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Update property error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } 
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

    const { error } = await supabase.from("citristiproperties").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error("Delete property error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
