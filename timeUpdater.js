
class TimeUpdater {
    constructor() {
        this.daysOfWeek = [
            'Sunday',    
            'Monday',    
            'Tuesday',   
            'Wednesday', 
            'Thursday',  
            'Friday',    
            'Saturday'   
        ];
        this.monthsOfYear = [
            'January',   
            'February',  
            'March',     
            'April',     
            'May',       
            'June',      
            'July',     
            'August',    
            'September',
            'October',   
            'November',  
            'December',
        ];
        this.hour = document.getElementById('hour').querySelector('h1');
        this.period = document.getElementById('hour').querySelector('p');
        this.dayTimeAndYear = document.getElementById('timeAndDay').querySelectorAll('p')[1];
        this.initialize();
    }

    initialize() {
        const date = new Date();
        const time = this.getTime(date);
        const monthName = this.getMonthName(date);
        const dayName = this.getDayName(date);
        const year = date.getFullYear();
        const dayNumber = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        this.day = parseInt(dayNumber);
        this.hour.innerHTML = `${time.time}:${time.minutes}`; 
        this.period.innerHTML = time.period;
        this.dayTimeAndYear.innerHTML = `${dayName}, ${dayNumber} ${monthName} ${year}`;
        this.update = this.update.bind(this); //binding this object to the update function
        setInterval(this.update, 1000);
    }

    update() {
        const date = new Date();
        const time = this.getTime(date);
        const month = this.getMonthName(date);
        const dayName = this.getDayName(date);
        this.updateTime(time);
        this.dayTimeAndYear.innerHTML = `${dayName}, ${this.day < 10 ? '0' + this.day : this.day} ${month} ${date.getFullYear()}`;
    }

    getDayName(date) {
        return this.daysOfWeek[date.getDay()];
    }

    getMonthName(date) {
        return this.monthsOfYear[date.getMonth()];
    }

    getTime(date) {
        let time = date.getHours();
        const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        if (time < 12) {
            if (time == 0) {
                time = {time: 12, minutes: minutes, period: 'AM'};
            }
            else if (time < 10) {
                time = {time: "0" + time, minutes: minutes, period: 'AM'};
            }
            else {
                time = {time: time, minutes: minutes, period: 'AM'};
            }
        }
        else {
            time = {time: time == 12 ? 12 : (time - 12) < 10 ? "0" + (time - 12) : time - 12, minutes: minutes, period: 'PM'};
        }
        time.seconds = date.getSeconds();
        return time;
    }

    updateTime(time) {
        this.period.innerHTML = time.period;
        if (time.seconds == 0) {
            this.hour.innerHTML = `${time.time}:${time.minutes}`; 
        }
    }
}

const timeUpdater = new TimeUpdater(); //this alone takes care of updating everything related to time in the application top part of the screen