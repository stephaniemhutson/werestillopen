export function businessIsOpenAtAll(business) {
  // works for Business component and businesses coming from the API
  return (
    business.is_open ||
    business.isOpen ||
    business.online ||
    business.delivery ||
    business.take_out ||
    business.takeout ||
    business.by_appointment ||
    business.byAppointment
  )
}
