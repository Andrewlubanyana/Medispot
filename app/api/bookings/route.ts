import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      doctor_id,
      patient_name,
      patient_phone,
      patient_email,
      booking_date,
      booking_time,
      notes,
    } = body;

    // Validation
    if (
      !doctor_id ||
      !patient_name ||
      !patient_phone ||
      !booking_date ||
      !booking_time
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: doctor_id, patient_name, patient_phone, booking_date, booking_time",
        },
        { status: 400 }
      );
    }

    // Validate phone (basic SA phone format)
    const phoneClean = patient_phone.replace(/\s+/g, "");
    if (phoneClean.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("id, full_name, title")
      .eq("id", doctor_id)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    // Check if the slot is still available (prevent double booking)
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .eq("doctor_id", doctor_id)
      .eq("booking_date", booking_date)
      .eq("booking_time", booking_time)
      .in("status", ["confirmed", "completed"])
      .maybeSingle();

    if (existingBooking) {
      return NextResponse.json(
        {
          error:
            "This time slot has just been booked by someone else. Please choose a different time.",
        },
        { status: 409 }
      );
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        doctor_id,
        patient_name: patient_name.trim(),
        patient_phone: phoneClean,
        patient_email: patient_email?.trim() || null,
        booking_date,
        booking_time,
        notes: notes?.trim() || null,
        status: "confirmed",
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return NextResponse.json(
        { error: "Failed to create booking. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        doctor_name: `${doctor.title} ${doctor.full_name}`,
        patient_name: booking.patient_name,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}