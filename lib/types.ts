export interface Review {
  id: string;
  doctor_id: string;
  patient_id: string | null;
  patient_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
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
  reviews: Review[];
}

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
}