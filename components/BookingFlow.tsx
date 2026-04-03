"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CalendarCheck,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/StarRating";

// ============================================
// TYPES
// ============================================

interface DoctorInfo {
  id: string;
  title: string;
  full_name: string;
  specialty: string;
  practice_name: string | null;
  practice_address: string;
  area: string;
  city: string;
  consultation_fee: number | null;
  slot_duration: number;
  photo_url: string | null;
  averageRating: number;
  totalReviews: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
  isBooked: boolean;
  isPast: boolean;
}

interface BookingResult {
  id: string;
  doctor_name: string;
  patient_name: string;
  booking_date: string;
  booking_time: string;
  status: string;
}

type Step = "date" | "time" | "details" | "confirmed";

// ============================================
// HELPERS
// ============================================

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getNextDays(startDate: Date, count: number): Date[] {
  const days: Date[] = [];
  const current = new Date(startDate);
  for (let i = 0; i < count; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ============================================
// COMPONENT
// ============================================

export default function BookingFlow({ doctor }: { doctor: DoctorInfo }) {
  const [step, setStep] = useState<Step>("date");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  // Form fields
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  // Generate the date grid
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() + weekOffset * 7);
  const days = getNextDays(startDate, 7);

  const currentMonth = days[0].getMonth();
  const currentYear = days[0].getFullYear();
  const endMonth = days[6].getMonth();
  const monthLabel =
    currentMonth === endMonth
      ? `${MONTH_NAMES[currentMonth]} ${currentYear}`
      : `${MONTH_NAMES[currentMonth]} – ${MONTH_NAMES[endMonth]} ${currentYear}`;

  // Fetch available slots when a date is selected
  const fetchSlots = useCallback(
    async (date: string) => {
      setLoadingSlots(true);
      setSlotsError("");
      setSlots([]);
      setSelectedTime("");

      try {
        const response = await fetch(
          `/api/doctors/${doctor.id}/slots?date=${date}`
        );
        const data = await response.json();

        if (!response.ok) {
          setSlotsError(data.error || "Failed to load available times");
          return;
        }

        setSlots(data.slots);

        if (data.slots.length === 0) {
          setSlotsError(
            data.message || "No available slots on this day"
          );
        }
      } catch {
        setSlotsError("Something went wrong. Please try again.");
      } finally {
        setLoadingSlots(false);
      }
    },
    [doctor.id]
  );

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    const dateStr = toDateString(date);
    setSelectedDate(dateStr);
    setStep("time");
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  // Handle booking submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctor.id,
          patient_name: patientName,
          patient_phone: patientPhone,
          patient_email: patientEmail,
          booking_date: selectedDate,
          booking_time: selectedTime,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.error || "Failed to book appointment");
        return;
      }

      setBookingResult(data.booking);
      setStep("confirmed");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Doctor info initials
  const initials = doctor.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Available slot count
  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Doctor summary card */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-4">
          {doctor.photo_url ? (
            <img
              src={doctor.photo_url}
              alt={doctor.full_name}
              className="w-14 h-14 rounded-xl object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900">
              {doctor.title} {doctor.full_name}
            </h2>
            <p className="text-teal-600 text-sm font-medium">
              {doctor.specialty}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <StarRating
                rating={doctor.averageRating}
                totalReviews={doctor.totalReviews}
                size="sm"
              />
              {doctor.consultation_fee && (
                <span className="text-sm text-gray-500">
                  · R{doctor.consultation_fee.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(["date", "time", "details", "confirmed"] as Step[]).map(
          (s, index) => {
            const stepLabels = ["Date", "Time", "Details", "Confirmed"];
            const stepIndex = ["date", "time", "details", "confirmed"].indexOf(step);
            const thisIndex = index;
            const isActive = thisIndex === stepIndex;
            const isComplete = thisIndex < stepIndex;

            return (
              <div key={s} className="flex items-center gap-2">
                {index > 0 && (
                  <div
                    className={`w-8 h-0.5 ${
                      isComplete ? "bg-teal-500" : "bg-gray-200"
                    }`}
                  />
                )}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isComplete
                        ? "bg-teal-500 text-white"
                        : isActive
                          ? "bg-teal-100 text-teal-700 ring-2 ring-teal-500"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isComplete ? "✓" : index + 1}
                  </div>
                  <span
                    className={`text-xs mt-1 hidden sm:block ${
                      isActive ? "text-teal-700 font-medium" : "text-gray-400"
                    }`}
                  >
                    {stepLabels[index]}
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* ====== STEP 1: SELECT DATE ====== */}
      {step === "date" && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-teal-600" />
            Select a Date
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Choose a day for your appointment
          </p>

          {/* Week navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900">{monthLabel}</span>
            <button
              onClick={() => setWeekOffset(Math.min(3, weekOffset + 1))}
              disabled={weekOffset >= 3}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date) => {
              const dateStr = toDateString(date);
              const isToday = dateStr === toDateString(today);
              const isPast = date < today;
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={dateStr}
                  onClick={() => !isPast && handleDateSelect(date)}
                  disabled={isPast}
                  className={`flex flex-col items-center py-3 px-1 rounded-xl text-sm transition-all ${
                    isPast
                      ? "opacity-30 cursor-not-allowed"
                      : isSelected
                        ? "bg-teal-600 text-white shadow-md"
                        : "hover:bg-teal-50 hover:border-teal-200 border border-gray-100"
                  } ${isToday && !isSelected ? "border-teal-300 border-2" : ""}`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? "text-teal-100" : "text-gray-400"
                    }`}
                  >
                    {SHORT_DAYS[date.getDay()]}
                  </span>
                  <span className="text-lg font-bold mt-0.5">
                    {date.getDate()}
                  </span>
                  {isToday && (
                    <span
                      className={`text-[10px] ${
                        isSelected ? "text-teal-200" : "text-teal-600"
                      }`}
                    >
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Showing the next 4 weeks of availability
          </p>
        </div>
      )}

      {/* ====== STEP 2: SELECT TIME ====== */}
      {step === "time" && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              Select a Time
            </h3>
            <button
              onClick={() => setStep("date")}
              className="text-sm text-gray-500 hover:text-teal-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Change date
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {formatDateDisplay(selectedDate)} · {doctor.slot_duration} min
            appointments
          </p>

          {/* Loading state */}
          {loadingSlots && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 text-teal-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading available times...</p>
            </div>
          )}

          {/* Error state */}
          {slotsError && !loadingSlots && (
            <div className="text-center py-12">
              <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">{slotsError}</p>
              <button
                onClick={() => setStep("date")}
                className="btn-primary text-sm"
              >
                Choose a different day
              </button>
            </div>
          )}

          {/* Time slots grid */}
          {!loadingSlots && !slotsError && slots.length > 0 && (
            <>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold text-gray-900">
                  {availableCount}
                </span>{" "}
                {availableCount === 1 ? "slot" : "slots"} available
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                      !slot.available
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                        : selectedTime === slot.time
                          ? "bg-teal-600 text-white shadow-md"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50"
                    }`}
                  >
                    {formatTime(slot.time)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded border border-gray-200 bg-white" />
                  Available
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-50 border border-gray-100" />
                  Unavailable
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ====== STEP 3: ENTER DETAILS ====== */}
      {step === "details" && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-teal-600" />
              Your Details
            </h3>
            <button
              onClick={() => setStep("time")}
              className="text-sm text-gray-500 hover:text-teal-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Change time
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {formatDateDisplay(selectedDate)} at {formatTime(selectedTime)}
          </p>

          {/* Appointment summary */}
          <div className="bg-teal-50 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-teal-800 mb-2">
              Appointment Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-teal-700">
                <CalendarDays className="h-4 w-4" />
                {formatDateDisplay(selectedDate)}
              </div>
              <div className="flex items-center gap-2 text-teal-700">
                <Clock className="h-4 w-4" />
                {formatTime(selectedTime)} ({doctor.slot_duration} min)
              </div>
              <div className="flex items-center gap-2 text-teal-700">
                <MapPin className="h-4 w-4" />
                {doctor.area}, {doctor.city}
              </div>
              {doctor.consultation_fee && (
                <div className="flex items-center gap-2 text-teal-700">
                  <span className="font-bold">
                    R{doctor.consultation_fee.toLocaleString()}
                  </span>
                  <span className="text-teal-600">consultation fee</span>
                </div>
              )}
            </div>
          </div>

          {/* Patient form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="e.g. 072 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes for the doctor{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reason for visit, symptoms, questions..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Error */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CalendarCheck className="h-5 w-5" />
                  Confirm Appointment
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By booking, you agree to show up on time or cancel at least 24
              hours in advance.
            </p>
          </form>
        </div>
      )}

      {/* ====== STEP 4: CONFIRMATION ====== */}
      {step === "confirmed" && bookingResult && (
        <div className="card p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Appointment Confirmed!
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your appointment with{" "}
            <span className="font-semibold">{bookingResult.doctor_name}</span>{" "}
            has been booked successfully.
          </p>

          {/* Booking details card */}
          <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8 text-left">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">
              Booking Details
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-mono text-gray-700 text-xs">
                  {bookingResult.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Doctor</span>
                <span className="font-medium text-gray-900">
                  {bookingResult.doctor_name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">
                  {formatDateDisplay(bookingResult.booking_date)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-gray-900">
                  {formatTime(bookingResult.booking_time)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="inline-flex items-center gap-1 text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-full text-xs">
                  <CheckCircle className="h-3 w-3" />
                  Confirmed
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-900 text-right">
                  {doctor.practice_name || doctor.area}
                </span>
              </div>
              {doctor.consultation_fee && (
                <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span className="font-bold text-gray-900">
                    R{doctor.consultation_fee.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Please arrive 10 minutes before your appointment time. Payment is
            made directly at the practice.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/doctors/${doctor.id}`} className="btn-secondary">
              Back to Doctor Profile
            </Link>
            <Link href="/doctors" className="btn-primary">
              Find More Doctors
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}