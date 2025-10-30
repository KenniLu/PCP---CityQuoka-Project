"use client"

type OfferStatus = "Unclaimed" | "Ready to use" | "Claimed"

type ClaimButtonProps = {
  status: OfferStatus
  onClick: () => void
}

const STATUS_LABELS: Record<OfferStatus, string> = {
  Unclaimed: "Claim Now",
  "Ready to use": "Ready to Use",
  Claimed: "Claimed",
}

const STATUS_CLASSES: Record<OfferStatus, string> = {
  Unclaimed: "bg-green-500 text-white",
  "Ready to use": "bg-yellow-500 text-black",
  Claimed: "bg-gray-400 text-white",
}

export default function ClaimButton({ status, onClick }: ClaimButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-semibold transition ${STATUS_CLASSES[status]}`}
      disabled={status === "Claimed"}
    >
      {STATUS_LABELS[status]}
    </button>
  )
}
