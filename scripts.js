window.addEventListener('load', () => {
let date = new Date();
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let day = date.getDate();
let weekday = daysOfWeek[date.getDay()];
let month = months[date.getMonth()];
let year = date.getFullYear();
document.getElementById('dateLocal').innerHTML = (weekday+' '+day+' '+month+' '+year);
let dayUTC = date.getUTCDate();
let weekdayUTC = daysOfWeek[date.getUTCDay()];
let monthUTC = months[date.getUTCMonth()];
let yearUTC = date.getUTCFullYear();
document.getElementById('dateUTC').innerHTML = (weekdayUTC+' '+dayUTC+' '+monthUTC+' '+yearUTC);

if (isNight(date.getHours())) {
	document.getElementById('local').classList.add('night');
	if (isTransition(date.getHours())) {
		document.getElementById('local').classList.add('transition');
		document.getElementById('local').classList.remove('night');
	}
} else {
	document.getElementById('local').classList.add('day');
}
if (isNight(date.getUTCHours())) {
	document.getElementById('UTC').classList.add('night');
	if (isTransition(date.getUTCHours())) {
		document.getElementById('UTC').classList.add('transition');
		document.getElementById('UTC').classList.remove('night');
	}
} else {
	document.getElementById('UTC').classList.add('day');
}

//toString() output: Wed Nov 24 2021 23:33:57 GMT-0500 (Eastern Standard Time)
let timeString = date.toString();
let localZone = timeString.slice(timeString.indexOf('(') + 1, timeString.indexOf(')'));
document.getElementById('local-timezone').innerHTML = localZone;
let offset = timeString.substr(timeString.indexOf('(') -6, 5);
offset = offset.slice(0, 3) + ":" + offset.slice(3, 5);
document.getElementById('offset').innerHTML = offset;

//3,600,000 milliseconds in an hour and 60,000 in a minute
const amountToAdd = [3600000,3600000,3600000,1800000,1800000,3600000,3600000,3600000,3600000,3600000,1800000,1800000,1800000,1800000,3600000,3600000,3600000,3600000,3600000,1800000,1800000,1800000,1800000,1800000,900000,900000,1800000,1800000,3600000,2700000,900000,1800000,1800000,1800000,1800000,3600000,2700000,900000,2700000,900000];
//                   -12:00  -11:00  -10:00  -09:30  -09:00  -08:00  -07:00  -06:00  -05:00  -04:00  -03:30  -03:00  -02:30  -02:00  -01:00  ±00:00  +01:00  +02:00  +03:00  +03:30  +04:00  +04:30  +05:00  +05:30  +05:45 +06:00 +06:30  +07:00  +08:00  +08:45  +09:00 +09:30  +10:00  +10:30  +11:00  +12:00  +12:45  +13:00 +13:45  +14:00
currentTimeUpdate();

function currentTimeUpdate () {
	let time = new Date();
	//2021,11,6,15,05,0
	let timeLocal = time.toString().substr(time.toString().indexOf(':') - 2, 8);
	let timeUTC = time.toUTCString().substr(time.toUTCString().indexOf(':') - 2, 8);
	timeLocal = to12Hour(timeLocal);
	timeUTC = to12Hour(timeUTC);
	document.getElementById('timeLocal').innerHTML = timeLocal;
	document.getElementById('timeUTC').innerHTML = timeUTC;

	time.setTime(time.getTime() - 46800000);
	//document.getElementById(0).innerHTML = to12Hour(time.toUTCString().substr(time.toUTCString().indexOf(':') - 2, 8))+'<br>'+daysOfWeek[time.getUTCDay()];
	for (i = 0; i < 40; i++) {
		time.setTime(time.getTime() + amountToAdd[i]);
		document.getElementById(i).innerHTML = to12Hour(time.toUTCString().substr(time.toUTCString().indexOf(':') - 2, 8))+'<br>'+daysOfWeek[time.getUTCDay()];
		if (isNight(time.getUTCHours())) {
			document.getElementById('d'+i).classList.add('night');
			document.getElementById('d'+i).classList.remove('day');
			document.getElementById('d'+i).classList.remove('transition');
			if (isTransition(time.getUTCHours())) {
				document.getElementById('d'+i).classList.add('transition');
				document.getElementById('d'+i).classList.remove('night');
			}
		} else {
			document.getElementById('d'+i).classList.add('day');
			document.getElementById('d'+i).classList.remove('night');
			document.getElementById('d'+i).classList.remove('transition');
		}
	}
	setTimeout(currentTimeUpdate, 1000); //1000 ms = 1 second
}

function to12Hour (s) {
	let hour = new Number(s.slice(0, 2));
	if (hour > 12) {
		if (hour < 10) {
			s = "0" + (hour - 12) + s.slice(2, 8) + " PM";
		} else {
			s = (hour - 12) + s.slice(2, 8) + " PM";
		}
	} else if (hour == 12) {
    	s = hour + s.slice(2, 8) + " PM";
    } else if (hour == 0) {
    	s = "12" + s.slice(2, 8) + " AM";
    } else {
		s = s + " AM";
	}
	return s;
}

function isNight (hours) {
	return (hours <= 6) || (hours >= 16);
}
function isTransition (hours) {
	return ((hours == 5 || hours == 6) || (hours == 16 || hours == 17));
}
});
