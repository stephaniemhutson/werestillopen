export function businessIsOpenAtAll(business) {
  return (
    business.is_open ||
    business.online ||
    business.delivery ||
    business.take_out ||
    business.by_appointment
  )
}
