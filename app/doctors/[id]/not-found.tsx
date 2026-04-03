import Link from "next/link";
import { UserX } from "lucide-react";

export default function DoctorNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
          <UserX className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Doctor Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn&apos;t find the doctor you&apos;re looking for. They
          may have been removed or the link might be incorrect.
        </p>
        <Link href="/doctors" className="btn-primary inline-flex items-center gap-2">
          Browse All Doctors
        </Link>
      </div>
    </div>
  );
}