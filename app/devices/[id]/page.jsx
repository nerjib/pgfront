import DeviceDetailPage from "../../../components/device-detail-page"

export default function DevicePage({ params }) {
  return <DeviceDetailPage deviceId={params.id} />
}
