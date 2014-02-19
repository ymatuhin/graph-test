var graphModule = (function() {
	var settings = {};

	var _monthNames = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сен', 'окт', 'ноя', 'дек'];

	Date.prototype.daysInMonth = function(year, month) {
		return 33 - new Date(year, month, 33).getDate();
	};

	var dataObj = {
		originalData: [],
		newData: [],
		countBM: 0,
		splitDate: function (_data) {
			var _day = _data.slice(0, _data.indexOf('.'));
			var _month = _data.slice(_data.indexOf('.') + 1, _data.lastIndexOf('.'));
			var _year = _data.slice(_data.lastIndexOf('.') + 1);
			return [_day, _month, _year];
		},
		sorted: function () {

			function sortFunction(a, b) {
				a = a.date;
				b = b.date;

				a = dataObj.splitDate(a);
				b = dataObj.splitDate(b);

				var aDay = a[0]
				var bDay = a[0]

				aDay = (aDay.length === 1) ? '0' + aDay : aDay;
				bDay = (bDay.length === 1) ? '0' + bDay : bDay;

				var aMonth = a[1];
				var bMonth = b[1];

				aMonth = (aMonth.length === 1) ? '0' + aMonth : aMonth;
				bMonth = (bMonth.length === 1) ? '0' + bMonth : bMonth;


				var aYear = a[2];
				var bYear = b[2];

				if (aYear < bYear) {
					return -1;
				} else if (aYear > bYear) {
					return 1;
				} else {

					if (aMonth < bMonth) {
						return -1;
					} else if (aMonth > bMonth) {
						return 1;
					} else {

						if (aDay < bDay) {
							return -1;
						} else if (aDay > bDay) {
							return 1;
						} else {
							return 0;
						}

					}

				}
			}

			this.newData = this.originalData.sort(sortFunction);

			for (var i = 0; i < this.newData.length; i++) {
				var dataArr = this.splitDate(this.newData[i].date);

				var newDay = (dataArr[0].charAt(0) == '0') ? dataArr[0].substr(1) : dataArr[0];
				var newMonth = (dataArr[1].charAt(0) == '0') ? dataArr[1].substr(1) : dataArr[1];

				this.newData[i].date = newDay + '.' + newMonth + '.' + dataArr[2];
			};
		},
		fillBlankData: function () {
			var _fDataArr = this.splitDate(this.newData[0].date);
			var _eDataArr = this.splitDate(this.newData[this.newData.length - 1].date);

			if (_fDataArr[2] >= _eDataArr[2] && _fDataArr[1] >= _eDataArr[1] && _fDataArr[0] >= _eDataArr[0]) return;

			var counter = [_fDataArr[0], _fDataArr[1], _fDataArr[2]];
			var eCounter = [_eDataArr[0], _eDataArr[1], _eDataArr[2]];


			function getMaxDay (_month, _year) {
				return new Date().daysInMonth(_year, _month);
			}

			function getSummInDate (gsData) {
				for (var i = 0; i < dataObj.newData.length; i++) {
					if (dataObj.newData[i].date == gsData) {
						return dataObj.newData[i].summ;
					}
				};

				return 0;
			}

			var _tempArr = [{
				date: counter[0] + '.' + counter[1] + '.' + counter[2],
				summ: this.newData[0].summ
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
					summ: getSummInDate(_newGenDate)
				};


				// условие выхода
				if (counter[0] == eCounter[0]
				 && counter[1] == eCounter[1]
				 && counter[2] == eCounter[2]) {
				 	this.newData = _tempArr;
					break;
				}
			}

			console.log('_____________');
			console.log();
		},
		getMaxMinSumm: function (_arr) {
			var max = _arr[0].summ, min = _arr[0].summ;

			for (var i = 0; i < _arr.length; i++) {
				max = (_arr[i].summ > max) ? _arr[i].summ : max;
				min = (_arr[i].summ < min) ? _arr[i].summ : min;
			};

			return [max, min];
		},
		countMonthBetweenDate: function (date1, date2) {
			var d1 = this.splitDate(date1);
			var d2 = this.splitDate(date2);

			var countMonth;

			if (d1[2] == d2[2]) { // одинаковый год
				countMonth = d2[1] - d1[1];
			} else if (d1[2] < d2[2]) { // д2 > д1

				if (d1[1] < d2[1]) {
					countMonth = d2[1] - d1[1] + ((d2[2] - d1[2]) * 12);
				} else {
					countMonth = (12 - d1[1]) + d2[1]*1 + (((d2[2] - d1[2]) - 1) * 12);
				}

			} else { // ошибка
				return null;
			}

			this.countBM = countMonth + 1;

			return countMonth + 1;
		},
		countDayBetweenDate: function (date1, date2) {
			var d1 = this.splitDate(date1);
			var d2 = this.splitDate(date2);

			var st = new Date(d1[1] + '.' + d1[0] + '.' + d1[2]);
			var en = new Date(d2[1] + '.' + d2[0] + '.' + d2[2]);
			var d = en.getTime() - st.getTime();
			return d/(1000*60*60*24);
		},
		getElemAfterIndex: function (date, num) {

			var _ind = null;

			for (var i = 0; i < dataObj.newData.length; i++) {
				if (dataObj.newData[i].date == date) {
					_ind = i;
				}
			};

			if (_ind === null) return false;

			return dataObj.newData[_ind + num];
		}
	};

	var price = {
		jqObj: $('.graph__price'),
		update: function (_arr) {

			var appStr = '',
				maxMin = dataObj.getMaxMinSumm(_arr),
				arrPrices = [];

			counter = (Math.abs(maxMin[0]) + Math.abs(maxMin[1])) / (settings.vLineCount - 1);

			function numberWithSpaces(x) {
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			}


			for (var i = 0; i < settings.vLineCount; i++) {
				var _tempPrice = Math.round(maxMin[0] - i*counter);
				var _mnoj = 1000;

				_tempPrice = Math.round(_tempPrice/_mnoj)*_mnoj;

				appStr += '<tr><td>' + numberWithSpaces(_tempPrice);
			};

			this.jqObj.empty().append(appStr);

			var cellH = this.jqObj.find('td').height();

			this.jqObj.css({
				height: grayHorLines.jqObj.height() + (cellH) + 'px',
				top: (cellH/2) * (-1) + 'px'
			});
		}
	};

	var grayHorLines = {
		jqObj: $('.graph__lines'),
		update: function () {
			var appStr = '',
				arrTop = [];


			counter = (this.jqObj.height()) / (settings.vLineCount - 1);

			for (var i = 0; i < settings.vLineCount; i++) {
				appStr += '<li style="top:' + i*counter + 'px;">';
			};

			this.jqObj.empty().append(appStr);
		}
	};

	var graph = {
		jqObj: $('.graph'),
		jqObjDate: $('.graph__days'),
		dateUpd: function (obj, del) {
			var _appTxt = '<tr>',
				textMonth,
				_counter = 0;

			// var sM = dataObj.splitDate(dataObj.newData[0].date);
			// var eM = dataObj.splitDate(dataObj.newData[dataObj.newData.length - 1].date);

			// var actualYear = sM[2], actualMonth = sM[1];

			setTimeout(function() {
				var activeM = [];
				slider.jqText.find('span').each(function (ind, el) {
					if ($(this).hasClass('active')) {
						activeM.push($(this).text());
					}
				});


				console.log('activeM', activeM);

				function thisMonthIsActive (month) {
					for (var i = 0; i < activeM.length; i++) {
						if (activeM[i] == _monthNames[month - 1]) {
							return true;
						}
					};
					return false;
				}


				for (var i = 0; i < obj.length; i++) {
					var _d = dataObj.splitDate(obj[i].date);
					if (_d[0] > 0 && _d[0] <= del) {
						var _t = _d[1] - 1;
						if (thisMonthIsActive(_d[1])) {
							_appTxt += '<td><b>' + _monthNames[_t] + '</b>';
						} else {
							_appTxt += '<td><i>' + _monthNames[_t] + '</i>';
						}
					} else {
						if (thisMonthIsActive(_d[1])) {
							_appTxt += '<td>' + _d[0];
						} else{
							_appTxt += '<td><i>' + _d[0] + '</i>';
						}
					}
				};

				graph.jqObjDate.empty().append(_appTxt);

			}, 0);


		},
		sliceArr: function (obj) {
			var _counter = 0, _stInd, _enInd;

			for (var i = 0; i < dataObj.newData.length; i++) {
				if (dataObj.newData[i].date == obj[0]) {
					_stInd = _counter;
				}
				if (dataObj.newData[i].date == obj[1]) {
					_enInd = _counter;
				}
				_counter++;
			};

			var _tArr = dataObj.newData.slice(_stInd, _enInd);

			// var _tObj = {};

			// for (var i = 0; i < _tArr.length; i++) {
			// 	try {
			// 		_tObj[_tArr[i].date].summ = _tArr[i].summ;
			// 	} catch (e) {
			// 		_tObj[_tArr[i].date] = {'summ' : 0};
			// 	}
			// };

			// console.info(_tObj);

			return _tArr;
		},
		sliceArrFromSett: function (obj, del) {
			if (!del) {
				del = 1;
				for (var i = 1; i <= 30; i++) {
					if (obj.length/i < Math.ceil(settings.hLineCount/10*8)) { //~80%
						del = i;
						break;
					}
				};
			}

			var _splCounter = 1, _forCounter = obj.length - 1;

			function clone(obj){
				if(obj == null || typeof(obj) != 'object')
					return obj;
				var temp = new obj.constructor();
				for(var key in obj)
					temp[key] = clone(obj[key]);
				return temp;
			}

			var _obj = clone(obj);

			for (var i = 1; i <= _forCounter; i++) {
				if (i%del) {
					_obj[_splCounter - 1].summ += _obj[_splCounter].summ;
					_obj.splice(_splCounter, 1);
				} else {
					_splCounter++;
				}
			}
			return [_obj, del];
		},
		addToArrData: function (obj, del) {
			var dCount = Math.ceil(settings.hLineCount - obj.length)/2;
			var dCLeft = Math.floor(dCount);
			var dCRight = Math.ceil(dCount);

			var d1 = obj[0].date;
			var d2 = obj[obj.length - 1].date;
			var d2_lm1;

			try {
				d2_lm1 =  dataObj.getElemAfterIndex(d2, del).date;
			} catch (e) {
				d2_lm1 = d2;
			}

			var _z = null;
			var _w = null;

			for (var i = 0; i < dataObj.newData.length; i++) {
				if (dataObj.newData[i].date == d1) {
					_z = i;
				}
				if (dataObj.newData[i].date == d2) {
					_w = i;
				}
			};

			var _newLC = _z - dCLeft * del
			var _newLCx2 = _z - (dCLeft + dCRight) * del
			var _newRC = _w + dCRight * del;
			var _newRCx2 = _w + (dCRight + dCLeft) * del;

			var _tLArr = [];
			var _tRArr = [];

			console.log('**********************')

			if (_newLC >= 0 && _newRC <= (dataObj.newData.length - 1 - del)) { // Есть места с обеих сторон
				console.log('TWO DIR')
				_tLArr = this.sliceArr([dataObj.newData[_newLC].date, d1]);
				_tRArr = this.sliceArr([d2_lm1, dataObj.newData[_newRC].date]);
				console.log('===', d2_lm1);

				_tLArr = this.sliceArrFromSett(_tLArr, del)[0];
				_tRArr = this.sliceArrFromSett(_tRArr, del)[0];
			} else if (_newLC >= 0) { // Только слева
				console.log('LEFT ONLY')
				if (_newLCx2 >= 0) { // Можно взять двойные слева
					console.log('LEFT ONLY x2')
					_tLArr = this.sliceArr([dataObj.newData[_newLCx2].date, d1]);
					_tLArr = this.sliceArrFromSett(_tLArr, del)[0];
				} else {
					_tLArr = this.sliceArr([dataObj.newData[_newLC].date, d1]);
					_tLArr = this.sliceArrFromSett(_tLArr, del)[0];
				}
			} else if (_newRC <= (dataObj.newData.length - 1)) { // Только справа
				console.log('RIGHT ONLY')
				if (_newRCx2 <= (dataObj.newData.length - 1)) { // Можно взять двойные
					console.log('RIGHT ONLY x2')
					_tRArr = this.sliceArr([d2, dataObj.newData[_newRCx2].date]);
					_tRArr = this.sliceArrFromSett(_tRArr, del)[0];
				} else {
					_tRArr = this.sliceArr([d2, dataObj.newData[_newRC].date]);
					_tRArr = this.sliceArrFromSett(_tRArr, del)[0];
				}
			} else {
				console.log('NO DIR')
				_tLArr = this.sliceArr([dataObj.newData[0].date, d1]);
				_tLArr = this.sliceArrFromSett(_tLArr, del)[0];
				_tRArr = this.sliceArr([dataObj.newData[dataObj.newData.length - 1].date, d1]);
				_tRArr = this.sliceArrFromSett(_tRArr, del)[0];
			} // Нет

			console.log('**********************')

			// Добавление элементов по краям

				function clone(obj){
					if(obj == null || typeof(obj) != 'object')
						return obj;
					var temp = new obj.constructor();
					for(var key in obj)
						temp[key] = clone(obj[key]);
					return temp;
				}

				var _obj = clone(obj);
				console.info('Before obj', _obj)

				for (var i = _tLArr.length - 1; i >= 0; i--) {
					obj.unshift(_tLArr[i]);
				};

				for (var j = 0; j < _tRArr.length; j++) {
					obj.push(_tRArr[j])
				};

				console.info('_tLArr, _tRArr', _tLArr, _tRArr)
				console.info('obj', obj)

			//

			console.log('z', _z)
			console.log('w', _w)

			console.log('dataObj.newData.length', dataObj.newData.length);
			console.log('dCLeft', dCLeft);
			console.log('dCRight', dCRight);
			console.log('del', del);
			console.log('--------------------');

			console.log('_newLC', _newLC);
			console.log('_newLCx2', _newLCx2);
			console.log('_newRC', _newRC);
			console.log('_newRCx2', _newRCx2);

			// console.log(dataObj.countDayBetweenDate(d1, d2));

			return obj;
		},
		draw: function (iArr) {

			var _appStr = '<tr>';

			var maxMin = dataObj.getMaxMinSumm(iArr);
			var _prevTop = 0;

			for (var i = 0; i < iArr.length; i++) {
				var pers = Math.round((iArr[i].summ - maxMin[1]) / ((maxMin[0] - maxMin[1]) / 100));
				var _style = ' style="top:' + pers + '%;" '

				_appStr += '<td><div data-price="' + iArr[i].summ + '" data-date="' + iArr[i].date + '" class="graph__m-line" ' + _style + '></div>';

				if (i !== 0) {
					var _nTop = (pers <= _prevTop) ? pers : _prevTop;
					var _nBot = (pers >= _prevTop) ? (100 - pers) : (100 - _prevTop);

					// 1.5 - 3px от 200 (не дотягивает)
					_style = ' style="top:' + (_nTop + 1.5) + '%; bottom:' + (_nBot ) + '%;" ';
					_appStr +=  '<i class="graph__add-r-line" ' + _style + '></i>';
				}

				_prevTop = pers;

			};

			this.jqObj.empty().append(_appStr);
		},
		update: function (obj) {

			var _tempArr = this.sliceArr(obj);
			var _t = this.sliceArrFromSett(_tempArr);

			_tempArr = this.addToArrData(_t[0], _t[1]);

			console.info('_tempArr length', _tempArr.length);




			price.update(_tempArr);
			this.dateUpd(_tempArr, _t[1])
			this.draw(_tempArr);
		}
	};

	var slider = {
		jqSlider: $('#slider'),
		jqText: $('.slider-calendar'),
		updText: function () {
			var _appTxt = '<tr>',
				textMonth,
				_counter = 0;

			var sM = dataObj.splitDate(dataObj.newData[0].date);
			var eM = dataObj.splitDate(dataObj.newData[dataObj.newData.length - 1].date);

			var actualYear = sM[2], actualMonth = sM[1];


			while (true) {
				textMonth = (actualMonth == 1) ? ('<b>' + actualYear + '</b>') : _monthNames[actualMonth - 1];
				_appTxt += '<td><span>' + textMonth + '</span></td>';

				if (actualMonth == eM[1] && actualYear == eM[2]) break;
				if (_counter > 20) break;

				actualMonth++;
				_counter++;

				if (actualMonth == 13) {
					actualMonth = 1;
					actualYear++;
				}

				// console.log(actualYear + ' / ' + actualMonth);

			}
			// console.info(_appTxt);
			this.jqText.empty().append(_appTxt);
		},
		getDateFromValues: function (vals) {
			var sM = vals[0],
				eM = vals[1],
				numStM, numEnM,
				stDate = dataObj.splitDate(dataObj.newData[0].date),
				counterM = 0,
				_d1, _d2;

			for (var i = 0; i < dataObj.newData.length; i++) {
				var _thisDate = dataObj.splitDate(dataObj.newData[i].date);

				if (_thisDate[1] !== stDate[1]) {
					stDate[1] = _thisDate[1];
					counterM++;

					if (sM == 0) {
						_d1 = dataObj.newData[0].date;
					}

					if (eM == dataObj.countBM) {
						_d2 = dataObj.newData[dataObj.newData.length - 1].date;
					}

					if (counterM == sM) {
						_d1 = dataObj.newData[i].date;
					}

					if (counterM == eM) {
						_d2 = dataObj.newData[i - 1].date;
					}
				}
			};

			return [_d1, _d2];
		},
		init: function () {
			var activeMonth = document.getElementById('nMonth').value*1;

			this.jqText.find('td').eq(activeMonth).find('span').addClass('active');

			var prevVal = [null, null];

			this.jqSlider.slider({
				range: true,
				min: 0,
				max: dataObj.countBM,
				values: [ activeMonth, activeMonth + 1 ],
				step: 1,
				animate: 'fast',
				start: function(event, ui) {
					prevVal = ui.values;
				},
				slide: function(event, ui) {

					if (ui.values[0] == ui.values[1]) {
						setTimeout(function() {
							slider.jqSlider.slider( "values", [ prevVal[0], prevVal[1] ] );
						}, 0);
						return false;
					} else {
						prevVal = ui.values;
					}

					slider.jqText.find('span').removeClass('active');
					slider.jqText.find('td').each(function (ind, el) {
						if (ind >= ui.values[0] && ind < ui.values[1]) {
							$(el).find('span').addClass('active');
						}
					});
				},
				create: function (event, ui) {
					graph.update(slider.getDateFromValues([ activeMonth, activeMonth + 1 ]));
				},
				change: function (event, ui) {
					graph.update(slider.getDateFromValues(ui.values));
				}
			});

			this.jqText.find('span').on('click', function () {
				var numEl = $(this).parent('td').index();
				var values = slider.jqSlider.slider( "option", "values" );

				var v1, v2;

				if (Math.abs(numEl - values[0]) >= Math.abs(numEl - values[1])) {
					v1 = values[0];
					v2 = numEl + 1;
				} else {
					v1 = numEl;
					v2 = values[1];
				}

				slider.jqSlider.slider( "values", [ v1, v2 ] );

				slider.jqText.find('span').removeClass('active');
				slider.jqText.find('td').each(function (ind, el) {
					if (ind >= v1 && ind < v2) {
						$(el).find('span').addClass('active');
					}
				});

			});
		}
	};


	var _initCounter = 0;
	return {
		init: function(innData, innSettings) {
			if (_initCounter) {
				this.update(innData);
				return;
			}

			settings = (innSettings) ? innSettings : settings;

			dataObj.originalData = innData;
			dataObj.sorted();
			dataObj.fillBlankData();

			var _cMonth = dataObj.countMonthBetweenDate(dataObj.newData[0].date, dataObj.newData[dataObj.newData.length - 1].date);

			if (_cMonth == null || !(_cMonth >= 2 && _cMonth <= 16)) {
				alert('Количество месяцев должно быть от 2 до 16');
				return;
			}

			slider.updText();
			slider.init();

			grayHorLines.update();

			_initCounter++;
		},
		update: function (innData) {
			dataObj.originalData = innData;
			dataObj.sorted();
			dataObj.fillBlankData();

			var _cMonth = dataObj.countMonthBetweenDate(dataObj.newData[0].date, dataObj.newData[dataObj.newData.length - 1].date);

			if (_cMonth == null || !(_cMonth >= 2 && _cMonth <= 16)) {
				alert('Количество месяцев должно быть от 2 до 16');
				return;
			}


			slider.updText();
			slider.init();


			grayHorLines.update();
		},
		destroy: function () {

		},
		showData: function(data) {

			console.log('---------------------------')

			for (var i = 0; i < data.length; i++) {
				console.log(data[i].date)
				console.info(data[i].summ)
			};

			console.log('---------------------------')
			console.log(data.length);
		}
	}
})();