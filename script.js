let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];


const organizingCalendar = document.getElementById('organizingCalendar');
//declare the event modal so its visible
const newEventElement = document.getElementById('newEventElement');
//func for deleting the modal
const deleteEventElement = document.getElementById('deleteEventElement');
//create another const for the backdrop
const backDrop = document.getElementById('modalBackDrop');
//variable to clear to input out
const eventInput = document.getElementById('eventInput');
//create an array to determine the amount of padding days necessary in the days of the week
const daysOfWeek = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'];



//func to show the modal whenever user clicks
function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventElement.style.display = 'block';
    } else {
        newEventElement.style.display = 'block';
    }

    backDrop.style.display = 'block';
}

function load() {
    //constant set to the current month 
    const date = new Date ();
    //func so that you can move around and view other months
    if (nav !== 0) {
        date.setMonth(new Date().getMonth() + nav);

    }


    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();


    //rule so the programming knows how many boxs to put for the days in the month
    const firstDayintheMonth = new Date(year, month, 1);
    //calling getDate converts to string and gets the specific information/day of the month
    const daysInMonth = new Date (year, month + 1, 0).getDate();
    //calling for the US distributed calendar
    const dtString = firstDayintheMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const padDaysValue = daysOfWeek.indexOf(dtString.split(', ')[0]);

    //calling for the current/relevant month name
    document.getElementById('monthDisplay').innerText = 
        `${date.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    organizingCalendar.innerHTML = '';

    for(let i = 1; i <= padDaysValue + daysInMonth; i++) {
        const dayBox = document.createElement('div');
        dayBox.classList.add('day');

        const dayString = `${month + 1}/${i - padDaysValue}/${year}`;

        if (i > padDaysValue) {
            dayBox.innerText = i - padDaysValue;

            const eventForDay = events.find(e => e.date === dayString);

            if (i - padDaysValue === day && nav === 0) {
                dayBox.id = 'currentDay';
            }

            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                dayBox.appendChild(eventDiv);
            }

            dayBox.addEventListener('click', () => openModal(dayString));
        } else {
            dayBox.classList.add('padding');
        }
        organizingCalendar.appendChild(dayBox);
    }
}

//func for the cancel button
function closeModal () {
    eventInput.classList.remove('error');
    newEventElement.style.display = 'none';
    deleteEventElement.style.display = 'none';
    backDrop.style.display = 'none';
    eventInput.value = '';
    clicked = null;
    load ();
}

//func for the save button
function saveEvent() {
    if (eventInput.value) {
        eventInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventInput.classList.add('error');
    }

}
//func for deleting event
function deleteEvent () {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

//creating a function for navigating the different months/calendars using buttons
function initializeButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
         load();
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('saveButton',).addEventListener('click',saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
     document.getElementById('deleteButton',).addEventListener('click',deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
}

initializeButtons();
load();