interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface AvailabilityTableProps {
  availability: AvailabilitySlot[];
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}

export default function AvailabilityTable({
  availability,
}: AvailabilityTableProps) {
  const today = new Date().getDay();

  return (
    <div className="space-y-2">
      {DAY_NAMES.map((day, index) => {
        const slot = availability.find((a) => a.day_of_week === index);
        const isToday = today === index;

        return (
          <div
            key={day}
            className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${
              isToday ? "bg-teal-50 border border-teal-100" : ""
            }`}
          >
            <span
              className={`font-medium ${
                isToday ? "text-teal-700" : "text-gray-700"
              }`}
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{SHORT_DAY_NAMES[index]}</span>
              {isToday && (
                <span className="text-xs text-teal-600 ml-1.5">(Today)</span>
              )}
            </span>

            {slot ? (
              <span
                className={`${isToday ? "text-teal-700 font-medium" : "text-gray-600"}`}
              >
                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
              </span>
            ) : (
              <span className="text-gray-400">Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
}