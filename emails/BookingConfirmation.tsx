import * as React from "react";

interface BookingConfirmationEmailProps {
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
  bookingDate: string;
  bookingTime: string;
  practiceAddress: string;
  practiceName?: string;
  consultationFee?: number;
}

export default function BookingConfirmationEmail({
  patientName,
  doctorName,
  doctorSpecialty,
  bookingDate,
  bookingTime,
  practiceAddress,
  practiceName,
  consultationFee,
}: BookingConfirmationEmailProps) {
  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #d1fae5;
            margin: 5px 0 0 0;
            font-size: 14px;
          }
          .content {
            padding: 30px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 15px;
          }
          .details-box {
            background: #f0fdfa;
            border: 1px solid #99f6e4;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #ccfbf1;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: #0f766e;
            font-weight: 500;
          }
          .detail-value {
            color: #111827;
            font-weight: 600;
            text-align: right;
          }
          .reminder {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .reminder strong {
            color: #92400e;
          }
          .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
          .button {
            display: inline-block;
            background: #0d9488;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 15px;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>✓ Appointment Confirmed</h1>
            <p>MediSpot Booking Confirmation</p>
          </div>
          
          <div className="content">
            <p className="greeting">Hi {patientName},</p>
            
            <p>
              Your appointment with <strong>{doctorName}</strong> has been confirmed. 
              We've sent you this email as a reminder.
            </p>

            <div className="details-box">
              <div className="detail-row">
                <span className="detail-label">Doctor</span>
                <span className="detail-value">{doctorName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Specialty</span>
                <span className="detail-value">{doctorSpecialty}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">{bookingDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time</span>
                <span className="detail-value">{bookingTime}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location</span>
                <span className="detail-value">{practiceName || "Practice"}</span>
              </div>
              {consultationFee && (
                <div className="detail-row">
                  <span className="detail-label">Consultation Fee</span>
                  <span className="detail-value">R{consultationFee.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="reminder">
              <strong>📍 Practice Address:</strong><br />
              {practiceAddress}
            </div>

            <p style="margin-top: 25px;">
              <strong>Please arrive 10 minutes early.</strong> Payment is made directly at the practice.
            </p>

            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Need to reschedule or cancel? Log in to your MediSpot account to manage your bookings.
            </p>

            <center>
              <a href="https://medispot.vercel.app/patient/bookings" className="button">
                View My Bookings
              </a>
            </center>
          </div>

          <div className="footer">
            <p>
              This email was sent by MediSpot because you booked an appointment.<br />
              If you didn't make this booking, please contact us immediately.
            </p>
            <p style="margin-top: 10px;">
              <a href="https://medispot.vercel.app" style="color: #0d9488;">medispot.vercel.app</a> · 
              <a href="mailto:hello@medispot.co.za" style="color: #0d9488; margin-left: 10px;">hello@medispot.co.za</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}