export default function excelDateToJSDate(excelDate) {
  var date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  var converted_date = date.toISOString().split("T")[0];
  return converted_date;
}
