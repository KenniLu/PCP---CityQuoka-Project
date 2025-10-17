"use client"

type OfferStatus = "unclaimed" | "ready" | "claimed"

type ClaimButtonProps = {
  status: OfferStatus
}

const STATUS_LABELS: Record<OfferStatus, string> = {
  unclaimed: "Claim Now",
  ready: "Ready to Use",
  claimed: "Claimed",
}

const STATUS_STYLES: Record<OfferStatus, string> = {
  unclaimed: "bg-green-500 text-white",
  ready: "bg-yellow-500 text-black",
  claimed: "bg-gray-400 text-white",
}

export default function ClaimButton({ status }: ClaimButtonProps) {
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-full font-semibold transition ${STATUS_STYLES[status]}`}
      disabled={status === "claimed"}
    >
      {STATUS_LABELS[status]}
    </button>
  )
}
