import { Resend } from "resend";
import { renderToString } from "react-dom/server";
import BookingConfirmationEmail from "@/emails/BookingConfirmation";
import DoctorNewBookingEmail from "@/emails/DoctorNewBooking";
import { createElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation({
  to,
  patientName,
  doctorName,
  doctorSpecialty,
  bookingDate,
  bookingTime,
  practiceAddress,
  practiceName,
  consultationFee,
}: {
  to: string;
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
  bookingDate: string;
  bookingTime: string;
  practiceAddress: string;
  practiceName?: string;
  consultationFee?: number;
}) {
  try {
    const emailHtml = renderToString(
      createElement(BookingConfirmationEmail, {
        patientName,
        doctorName,
        doctorSpecialty,
        bookingDate,
        bookingTime,
        practiceAddress,
        practiceName,
        consultationFee,
      })
    );

    const { data, error } = await resend.emails.send({
      from: "MediSpot <bookings@medispot.co.za>",
      to,
      subject: `Appointment Confirmed with ${doctorName}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send exception:", error);
    return { success: false, error };
  }
}

export async function sendDoctorNewBookingNotification({
  to,
  doctorName,
  patientName,
  patientPhone,
  patientEmail,
  bookingDate,
  bookingTime,
  notes,
}: {
  to: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}) {
  try {
    const emailHtml = renderToString(
      createElement(DoctorNewBookingEmail, {
        doctorName,
        patientName,
        patientPhone,
        patientEmail,
        bookingDate,
        bookingTime,
        notes,
      })
    );

    const { data, error } = await resend.emails.send({
      from: "MediSpot <bookings@medispot.co.za>",
      to,
      subject: `New Booking: ${patientName} on ${bookingDate}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Doctor email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Doctor email send exception:", error);
    return { success: false, error };
  }
}