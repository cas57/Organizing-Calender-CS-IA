let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];


const calendar = document.getElementById('calendar');
//declare the eventModal so its visible
const newEventModal = document.getElementById('newEventModal');
//func for deleting the modal
const deleteEventModal = document.getElementById('deleteEventModal');
//create another const for the backdrop
const backDrop = document.getElementById('modalBackDrop');
//variable to clear to input out
const eventTitleInput = document.getElementById('eventTitleInput');
//create an array for the days of the week
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//func to show the modal whenever user clicks
function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';
    } else {
        newEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
}

function load() {
//constant set to the current month 
    const dt = new Date ();
//func so that you can move around and view other months
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);

    }


    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();


//rule so the programming knows how many boxs to put for the days in the month
    const firstDayOfMonth = new Date(year, month, 1);
    //calling getDate converts to string and gets the specific information/day of the month
    const daysInMonth = new Date (year, month + 1, 0).getDate();
    //calling for the US distributed calendar
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    //calling for the current/relevant month name
    document.getElementById('monthDisplay').innerText = 
        `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`; 

 //func to wipe the prior calendar setup and reset it so that the forloop can recreate it for the next month
 calendar.innerHTML = '';

    for(let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            const eventForDay = events.find(e => e.date === dayString);

            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }

            daySquare.addEventsListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }
}

//func for the cancel button
function closeModal () {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load ();
}

//func for the save button
function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }

}
//func for deleting event
function deleteEvent () {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

//creating a function for navigating the different months/calendars using buttons
    function initButtons() {
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


load();