import * as React from "react";

interface DoctorNewBookingEmailProps {
  doctorName: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}

export default function DoctorNewBookingEmail({
  doctorName,
  patientName,
  patientPhone,
  patientEmail,
  bookingDate,
  bookingTime,
  notes,
}: DoctorNewBookingEmailProps) {
  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
          .patient-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-row {
            padding: 8px 0;
            border-bottom: 1px solid #dbeafe;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: #1e40af;
            font-weight: 500;
            display: inline-block;
            width: 120px;
          }
          .detail-value {
            color: #111827;
            font-weight: 600;
          }
          .notes-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
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
            <h1>📅 New Booking</h1>
            <p>MediSpot Appointment Notification</p>
          </div>
          
          <div className="content">
            <p className="greeting">Hi Dr. {doctorName.split(' ').pop()},</p>
            
            <p>
              You have a new appointment scheduled through MediSpot:
            </p>

            <div className="patient-box">
              <div className="detail-row">
                <span className="detail-label">Patient Name</span>
                <span className="detail-value">{patientName}</span>
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
                <span className="detail-label">Phone</span>
                <span className="detail-value">
                  <a href={`tel:${patientPhone}`} style="color: #0d9488;">{patientPhone}</a>
                </span>
              </div>
              {patientEmail && (
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">
                    <a href={`mailto:${patientEmail}`} style="color: #0d9488;">{patientEmail}</a>
                  </span>
                </div>
              )}
            </div>

            {notes && (
              <div className="notes-box">
                <strong>Patient Notes:</strong><br />
                "{notes}"
              </div>
            )}

            <p style="margin-top: 25px; color: #6b7280; font-size: 14px;">
              This appointment was booked through your MediSpot profile. 
              You can view all your bookings in your dashboard.
            </p>

            <center>
              <a href="https://medispot.vercel.app/dashboard/bookings" className="button">
                View Dashboard
              </a>
            </center>
          </div>

          <div className="footer">
            <p>
              This notification was sent because a patient booked an appointment with you through MediSpot.
            </p>
            <p style="margin-top: 10px;">
              <a href="https://medispot.vercel.app/dashboard" style="color: #0d9488;">Manage Bookings</a> · 
              <a href="mailto:hello@medispot.co.za" style="color: #0d9488; margin-left: 10px;">Contact Support</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}