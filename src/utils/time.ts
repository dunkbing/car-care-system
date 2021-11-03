export function to12HoursTime(pTime: string) {
  let time = /^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/.exec(pTime) || [pTime];

  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = String(+time[0] % 12 || 12); // Adjust hours
  }

  return time.join('');
}

export function toHourAndMinute(time: Date) {
  return `${time.getHours()}:${time.getMinutes()}`;
}
