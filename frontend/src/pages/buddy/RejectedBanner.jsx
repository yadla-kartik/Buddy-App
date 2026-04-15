import { AlertTriangle, RotateCcw } from "lucide-react";

export default function RejectedBanner({ reason, onRetry }) {
  return (
    <div className="w-full p-8">
      <section className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              <AlertTriangle size={14} /> Verification Rejected
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your registration needs updates
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Admin rejected your current submission. Please update details and
              submit again.
            </p>
            {reason ? (
              <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                Reason: {reason}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RotateCcw size={16} /> Update And Resubmit
          </button>
        </div>
      </section>
    </div>
  );
}
