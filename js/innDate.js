var inputData = [];

$('#go').on('click', function (e) {
	inputData = [{date: document.getElementById('stDate').value}, {date: document.getElementById('enDate').value}];
	Date.prototype.daysInMonth = function(year, month) {return 33 - new Date(year, month, 33).getDate();};

	(function () {
		function splitDate (_data) {
			var _day = _data.slice(0, _data.indexOf('.'));
			var _month = _data.slice(_data.indexOf('.') + 1, _data.lastIndexOf('.'));
			var _year = _data.slice(_data.lastIndexOf('.') + 1);
			return [_day, _month, _year];
		}

		var _fDataArr = splitDate(inputData[0].date);
		var _eDataArr = splitDate(inputData[inputData.length - 1].date);

		if (_fDataArr[2] >= _eDataArr[2] && _fDataArr[1] >= _eDataArr[1] && _fDataArr[0] >= _eDataArr[0]) return;

		var counter = [_fDataArr[0], _fDataArr[1], _fDataArr[2]];
		var eCounter = [_eDataArr[0], _eDataArr[1], _eDataArr[2]];


		function getMaxDay (_month, _year) {
			return new Date().daysInMonth(_year, _month);
		}

		// использование Math.round() даст неравномерное распределение!
		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		var minP = document.getElementById('minPrice').value*1;
		var maxP = document.getElementById('maxPrice').value*1;

		var _tempArr = [{
			date: counter[0] + '.' + counter[1] + '.' + counter[2],
			summ: getRandomInt(minP, maxP)
		}];


		while (true) {
			// инкремент дат
			if (counter[0] == getMaxDay(counter[1], counter[2])) {
				counter[0] = 1;
				counter[1]++;
				if (counter[1] == 13) {
					counter[1] = 1;
					counter[2]++;
				}
			} else {
				counter[0]++;
			}

			var _newGenDate = counter[0] + '.' + counter[1] + '.' + counter[2];

			_tempArr[_tempArr.length] = {
				date: _newGenDate,
				summ: getRandomInt(minP, maxP)
			};

			// условие выхода
			if (counter[0] == eCounter[0]
			 && counter[1] == eCounter[1]
			 && counter[2] == eCounter[2]) {
			 	inputData = _tempArr;
				break;
			}

		}

		console.log('_____________');
		console.log(inputData);
		console.log('_____________');
	})();

	graphModule.init(inputData, {
		vLineCount: 6,
		hLineCount: 22
	});

	return false;
});