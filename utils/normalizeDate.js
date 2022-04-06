const normalizeDate = (date) => {
  const newDate = new Date(date);
  // if past week show day of week
  const today = new Date();
  const diff = Math.abs(today.getTime() - newDate.getTime());
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  const diffHours = Math.ceil(diff / (1000 * 3600));
  if (diffDays < 7 /*&& diffHours > 24*/) {
    return newDate.toLocaleString('default', {
      weekday: 'long',
    });
  }
  // if past year show month and day and year
  if (diffDays > 7) {
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const newDateString = `${month}/${day}/${year}`;
    return newDateString
      .split(' ')
      .slice(0, 3)
      .join(' ');
  }
  // if past 24 hours show time
  if (diffHours < 24) {
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // handle 0 hour
    const hour = hours % 12 === 0 ? 12 : hours % 12;
    const newMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const newTime = `${hour}:${newMinutes} ${ampm}`;
    return newTime;
  }
  return newDate.toLocaleString('default', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default normalizeDate;
