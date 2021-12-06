document.getElementById("formSubmit").addEventListener("click", function() {
	//Used to convert from the numerical values to the long, written-out months and days
	const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	
	//Get hour and minute values from the form, and determine if AM or PM
	let hours = document.getElementById('hours').value;
	let min = document.getElementById('min').value;
	let isAM = true;
	if (document.getElementById('AMPM').value == 'PM') {
		isAM = false;
	}
	
	//Convert from 12 hour to 24 hour time (12 AM -> 0, 2 PM -> 14, etc.)
	if (hours == 12 && isAM) {
		hours = 0;
	} else if (hours != 12 && !isAM) {
		hours = parseInt(hours, 10) + 12;
	}
	
	//Get the date values from the form
	let year = document.getElementById('year').value;
	let month = document.getElementById('month').value;
	let day = document.getElementById('day').value;
	
	//Validate, if unsuccessful the function will end and the user must start it again
	if (invalid(hours, min, month, day) == true) {
		console.log(hours); console.log(min); console.log(month); console.log(day);
		alert('One or more of the time or date values are invalid.');
		return;
	}
	
	//Create the date objects
	let fromTime = new Date(year, (month-1), day, hours, min, 0);
	let toTime = new Date(year, (month-1), day, hours, min, 0);
	
	//The setTime() & getTime() methods use milliseconds since the Unix epoch (1970-01-01 00:00:00)
	let fromZone = document.getElementById('fromZone').value;
	let timeToAdd1 = msToAdd(fromZone);
	fromTime.setTime(fromTime.getTime() + timeToAdd1);
	let toZone = document.getElementById('toZone').value;
	let timeToAdd2 = msToAdd(toZone);
	toTime.setTime(toTime.getTime() + timeToAdd2);
	
	//Create the time strings and display them
	let fromTimeString = fromTime.toUTCString().substr(fromTime.toUTCString().indexOf(':') - 2, 8);
	let toTimeString = toTime.toUTCString().substr(toTime.toUTCString().indexOf(':') - 2, 8);
	fromTimeString = to12Hour(fromTimeString);
	toTimeString = to12Hour(toTimeString);
	document.getElementById('fromTime').innerHTML = fromTimeString;
	document.getElementById('toTime').innerHTML = toTimeString;
	
	//Create the date strings
	let tempDay = fromTime.getUTCDate();
	let tempWeekday = daysOfWeek[fromTime.getUTCDay()];
	let tempMonth = months[fromTime.getUTCMonth()];
	let tempYear = fromTime.getUTCFullYear();
	document.getElementById('fromDate').innerHTML = (tempWeekday+' '+tempDay+' '+tempMonth+' '+tempYear);
	tempDay = toTime.getUTCDate();
	tempWeekday = daysOfWeek[toTime.getUTCDay()];
	tempMonth = months[toTime.getUTCMonth()];
	tempYear = toTime.getUTCFullYear();
	document.getElementById('toDate').innerHTML = (tempWeekday+' '+tempDay+' '+tempMonth+' '+tempYear);
	
	//Calculate the time difference and convert from milliseconds to hours & minutes
	let difference = toTime.getTime() - fromTime.getTime();
	if (difference == 0) {
		document.getElementById('difference').innerHTML = 'Time 1 is the same as Time 2.';
	}
	if (difference > 0) {
		document.getElementById('aheadBehind').innerHTML = 'behind';
		document.getElementById('dHours').innerHTML = toHoursMin(difference)[0];
		document.getElementById('dMin').innerHTML = toHoursMin(difference)[1];
	}
	if (difference < 0) {
		document.getElementById('aheadBehind').innerHTML = 'ahead of';
		document.getElementById('dHours').innerHTML = toHoursMin(difference * -1)[0];
		document.getElementById('dMin').innerHTML = toHoursMin(difference * -1)[1];
	} 
	
	//isNight statements from the main page, used to set the backgrounds
	if (isNight(fromTime.getUTCHours())) {
		document.getElementById('zone1').classList.add('night');
		document.getElementById('zone1').classList.remove('day');
		document.getElementById('zone1').classList.remove('transition');
		if (isTransition(toTime.getUTCHours())) {
			document.getElementById('zone1').classList.add('transition');
			document.getElementById('zone1').classList.remove('night');
		}
	} else {
		document.getElementById('zone1').classList.add('day');
		document.getElementById('zone1').classList.remove('night');
		document.getElementById('zone1').classList.remove('transition');
	}
	if (isNight(toTime.getUTCHours())) {
		document.getElementById('zone2').classList.add('night');
		document.getElementById('zone2').classList.remove('day');
		document.getElementById('zone2').classList.remove('transition');
		if (isTransition(toTime.getUTCHours())) {
			document.getElementById('zone2').classList.add('transition');
			document.getElementById('zone2').classList.remove('night');
		}
	} else {
		document.getElementById('zone2').classList.add('day');
		document.getElementById('zone2').classList.remove('night');
		document.getElementById('zone2').classList.remove('transition');
	}
});

function msToAdd (targetZone) {
	let amountToAdd = 0;
	//The switch will provide the proper offset
	switch (targetZone) {
		case 'N12': amountToAdd = -43200000; break;
		case 'N11': amountToAdd = -39600000; break;
		case 'N10': amountToAdd = -36000000; break;
		case 'N9': amountToAdd = -32400000; break;
		case 'N8': amountToAdd = -28800000; break;
		case 'N7': amountToAdd = -25200000; break;
		case 'N6': amountToAdd = -21600000; break;
		case 'N5': amountToAdd = -18000000; break;
		case 'N4': amountToAdd = -14400000; break;
		case 'N3': amountToAdd = -10800000; break;
		case 'N2': amountToAdd = -7200000; break;
		case 'N1': amountToAdd = -3600000; break;
		case '0': amountToAdd = 0; break;
		case 'P1': amountToAdd = 3600000; break;
		case 'P2': amountToAdd = 7200000; break;
		case 'P3': amountToAdd = 10800000; break;
		case 'P4': amountToAdd = 14400000; break;
		case 'P430': amountToAdd = 16200000; break;
		case 'P5': amountToAdd = 18000000; break;
		case 'P530': amountToAdd = 19800000; break;
		case 'P6': amountToAdd = 21600000; break;
		case 'P630': amountToAdd = 23400000; break;
		case 'P7': amountToAdd = 25200000; break;
		case 'P8': amountToAdd = 28800000; break;
		case 'P9': amountToAdd = 32400000; break;
		case 'P10': amountToAdd = 36000000; break;
		case 'P11': amountToAdd = 39600000; break;
		case 'P12': amountToAdd = 43200000; break;
		case 'P13': amountToAdd = 46800000; break;
		case 'P14': amountToAdd = 50400000; break;
	}
	return amountToAdd;
}

//Perform validation
function invalid(hours, min, month, day) {
	if (hours < 0 || hours > 23 || min < 1 || min > 59 ||
		month < 1 || month > 12 || day < 1 || day > 31
	) {
		return true;
	} else {
		return false;
	}
}

//Converts from Unix milliseconds to hours & minutes
function toHoursMin (diff) {
	let m = ((diff / (1000 * 60)) % 60);
	let h = Math.floor((diff / (1000 * 60 * 60)) % 24);
	return [h, m];
}

//24-hour to 12-hour function from the main page's JavaScript
function to12Hour (s) {
	let hour = new Number(s.slice(0, 2));
	if (hour > 12) {
        s = (hour - 12) + s.slice(2, 8) + " PM";
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