export class DateHelper {

  // Test si deux dates sont du même jour (sans compter la partie heure)
  public static areOnSameDay = (first: Date, second: Date): boolean => {
    return first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDay() === second.getDay();
  }

  public static inPeriod = (date: Date, start: Date, end: Date) => {
    return (date >= start && date <= end) ||
      DateHelper.areOnSameDay(date, start) ||
      DateHelper.areOnSameDay(date, end);
  }

  // Retourne une chaine contenant la date au format YYYY-MM-DD
  public static toUrlString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  }


  public static nbDaysBetweenToDate = (date1: Date, date2: Date): number => {
    // on retire la partie heuyre
    const d1 = new Date(date1.getDate());
    const d2 = new Date(date2.getDate());

    const diffInTime: number = d2.getTime() - d1.getTime();
    const diffInDays: number = diffInTime / (1000 * 3600 * 24);

    return diffInDays;
  }

  public static addMinutes = (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
  }

  public static addHours = (date: Date, hours: number) => {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }
}
