'use client'

import SuperAgentDetailPage from "@/components/super-agent-detail-page"
import { usePathname } from "next/navigation"

export default function Page() {
  const pathname = usePathname()
  const id = pathname.split("/").pop()

  return (
    <div className="container mx-auto p-4">
      <SuperAgentDetailPage superAgentId={id} />
    </div>
  )
}
