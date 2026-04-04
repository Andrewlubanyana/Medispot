import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doctor_id, patient_id, patient_name, rating, comment } = body;

    if (!doctor_id || !patient_name || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: doctor_id, patient_name, rating" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check for existing review from this patient
    if (patient_id) {
      const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("doctor_id", doctor_id)
        .eq("patient_id", patient_id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "You have already reviewed this doctor" },
          { status: 409 }
        );
      }
    }

    // Check that doctor exists
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("id")
      .eq("id", doctor_id)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        doctor_id,
        patient_id: patient_id || null,
        patient_name: patient_name.trim(),
        rating,
        comment: comment?.trim() || null,
        is_approved: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Review insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit review. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, review: data });
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}