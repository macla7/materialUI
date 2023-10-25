import isEmpty from "lodash/isEmpty";

const today = new Date().toISOString().split("T")[0];
const fastDate = getPastDate(3);
const futureDates = getFutureDates(12);
const dates = [fastDate, today].concat(futureDates);

function getFutureDates(numberOfDays) {
  const array = [];
  for (let index = 1; index <= numberOfDays; index++) {
    let d = Date.now();
    if (index > 8) {
      // set dates on the next month
      const newMonth = new Date(d).getMonth() + 1;
      d = new Date(d).setMonth(newMonth);
    }
    const date = new Date(d + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
    const dateString = date.toISOString().split("T")[0];
    array.push(dateString);
  }
  return array;
}
function getPastDate(numberOfDays) {
  return new Date(Date.now() - 864e5 * numberOfDays)
    .toISOString()
    .split("T")[0];
}

export const agendaItems = [
  {
    title: dates[0],
    shift: ["AM"],
    personal: [{ key: "personal", color: "black" }],
    data: [{ hour: "12am", duration: "1h", title: "First Yoga" }],
  },
  {
    title: dates[1],
    shift: [],
    personal: [],
    data: [
      { hour: "4pm", duration: "1h", title: "Pilates ABC" },
      { hour: "5pm", duration: "1h", title: "Vinyasa Yoga" },
    ],
  },
  {
    title: dates[2],
    shift: ["PM"],
    personal: [{ key: "personal", color: "black" }],
    data: [
      { hour: "1pm", duration: "1h", title: "Ashtanga Yoga" },
      { hour: "2pm", duration: "1h", title: "Deep Stretches" },
      { hour: "3pm", duration: "1h", title: "Private Yoga" },
    ],
  },
  {
    title: dates[3],

    personal: [],
    data: [{ hour: "12am", duration: "1h", title: "Ashtanga Yoga" }],
  },
  {
    title: dates[4],
    shift: ["NIGHT"],
    personal: [{ key: "personal", color: "black" }],
    data: [{}],
  },
  {
    title: dates[5],
    shift: ["NIGHT"],
    personal: [],
    data: [
      { hour: "9pm", duration: "1h", title: "Middle Yoga" },
      { hour: "10pm", duration: "1h", title: "Ashtanga" },
      { hour: "11pm", duration: "1h", title: "TRX" },
      { hour: "12pm", duration: "1h", title: "Running Group" },
    ],
  },
  {
    title: dates[6],

    personal: [],
    data: [{ hour: "12am", duration: "1h", title: "Ashtanga Yoga" }],
  },
  {
    title: dates[7],
    shift: ["NIGHT"],
    personal: [],
    data: [{}],
  },
  {
    title: dates[8],
    shift: ["NIGHT"],
    personal: [],
    data: [
      { hour: "9pm", duration: "1h", title: "Pilates Reformer" },
      { hour: "10pm", duration: "1h", title: "Ashtanga" },
      { hour: "11pm", duration: "1h", title: "TRX" },
      { hour: "12pm", duration: "1h", title: "Running Group" },
    ],
  },
  {
    title: dates[9],
    shift: ["NIGHT"],
    personal: [{ key: "personal", color: "black" }],
    data: [
      { hour: "1pm", duration: "1h", title: "Ashtanga Yoga" },
      { hour: "2pm", duration: "1h", title: "Deep Stretches" },
      { hour: "3pm", duration: "1h", title: "Private Yoga" },
    ],
  },
  {
    title: dates[10],
    shift: ["AM"],
    personal: [],
    data: [{ hour: "12am", duration: "1h", title: "Last Yoga" }],
  },
  {
    title: dates[11],
    shift: ["AM"],
    personal: [],
    data: [
      { hour: "1pm", duration: "1h", title: "Ashtanga Yoga" },
      { hour: "2pm", duration: "1h", title: "Deep Stretches" },
      { hour: "3pm", duration: "1h", title: "Private Yoga" },
    ],
  },
  {
    title: dates[12],
    shift: ["AM"],
    personal: [],
    data: [{ hour: "12am", duration: "1h", title: "Last Yoga" }],
  },
  {
    title: dates[13],
    shift: ["PM"],
    personal: [{ key: "personal", color: "black" }],
    data: [{ hour: "12am", duration: "1h", title: "Last Yoga" }],
  },
];

const shifts = {
  PM: { key: "PM", color: "#d9a22f" },
  AM: { key: "AM", color: "#5bc05e" },
  NIGHT: { key: "Night", color: "#a7a1fc" },
  personal: { key: "personal", color: "black" },
};

export function getMarkedDates() {
  const marked = {};

  agendaItems.forEach((item) => {
    // NOTE: only mark dates with data

    if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
      let dots = [];
      if (item.shift && item.shift.length > 0) {
        dots.push(shifts[item.shift[0]]);
      }
      if (item.personal.length > 0) {
        dots.push(shifts["personal"]);
      }
      marked[item.title] = {
        dots: dots,
      };
    } else {
      marked[item.title] = { disabled: true };
    }
  });
  return marked;
}
