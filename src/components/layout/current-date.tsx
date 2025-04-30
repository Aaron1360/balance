export default function CurrentDate() {
  const currentDate = new Date();

  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const formattedDate = `${
    daysOfWeek[currentDate.getDay()]
  } ${currentDate.getDate()} de ${
    months[currentDate.getMonth()]
  } de ${currentDate.getFullYear()}`;

  return <div className="text-md">{formattedDate}</div>;
}
