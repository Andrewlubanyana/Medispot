import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import {
  sendBookingConfirmation,
  sendDoctorNewBookingNotification,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      doctor_id,
      patient_id,
      patient_name,
      patient_phone,
      patient_email,
      booking_date,
      booking_time,
      notes,
    } = body;

    if (
      !doctor_id ||
      !patient_name ||
      !patient_phone ||
      !booking_date ||
      !booking_time
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const phoneClean = patient_phone.replace(/\s+/g, "");
    if (phoneClean.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", doctor_id)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

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
            "This time slot has just been booked. Please choose a different time.",
        },
        { status: 409 }
      );
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        doctor_id,
        patient_id: patient_id || null,
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

    // Format date and time for emails
    const formattedDate = new Date(
      booking_date + "T00:00:00"
    ).toLocaleDateString("en-ZA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const [h, m] = booking_time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const formattedTime = `${displayHour}:${m} ${ampm}`;

    // Send confirmation email to patient (if email provided)
    if (patient_email) {
      await sendBookingConfirmation({
        to: patient_email,
        patientName: patient_name,
        doctorName: `${doctor.title} ${doctor.full_name}`,
        doctorSpecialty: doctor.specialty,
        bookingDate: formattedDate,
        bookingTime: formattedTime,
        practiceAddress: doctor.practice_address,
        practiceName: doctor.practice_name || undefined,
        consultationFee: doctor.consultation_fee || undefined,
      });
    }

    // Send notification to doctor (if email exists)
    if (doctor.email) {
      await sendDoctorNewBookingNotification({
        to: doctor.email,
        doctorName: doctor.full_name,
        patientName: patient_name,
        patientPhone: phoneClean,
        patientEmail: patient_email || undefined,
        bookingDate: formattedDate,
        bookingTime: formattedTime,
        notes: notes || undefined,
      });
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