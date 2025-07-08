import { useState } from "react";
import { Button } from "./ui/button";
import { format, differenceInDays, startOfDay } from "date-fns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import ApplicationForm from "./ApplicationForm";

const statusColors = {
  Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Interview: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Offer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const priorityColors = {
  High: "text-red-600 dark:text-red-400 font-bold",
  Medium: "text-yellow-600 dark:text-yellow-400 font-semibold",
  Low: "text-green-600 dark:text-green-400",
};

const ApplicationCard = ({ data, onDelete, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deadlineDate = data.deadline ? new Date(data.deadline) : null;
  const today = startOfDay(new Date());

  const daysLeft =
    deadlineDate !== null
      ? differenceInDays(startOfDay(deadlineDate), today)
      : null;

  const isUpcoming = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
  const isPastDeadline = daysLeft !== null && daysLeft < 0;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header: Company & Status */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {data.company}
        </h2>
        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColors[data.status]}`}
        >
          {data.status}
        </span>
      </div>

      {/* Role */}
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
        {data.role}
      </p>

      {/* Details */}
      <div className="text-sm space-y-1">
        <div>
          <p>
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Deadline:
            </span>{" "}
            {data.deadline ? format(deadlineDate, "PPP") : "N/A"}
          </p>

          {isPastDeadline && (
            <span className="inline-block mt-1 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 px-2 py-1 rounded-full">
              ❌ Deadline Passed
            </span>
          )}
        </div>

        <span className="inline-block text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded-full">
          📂 {data.category}
        </span>

        <p className={priorityColors[data.priority]}>
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            Priority:
          </span>{" "}
          {data.priority}
        </p>
      </div>

      {/* Note */}
      {data.note && (
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 italic">
          📝 <span className="font-medium">Note:</span> {data.note}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {data.resumeUrl && (
            <a
              href={data.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Resume
            </a>
          )}

          {isUpcoming && (
            <span className="inline-block text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-full">
              ⏳ Due in {daysLeft === 0 ? "Today" : `${daysLeft} day${daysLeft > 1 ? "s" : ""}`}
            </span>
          )}
        </div>

        {/* Edit + Delete */}
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-sm text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Edit Application</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                Modify the application details and update your tracker.
              </DialogDescription>
              <ApplicationForm
                initialData={data}
                onUpdate={(updatedData) => {
                  onUpdate(updatedData);
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="text-sm text-red-600 dark:text-red-400 border-red-300 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900"
            onClick={() => onDelete(data._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
