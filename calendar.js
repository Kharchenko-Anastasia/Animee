// calendar.js
document.addEventListener('DOMContentLoaded', function () {
    const calendarIcon = document.getElementById('calendar-icon');
    const calendarContainer = document.getElementById('calendar-container');
    const calendarYear = document.getElementById('calendar-year');
    const calendarMonth = document.getElementById('calendar-month');

    calendarIcon.addEventListener('click', function () {
        calendarContainer.style.display = calendarContainer.style.display === 'none' ? 'block' : 'none';
    });

    function getTodayDate() {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; // Місяці починаються з 0
        const year = today.getFullYear();
        return { day, month, year };
    }

    function getMonthName(month) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[month - 1];
    }

    function getAnimeReleaseData() {
        return {
            "2024-06-01": { title: "Magic Battle Season 1,New Episode 1, 13:00", isNew: false },
            "2024-06-07": { title: "Magic Battle Season 1,New Episode 2, 13:00", isNew: false },
            "2024-06-24": { title: "This and That,New Episode 1, 14:00", isNew: false },
            "2024-06-26": { title: "Cyberpunk, New Episode 1, 20:00", isNew: false },
            "2024-06-28": { title: "Fall in Love with Yamada Level 999, New Episode 1, 12:00", isNew: false },
            "2024-06-30": { title: "New Anime Release: My Hero Academia", isNew: true }
        };
    }

    function generateMiniCalendar() {
        const { day, month, year } = getTodayDate();

        calendarYear.innerText = year;
        calendarMonth.innerText = getMonthName(month);

        const animeData = getAnimeReleaseData();
        const calendarMini = document.getElementById('calendar-mini');

        const table = document.createElement('table');
        const headerRow = document.createElement('tr');

        // Days of the week
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let day of daysOfWeek) {
            const th = document.createElement('th');
            th.innerText = day;
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);

        // Days of the month
        const firstDay = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < firstDay) {
                    cell.innerText = '';
                } else if (date > daysInMonth) {
                    break;
                } else {
                    const cellDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                    cell.innerText = date;
                    if (date === day) {
                        cell.style.backgroundColor = '#f48fb1'; // Підсвічування сьогоднішнього дня
                    }
                    if (animeData[cellDate]) {
                        cell.classList.add('has-anime-release');
                        if (animeData[cellDate].isNew) {
                            cell.classList.add('new-anime-release');
                        }
                        cell.setAttribute('title', animeData[cellDate].title);
                    }
                    date++;
                }
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        calendarMini.appendChild(table);
        $(document).tooltip(); // Ініціалізуємо підказки
    }

    generateMiniCalendar();
});
