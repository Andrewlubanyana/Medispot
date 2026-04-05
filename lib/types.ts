export interface Review {
  id: string;
  doctor_id: string;
  patient_id: string | null;
  patient_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  doctor_response: string | null;
  response_date: string | null;
}

export interface Doctor {
  id: string;
  profile_id: string | null;
  title: string;
  full_name: string;
  specialty: string;
  bio: string | null;
  qualifications: string | null;
  practice_name: string | null;
  practice_address: string;
  area: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  photo_url: string | null;
  consultation_fee: number | null;
  is_approved: boolean;
  is_premium: boolean;
  is_verified: boolean;
  slot_duration: number;
  created_at: string;
  updated_at: string;
  reviews?: Review[]; 
}

// Added this alias to fix your Vercel build error!
export type DoctorRecord = Doctor;

export interface DoctorWithRating extends Doctor {
  averageRating: number;
  totalReviews: number;
}

export interface Service {
  id: string;
  doctor_id: string;
  name: string;
  description: string | null;
  price: number | null;
  created_at: string;
}

export interface Booking {
  id: string;
  doctor_id: string;
  patient_id: string | null;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  booking_date: string;
  booking_time: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  notes: string | null;
  created_at: string;
  updated_at: string;
  cancellation_reason?: string | null;
  cancelled_by?: "doctor" | "patient" | null;
  cancelled_at?: string | null;
  reschedule_requested?: boolean;
  original_date?: string | null;
  original_time?: string | null;
}

export interface Availability {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}
