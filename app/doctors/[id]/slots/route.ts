import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function generateSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number
): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes + durationMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
    );
    currentMinutes += durationMinutes;
  }

  return slots;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Date parameter is required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD" },
      { status: 400 }
    );
  }

  // Get the day of the week for the selected date
  const selectedDate = new Date(date + "T00:00:00");
  const dayOfWeek = selectedDate.getDay(); // 0=Sunday, 6=Saturday

  // Get doctor info
  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("slot_duration")
    .eq("id", id)
    .single();

  if (doctorError || !doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  // Get availability for this day of the week
  const { data: availability, error: availError } = await supabase
    .from("availability")
    .select("*")
    .eq("doctor_id", id)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true);

  if (availError) {
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }

  if (!availability || availability.length === 0) {
    return NextResponse.json({
      date,
      dayOfWeek,
      slots: [],
      message: "Doctor is not available on this day",
    });
  }

  // Generate all possible slots
  const allSlots: string[] = [];
  for (const avail of availability) {
    const slots = generateSlots(
      avail.start_time,
      avail.end_time,
      doctor.slot_duration
    );
    allSlots.push(...slots);
  }

  // Get existing bookings for this date
  const { data: bookings } = await supabase
    .from("bookings")
    .select("booking_time")
    .eq("doctor_id", id)
    .eq("booking_date", date)
    .in("status", ["confirmed", "completed"]);

  const bookedTimes = new Set(
    (bookings || []).map((b) => b.booking_time.slice(0, 5))
  );

  // Filter out past slots if the date is today
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

  const availableSlots = allSlots.map((slot) => {
    const [h, m] = slot.split(":").map(Number);
    const slotMinutes = h * 60 + m;
    const isBooked = bookedTimes.has(slot);
    const isPast = date === today && slotMinutes <= currentTimeMinutes + 30; // 30 min buffer

    return {
      time: slot,
      available: !isBooked && !isPast,
      isBooked,
      isPast,
    };
  });

  return NextResponse.json({
    date,
    dayOfWeek,
    slotDuration: doctor.slot_duration,
    slots: availableSlots,
  });
}