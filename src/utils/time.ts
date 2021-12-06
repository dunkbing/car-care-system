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

export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}
