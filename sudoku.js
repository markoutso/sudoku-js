Object.prototype.clone = function() {
	if( this === null || typeof this !== 'object') {
		return this;
	}
	var newObj = (this instanceof Array) ? [] : {};
	for (var i in this) {
		if(i != "clone") {
			if (this[i] && typeof this[i] === "object") {
				newObj[i] = this[i].clone();
			} else {
				newObj[i] = this[i];
			}
		}
	} 
	return newObj;
};

(function() {
	var counter = -1;
	var genId = function() {
		counter += 1;
		return counter;
	};
	Object.prototype.id = function() {
		var _id = genId();
		this.id = function() {
			return _id;
		};
		return _id;
	};
})();

Array.prototype.equals = function(arr) {
	var l = this.length, al = arr.length;
	if(l != al) {
		return false;
	}
	if(l > 0 && isNumber(this[0])) {
		this.sort(compareNumbers);
		arr.sort(compareNumbers);
	} else {
		this.sort();
		arr.sort();
	}
	for(var i = 0; i < l; i += 1) {
		if(this[i] != arr[i]) {
			return false;
		}
	}
	return true;
};
Object.prototype.props1level = function() {
	var ret = [];
	for(var i in this) {
		if(this.hasOwnProperty(i)) {
			ret.push(i);
		}
	}
	return ret;
};
Object.prototype.debug = function() {
	var name;
	for(name in this) {
		if(this.hasOwnProperty(name) && typeof this[name] != 'function') {
			alert(name + ' : ' + this[name]);
		}
	}
};

Array.prototype.head = function() {
	return this.length > 0 ? this[0] : [];
};

Array.prototype.tail = function() {
	return this.length > 1 ? this.slice(1) : [];
};

/*
Array.prototype.withSort = function() {
	var fn = arguments[0], args = Array.prototype.slice.call(arguments, 1), self = this;
	alert(args);
	return function() {
		this.sort();
		fn.apply(self, args);
	};
};
*/
Array.prototype.has = function(value) {
	for(var i = 0, l = this.length; i < l; i += 1) {
		if(this[i] == value) {
			return true;
		}
	}
	return false;
};

Array.prototype.difference = function(arr) {
	return this.filter(function(value) {
		return !arr.has(value);
	});
};
Array.prototype.intersection = function(arr) {
	var l = this.length, al = arr.length, i1 = 0, i2 = 0, ret = [];
	if(l > 0 && isNumber(this[0])) {
		this.sort(compareNumbers);
		arr.sort(compareNumbers);
	} else {
		this.sort();
		arr.sort();
	}
	
	while(i1 < l && i2 < al) {
		if(this[i1] == arr[i2]) {
			ret.push(this[i1]);
			i1 += 1;
			i2 += 1;
		} else if(this[i1] < arr[i2]) {
			i1 += 1;
		} else {
			i2 += 1;
		}
	}
	return ret;
};
Array.prototype.union = function(arr) {
	var l = this.length, al = arr.length, i1 = 0, i2 = 0, ret = [];
	if(l > 0 && isNumber(this[0])) {
		this.sort(compareNumbers);
		arr.sort(compareNumbers);
	} else {
		this.sort();
		arr.sort();
	}
	
	while(i1 < l && i2 < al) {
		if(this[i1] < arr[i2]) {
			ret.push(this[i1]);
			i1 += 1;
		} else if(arr[i2] < this[i1]) {
			ret.push(arr[i2]);
			i2 += 1;
		} else {
			ret.push(this[i1]);
			i1 += 1;
			i2 += 1;
		}
	}
	if(i1 == l) {
		ret = ret.concat(arr.slice(i2));
	} else if(i2 == al) {
		ret = ret.concat(this.slice(i1));
	}
	return ret;
};
Array.prototype.contains = function(arr) {
	//...
	return this.intersection(arr).equals(arr);
};
//faster implementation using a hash?
Array.prototype.filter = function(fn) {
	var ret = [];
	for(var i = 0, l = this.length; i < l; i += 1) {
		if(fn(this[i], i, this)) {
			ret.push(this[i]);
		}
	}
	return ret;
};

Array.prototype.each = function(fn) {
	for(var i = 0, l = this.length; i < l; i += 1) {
		fn(this[i], i, this);
	}
	return this;
};

Array.prototype.map = function(fn) {
	var ret = [];
	for(var i = 0, l = this.length; i < l; i += 1) {
		ret.push(fn(this[i], i, this));
	}
	return ret;
};

Array.prototype.fold = function(initial, fn) {
	var acc = initial;
	for(var i = 0, l = this.length; i < l; i += 1) {
		acc = fn(acc, this[i], i, this);
	}
	return acc;
};
Array.prototype.some = function(fn) {
	for(var i = 0, l = this.length; i < l; i += 1) {
		if(fn(this[i], i, this)) {
			return true;
		}
	}
	return false;
};
Array.prototype.every = function(fn) {
	for(var i = 0, l = this.length; i < l; i += 1) {
		if(!fn(this[i], i, this)) {
			return false;
		}
	}
	return true;
};
Array.prototype.firstIndexOf = function(fn) {
	for(var i = 0, l = this.length; i < l; i += 1) {
		if(fn(this[i], i, this)) {
			return i;
		}
	}
	return -1;
};
Array.prototype.remove = function(values) {
	var ret = false;
	if(!isArray(values)) {
		values = [values];
	}
	for(var v = 0, vl = values.length; v < vl; v += 1) {
		for(var i = 0; i < this.length;) {
			if(this[i] == values[v]) {
				this.splice(i, 1);
				ret = true;
			} else {
				i += 1;
			}
		}
	}
	return ret;
};
Array.prototype.clearDuplicates = function() {
	this.sort(compareNumbers);
	for(var i = 1; i < this.length;) {
		if(this[i - 1] == this[i]) {
			this.splice(i, 1);
		} else {
			i += 1;
		}
	}
	return this;
};
/*Array.prototype.withoutDuplicates = function() {
	if(this.length > 0) {
		return [this[0]].concat(this.filter(function(v, i arr) {
			return i > 0 && arr[i] != arr[i-1];
		}));
	} else {
		return [];
	}
};*/
Array.prototype.powerSet = function() {
	return this.fold([[]], function(acc, value) {
		return acc.concat(acc.map(function(st) {
			return st.concat(value);
		}));
	});
};
Array.prototype.combinations = function(k) {
	if(k > this.length) {
		return [];
	}
	var head = this.head();
	var tail = this.tail();
	if(k == 1) {
		return this.map(function(value) {
			return [value];
		});
	} else {
		var ret = tail.combinations(k - 1).map(function(comb) {
			comb.unshift(head);
			return comb;
		});
		if(tail.length >= k) {
			return ret.concat(tail.combinations(k));
		} else {
			return ret;
		}
	}
};
function range(l, h, s) {
	s = s || 1;
	var ret = [];
	for(var i = l; i <= h; i += s) {
		ret.push(i);
	}
	return ret;
};
function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]'; 
};
function isNumber(obj) {
	return typeof obj == 'number' ;//&& isFinite(obj);
};
function compareNumbers(a, b) {
	return a - b;
};
Function.prototype.memoize = function() {
	var fn = this;
	this.memory = {};
	return function() {
		var args = Array.prototype.slice.call(arguments);
		return fn.memory[args] ? fn.memory[args] : fn.memory[args] = fn.apply(this, arguments);
	};
};
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function onLoad() {

//sudoku.init('000023000004000100050084090001070902093006000000010760000000000800000004060000587');
//sudoku.init('385020090916005002247000000000007050600040009070200000000000830800100907030080041');
//sudoku.init('200601983086395201319028006160039820802060130003182060038910602621803090970206318');
sudoku.init('041298075597136482802547000910024758085001294724859003450903020270415000100002540');
//sudoku.init('638290705012008396590003208900830102856912437123000809009380021360720984280049073');
//sudoku.init('007000280034025000280004600090006000300000002000100090006200075000570400078000300');
sudoku.solve();


//sudoku.init('007008000006020300030000009010050060000010000070900002000000004083004000260000510');

//sudoku.init('700000400020070080003008009000500300060020090001007006000300900030040060009001035');
//sudoku.init('053100004060005008008200003000000000025800090700001060032000000004780006000000081');
//sudoku.init('000047000000100002030000410000200063005008009070000500400070006006802000050900300');
//sudoku.init('487300090000600271126090384705000162000200800000000009001076923300100450000053018');
//sudoku.init('100000089000009102000000450007600000030040000900002005004070000500008010060300000');
//sudoku.init('100000089000009102000000450007600000030040000900002005004070000500008010060300000');
//sudoku.init('100000089000009002000000450007600000030040000900002005004070000500008010060300000');
var puzzle = sudoku.exportPuzzle();
console.log(puzzle);

}
(function(ns) {
	var sudoku = {
		INCLUDE_POS : true,
		EXCLUDE_POS : false,
		cells : [],
		root : null,
		theParent : null,
		rootDom : null,
		domNodes : [],
		methods : ['nakedSingles', 'hiddenSingles', 'lockedCandidates', 'nakedSubsets', 'hiddenSubsets', 'gridAnalysis', 'color', 'guess'],
		//methods : ['nakedSingles', 'hiddenSingles'],
		areas : range(0, 8),
		numbers : range(1, 9),
		gridArea : range(0, 80),
		rowAreas : [],
		colAreas: [],
		boxAreas : [],
		houseAreas : [],
		guessStack : [],
		solve : function() {
			var mi = 0, valid = true;
			do {
				if(this[this.methods[mi]]()) {
					console.log(this.methods[mi] + " success " );
					if(!sudoku.isValid()) {
						console.log('backtracking...');
						valid = this.backTrack();
					}
					mi = 0;
				} else {
					console.log(this.methods[mi] + " fail " );
					mi += 1;
				}
			}while(valid && !this.solved() && mi < sudoku.methods.length);
			if(!valid) {
				console.log('invalid');
			}
		},
		solved : function() {
			return this.cells.every(function(node) {
				return node.value != 0;
			});
		},
		isValid : function() {
			return this.houseAreas.every(function(area) {
				var counters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				var valid = true;
				area.each(function(pos) {
					if(sudoku.cells[pos].value == undefined || sudoku.cells[pos].candidates[0] == undefined) {
						valid = false;
					}
					counters[sudoku.cells[pos].value] += 1; 
				});
				return valid && counters.tail().every(function(count) {
					return count <= 1;
				});
			});
		},
		guess : function() {
			var min = sudoku.unsolved().fold({value : 9, pos : -1}, function(result, pos) {
				if(sudoku.cells[pos].candidates.length < result.value) {
					result.value = sudoku.cells[pos].candidates.length;
					result.pos = pos;
				}
				return result;
			});
			this.guessStack.push({
				value : sudoku.cells[min.pos].candidates[0],
				pos : min.pos,
				snapshot : sudoku.cells.clone() 
			});
			console.log('guessed ' + sudoku.cells[min.pos].candidates[0] + ' for pos ' + min.pos);
			sudoku.put(min.pos, this.cells[min.pos].candidates[0]);
			return true;
		},
		backTrack : function() {
			if(this.guessStack.length == 0) {
				return false;
			}
			var obj = this.guessStack.pop();
			this.cells = obj.snapshot;
			this.cells[obj.pos].candidates.remove(obj.value);
			/*if(!sudoku.isValid()) {
				return false;
			}*/
			console.log('backtracked.. eliminating value ' + obj.value + ' from pos ' + obj.pos);
			this.domNodes.each(function(node, i) {
				node.innerHTML = sudoku.cells[i].value;
			});
			return true;
		},
		checkSolution : function() {
			var st;
			var ok = true;
			var checkSet = function(st) {
				return st.map(function(pos) {
					return sudoku.cells[pos].value;
				}).sort().equals(sudoku.numbers);
			};
			this.areas.each(function(i) {
				st = sudoku.rowArea(sudoku.rowStart(i));
				ok = ok && checkSet(st);
				if(!ok) {
					console.log('problem at row ' + i);
				}
				st = sudoku.colArea(sudoku.colStart(i));
				ok = ok && checkSet(st);
				if(!ok) {
					console.log('problem at col ' + i);
				}
				st = sudoku.boxArea(sudoku.boxStart(i));
				ok = ok && checkSet(st);
				if(!ok) {
					console.log('problem at box ' + i);
				}
			});
			console.log(this.exportPuzzle());
			return ok;
		},
		exportPuzzle : function() {
			return this.cells.fold('', function(acc, node) {
				return acc += node.value;
			});
		},
		consArray : function(n) {
			var ret = [];
			for(var i = 0; i < n; i += 1) {
				ret.push([]);
			}
			return ret;
		},
		//cells that have only one candidate
		nakedSingles : function() {
			var success = false;
			this.unsolved().filter(function(pos) {
				return sudoku.cells[pos].candidates.length == 1;
			}).each(function(pos) {
				success = true;
				sudoku.putAfter(pos, sudoku.cells[pos].candidates[0], 'naked single');
			});
			return success;
		},
		putAfter : function(pos, n, method) {
			this.put(pos, n);
			this.domNodes[pos].className += ' ' + 'red';
		},
		//one (out of nine) candidate appears in only one cell of an area but is hidden among other candidates
		hiddenSingles : function() {
			var success = false;
			var checkArea = function(area) {
				var nc = sudoku.candidatesCells(area);
				sudoku.numbers.each(function(n) {
					if(nc[n].length == 1) {
						success = true;
						sudoku.putAfter(nc[n][0], n, 'hidden single');
					}
				});
				return success;
			};
			return this.applyInAreas(checkArea);
		},
		//candidate cells of each number
		candidatesCells : function(area) {
			var nc = [[]]; //number candidates
			this.numbers.each(function(n) {
				nc[n] = [];
			});
			sudoku.unsolvedInArea(area).each(function(pos) {
				sudoku.cells[pos].candidates.each(function(c) {
					nc[c].push(pos);
				});
			});
			return nc;
		},
		peers : function(pos) {
			var ret = this.rowArea(pos).union(this.colArea(pos)).union(this.boxArea(pos));
			ret.remove(pos);
			return ret;
		},
		nakedSubsets : function() {
			var success = false;
			var checkArea = function(area) {
				var subArea = sudoku.unsolvedInArea(area);
				var counters = subArea.map(function(pos){
					return sudoku.cells[pos].candidates.length;
				});
				var hash = {};
				counters.each(function(count, i){
					if(!hash[count]) {
						hash[count] = [];
					}
					hash[count].push(subArea[i]);
				});
				var keys = [];
				for(var i in hash) {
					keys.push(i);
				}
				//hash :
					//key   : amount of candidates (int)
					//value : positions (array)
				keys.each(function(key) {
					if(hash[key].length > 1 && key <= hash[key].length) {
						for(var i = 0; i < hash[key].length - 1; i += 1) {
							var positions = [hash[key][i]];
							for(var j = i + 1; j < hash[key].length;) {
								if(sudoku.cells[hash[key][i]].candidates.equals(sudoku.cells[hash[key][j]].candidates)) {
									positions.push(hash[key][j]);
									hash[key].splice(j, 1);
								} else {
									j += 1;
								}
							}
							if(positions.length == sudoku.cells[positions[0]].candidates.length) {
								success = sudoku.removeFromArea(subArea.difference(positions), sudoku.cells[positions[0]].candidates) || success;
							}
						}
					}
				});
				return success;
			};
			return this.applyInAreas(checkArea);
		},
		//A Hidden Subset is formed when N digits have only candidates in N cells in a house.
		hiddenSubsets : function() {
			var success = false;
			var checkArea = function(area) {
				var unsolved = sudoku.unsolvedInArea(area);
				var checkSubArea = function(sa) {
					var saCandidates = sudoku.candidates(sa);
					var complementArea = unsolved.difference(sa);
					var complementCandidates = sudoku.candidates(complementArea);
					var uniqueCandidates = saCandidates.difference(complementCandidates);
					if(sa.length == uniqueCandidates.length) {
						return uniqueCandidates;
					} else {
						return;
					}
				};
				area.powerSet().each(function(st) {
					if(st.length > 1 && st.length < 5 && st.length < unsolved.length) {
						var res = checkSubArea(st);
						if(res) {
							//console.log(st);
							success = sudoku.removeFromArea(st, sudoku.numbers.difference(res)) || success;
						}
					}
				});
				return success;
			};
			return this.applyInAreas(checkArea);
		},
		init : function(data) {
			if(!isArray(data)) {
				var tmp = [];
				for(var i = 0; i < data.length; i += 1) {
					tmp[i] = parseInt(data.charAt(i));
				}
				data = tmp;
			}
			var index;
			for(index = 0; index < 81; index += 1) {
				this.cells[index] = this.makeNode(index);
			}
			this.root = this.makeNode(-1, []);
			this.theParent = this.root;
			this.rootDom = $("#sudoku").get(0)
			this.createDomTree();
			for(index = 0; index < data.length; index += 1) {
				if(data[index] != 0) {
					this.put(index, data[index]);
					this.domNodes[index].className += ' ' + 'magenta';
				}
			}
			this.areas.each(function(area) {
				sudoku.rowAreas[area] = [];
				sudoku.colAreas[area] = [];
				sudoku.boxAreas[area] = [];
			});
			index = 0;
			this.areas.each(function(area) {
				sudoku.rowAreas[area] = sudoku.rowArea(sudoku.rowStart(area));
				sudoku.houseAreas[index] = sudoku.rowAreas[area];
				index += 1;
				sudoku.colAreas[area] = sudoku.colArea(sudoku.colStart(area));
				sudoku.houseAreas[index] = sudoku.colAreas[area];
				index += 1;
				sudoku.boxAreas[area] = sudoku.boxArea(sudoku.boxStart(area));
				sudoku.houseAreas[index] = sudoku.boxAreas[area];
				index += 1;
			});
		},
		createDomTree : function() {
			var i,j, row, cell, rowJQ, cellJQ, title, index;
			index = 0;
			for(i = 0; i < 9; i += 1) {
				rowJQ = $('<div id="r' + i +'" class="row"></div>');
				row = rowJQ.get(0);
				if(i == 0 || i == 3 || i == 6) {
					rowJQ.addClass('thickTop');
				}
				this.rootDom.appendChild(row);
				for(j = 0; j < 9; j += 1) {
					title =  i + "-" + j;
					cellJQ = $('<span id="c' + title + '" class="button" unselectable="on" title="' + index + '">' + '' + '</span>');
					if(j == 0 || j == 3 || j == 6) {
						cellJQ.addClass('thickLeft');
					}
					cell = cellJQ.get(0);
					row.appendChild(cell);
					this.domNodes[index] = cell;
					index += 1;
				}
			}
		},
		makeNode : function(pos) {
			return {
				pos : pos,
				value : 0,
				children : [],
				candidates : range(1, 9),
				//why didn't i think of that earlier?
				rowIndex : sudoku.rowIndex(pos),
				colIndex : sudoku.colIndex(pos),
				boxIndex : sudoku.boxIndex(pos)
			};
		},
		
		unsolved : function() {
			return this.cells.filter(function(node) {
				return node.value == 0;
			}).map(function(node) {
				return node.pos;
			});
		},
		unsolvedInArea : function(area) {
			return area.filter(function(pos) {
				return sudoku.cells[pos].value == 0;
			});
		},
		candidates : function(area) {
			return this.unsolvedInArea(area).map(function(pos) {
				return sudoku.cells[pos].candidates;
			}).fold([], function(acc, arr) {
				return acc.concat(arr);
			}).clearDuplicates();
		},
		
		inRow : function(area) {
			var row = this.rowIndex(area[0]);
			return area.every(function(pos) {
				return sudoku.rowIndex(pos) == row;
			});
		},
		
		inCol : function(area) {
			var col = this.colIndex(area[0]);
			return area.every(function(pos) {
				return sudoku.colIndex(pos) == col;
			});
		},
		
		inBox : function(area) {
			var bi = this.boxIndex(area[0]);
			return area.every(function(pos) {
				return sudoku.boxIndex(pos) == bi;
			});
		},
		inAreaIndex : function(pos, areaIndex) {
			return this.areasIndices(pos).some(function(index) {
				return index == areaIndex;
			});
		},
		arePeers : function(area) {
			return sudoku.inRow(area) || sudoku.inCol(area) || sudoku.inBox(area);
		},
		boxIndex : function(pos) {
			var coords = this.to2d(pos);
			return Math.floor(coords[0] / 3) * 3 + Math.floor(coords[1] / 3);
		},
		rowIndex : function(pos) {
			return Math.floor(pos / 9)
		},
		colIndex : function(pos) {
			return pos % 9;
		},
		areasIndices : function(pos) {
			return [this.areaIndex(pos, 'row'), this.areaIndex(pos, 'col'), this.areaIndex(pos, 'box')];
		},
		areaIndex : function(pos, type) {
			if(type == 'row') {
				return this.rowIndex(pos);
			} else if(type == 'col') {
				return this.colIndex(pos) + 9;
			} else {
				return this.boxIndex(pos) + 18;
			}
		},
		// areas 0-8 rows, 9-17 columns, 18-26 boxes
		commonAreas : function(positions) {
			var areaIndices = [];
			if(this.rowIndex(positions[0]) == this.rowIndex(positions[1])) {
				areaIndices.push(this.areaIndex(positions[0], 'row'));
			} 
			if(this.colIndex(positions[0]) == this.colIndex(positions[1])) {
				areaIndices.push(this.areaIndex(positions[0], 'col'));
			}
			if(this.boxIndex(positions[0]) == this.boxIndex(positions[1])) {
				areaIndices.push(this.areaIndex(positions[0], 'box'));
			}
			return areaIndices;
		},
		
		//box - row - column interactions
		//1)Sometimes a candidate within a box is restricted to one row or column.
		//	Since one of these cells must contain that specific candidate, the candidate can safely be excluded from the remaining cells in that row or column
		//	outside of the box
		//2)Sometimes a candidate within a row or column is restricted to one box. Since one of these cells must contain that specific candidate, the
		//candidate can safely be excluded from the remaining cells in the box
		lockedCandidates : function() {
			var success = false;
			var checkArea = function(area) {
				//debugger;
				var cat = sudoku.areaCat(area);
				sudoku.candidates(area).each(function(value) {
					var removeArea = [];
					var subArea = area.filter(function(pos) {
						return sudoku.cells[pos].value == 0 && sudoku.cells[pos].candidates.has(value);
					});
					if(subArea.length > 1) {
						if(cat == 'box') {
							if(sudoku.inRow(subArea)) {
								removeArea = sudoku.rowArea(subArea[0]);
							}
							if(sudoku.inCol(subArea)) {
								removeArea = sudoku.colArea(subArea[0]);
							}
						} else if(sudoku.inBox(subArea)) {
							removeArea = sudoku.boxArea(subArea[0]);
						}
						//could also be sudoku.unsolvedInArea(removeArea.difference(row|col|box))
						success = sudoku.removeFromArea(sudoku.unsolvedInArea(removeArea.difference(subArea)), value) || success;
					}
				});
				return success;
			};
			return this.applyInAreas(checkArea);
			
		},
		//When a candidate is possible in a certain set of cells that form the intersection of a set of n rows and n columns, but are not possible elsewhere in that same set of rows, then they are also not possible elsewhere in that same set of columns.	
		//Same for columns but not necessary to check
		gridAnalysis : function() {
			var success = false;
			var cs = this.candidatesCells(this.gridArea);
			var crows = cs.map(function(positions) {
				return positions.map(function(pos) {
					return sudoku.rowIndex(pos);
				}).clearDuplicates();
			});
			var limits = cs.map(function(positions) {
				return positions.map(function(pos) {
					return sudoku.colIndex(pos);
				}).clearDuplicates().length;
			});
			this.numbers.each(function(n) {
				var sets = crows[n].powerSet().filter(function(st) {
					return st.length > 1 && st.length <= limits[n] && st.length < 5;
				});
				sets.each(function(st) {
					//σε ποιες κάθετες ανήκουν οι υποψήφιοι του συνόλου
					var cols = st.fold([], function(acc, row) {
						return acc.union(cs[n].filter(function(pos){
								return sudoku.rowIndex(pos) == row;
							}).map(function(pos) {
								return sudoku.colIndex(pos);
							}));
					})
					if(cols.length == st.length) {
						cols.each(function(col) {
							var subArea = st.fold([], function(acc, row) {
								acc.push(sudoku.to1d([row, col]));
								return acc;
							});
							var succ = sudoku.removeFromArea(sudoku.unsolvedInArea(sudoku.colArea(col).difference(subArea)), n);
							success = succ || success;
							if(succ) {
								var name = st.length == 2 ? 'x-wing' : st.length == 3 ? 'swordfish' : st.length == 4 ? 'jellyfish' : 'squirmbag';
								console.log(name + ' in rows ' + st +' , found candidate ' + n + ' to be in columns ' + cols + ' so it was removed from ' + sudoku.unsolvedInArea(sudoku.colArea(col).difference(subArea)));
							}
						});
					}
				});
			});
			return success;
		},
		color : function() {
			var success = false;
			var cs = this.candidatesCells(this.gridArea);
			var houses = [];
			this.numbers.each(function(number) {
				houses[number] = sudoku.consArray(27);
			});
			
			cs.each(function(positions, number) {
				positions.each(function(pos) {
					houses[number][sudoku.areaIndex(pos, 'row')].push(pos);
					houses[number][sudoku.areaIndex(pos, 'col')].push(pos);
					houses[number][sudoku.areaIndex(pos, 'box')].push(pos);
				});
			});
			var paired = sudoku.consArray(10);
			var ignoreList = sudoku.consArray(10);
			this.numbers.each(function(number) {
				houses[number].each(function(positions, areaIndex) {
					if(positions.length > 2) {
						if(!ignoreList[number]) {
							ignoreList[number] = [];
						}
						ignoreList[number].push(areaIndex);
					} else if(positions.length == 2) {
						if(!paired[number]) {
							paired[number] = [];
						}
						paired[number].push(positions[0]);
						paired[number].push(positions[1]);
					}
				});
			});
			paired.each(function(positions) {
				positions.clearDuplicates();
			});
			var pairs = sudoku.consArray(10);
			var pairNodes = [];
			this.numbers.each(function(number) {
				pairs[number] = paired[number].combinations(2).filter(function(comb) {
					if(sudoku.arePeers(comb) && !sudoku.commonAreas(comb).every(function(areaIndex) {return ignoreList[number].has(areaIndex);})) {
						return true
					} else {
						return false;
					}
				});
			});
			function makePairNode(position) {
				return {
					position : position,
					pairedWith : [],
					parity : 0
				}
			};
			this.numbers.each(function(number) {
				pairNodes[number] = pairs[number].fold({}, function(hash, pair) {
					if(!hash[pair[0]]) {
						hash[pair[0]] = makePairNode(pair[0]);
					} 
					if(!hash[pair[1]]) {
						hash[pair[1]] = makePairNode(pair[1]);
					} 
					hash[pair[0]].pairedWith.push(pair[1]);
					hash[pair[1]].pairedWith.push(pair[0]);
					return hash;
				});
			});
			var clusters = sudoku.consArray(10);
			this.numbers.each(function(number) {
				clusters[number].push(pairs[number].head());
				pairs[number].tail().each(function(pair) {
					var found = [];
					clusters[number].each(function(cluster, index) {
						if(cluster.has(pair[0]) || cluster.has(pair[1])) {
							found.push(index);
						}
					});
					if(found.length == 0) {
						clusters[number].push(pair);
					} else if(found.length == 1) {
						clusters[number][found[0]] = clusters[number][found[0]].union(pair);
					} else if(found.length == 2) {
						clusters[number][found[0]] = clusters[number][found[0]].union(clusters[number][found[1]]);
						clusters[number].splice(found[1], 1);
					} else {
						alert('bug');
					}
				});
			});
			var colorCluster = function(cluster, number) {
				var nodes = pairNodes[number];
				var colorPos = function(pos, parity) {
					var parityCells = [[], []];
					var index = parity == -1 ? 0 : 1;
					var result = [];
					if(nodes[pos].parity == 0) {
						nodes[pos].parity = parity;
						parityCells[index].push(pos);
						nodes[pos].pairedWith.each(function(pairPos) {
							result = colorPos(pairPos, -parity);
							parityCells[0] = parityCells[0].concat(result[0]);
							parityCells[1] = parityCells[1].concat(result[1]);
						});
					}
					return parityCells;
				};
				
				var parityCells = colorPos(cluster[0], 1);

				var parityAreas =  parityCells.fold([[], []], function(areas, positions) {
					positions.each(function(pos) {
						var index = nodes[pos].parity == 1 ? 1 : 0;
						areas[index].push(sudoku.areaIndex(pos, 'row'));
						areas[index].push(sudoku.areaIndex(pos, 'col'));
						areas[index].push(sudoku.areaIndex(pos, 'box'));
					});
					return areas;
				});
				//color trap
				var other = cs[number].difference(cluster).filter(function(pos) {
					var areas = [sudoku.areaIndex(pos, 'row'), sudoku.areaIndex(pos, 'col'), sudoku.areaIndex(pos, 'box')];
					return parityAreas[0].intersection(areas).length > 0 && parityAreas[1].intersection(areas).length > 0;
				});
				if(other.length > 0) {
					success = sudoku.removeFromArea(other, number) || success;
				}
				//color wrap
				parityAreas.each(function(areas, index) {
					areas.each(function(areaIndex) {
						var cells = parityCells[index].filter(function(pos) {
							return sudoku.areasIndices(pos).some(function(ai) {
								return ai == areaIndex;
							});
						}); 
						if(cells.length > 1) {
							success = sudoku.removeFromArea(parityCells[index], number) || success;
						}
					});
				});
			};
			this.numbers.each(function(number) {
				clusters[number].filter(function(cluster) {
					return cluster.length > 2;
				}).each(function(cluster) {
					colorCluster(cluster, number);
				});
				
				//color wing - xcycles
				if(pairs[number].length > 1) {
					var peerPairs = pairs[number].combinations(2).filter(function(comb) {
						return sudoku.getPairPeers(comb).length > 0;
					});
					//console.log(peerPairs);
					peerPairs.each(function(pairs) {
						var peers = sudoku.getPairPeers(pairs);
						var others = peers.map(function(peer) {
							return Math.abs(peer - 1);
						});
						var positions = [pairs[0][others[0]], pairs[1][others[1]]];
						success = sudoku.removeFromArea(cs[number].difference([pairs[0][0], pairs[0][1], pairs[1][0], pairs[1][1]]).filter(function(pos) {
							return sudoku.arePeers([pos, positions[0]]) && sudoku.arePeers([pos, positions[1]]);
						}), number) || success;
					});
				}
			});
			return success;
		},
		getPairPeers : function(pairs) {
			var d = [[0,0], [0,1], [1,0], [1,1]];
			var i = d.firstIndexOf(function(indices) {
				return pairs[0].intersection(pairs[1]).length == 0 && sudoku.arePeers([pairs[0][indices[0]], pairs[1][indices[1]]]);
			});
			if(i != -1) {
				return d[i];
			} else {
				return [];
			}
		},
		applyInAreas : function(method) {
			var success = false;
			sudoku.areas.each(function(index) {
				success = method(sudoku.boxArea(sudoku.boxStart(index))) || success;
				success = method(sudoku.rowArea(sudoku.rowStart(index))) || success;
				success = method(sudoku.colArea(sudoku.colStart(index))) || success;
			});
			return success;
		},
		areaCat : function(area) {
			if(area[1] == area[0] + 9) {
				return 'column';
			} else if(area[0] == area[area.length - 1] - 8) {
				return 'row';
			} else {
				return 'box';
			}
		},
		to1d : function(coords) {
			return coords[0] * 9 + coords[1];
		},
		
		to2d : function(index) {
			return [Math.floor(index / 9), index % 9];
		},
		boxStart : function(boxIndex) {
			return [0, 3, 6, 27, 30, 33, 54, 58, 60][boxIndex];
		},
		rowStart : function(rowIndex) {
			return rowIndex * 9;
		},
		colStart : function(colIndex) {
			return colIndex;
		},
		boxArea : function(pos) {
			var i, j;
			var coords = this.to2d(pos);
			var sr = Math.floor(coords[0] / 3) * 3;
			var sc = Math.floor(coords[1] / 3) * 3;
			var start = this.to1d([sr, sc]);
			var ret = [];
			for(i = 0; i < 3; i += 1) {
				for(j = 0; j < 3; j += 1) {
					ret.push(start + (i * 9) + j);
				}
			}
			return ret;
		},
		
		rowArea : function(pos) {
			var start = Math.floor(pos / 9) * 9;
			var ret = [];
			for(var j = 0; j < 9; j += 1) {
				ret.push(start + j);
			}
			return ret;
		},
		
		colArea : function(pos) {
			var start = pos % 9;
			var ret = [];
			for(var i = 0; i < 9; i += 1) {
				ret.push(start + i * 9);
			}
			return ret;
		},
		put2d : function(r, c, n) {
			if(isArray(r)) {
				for(var i = 0; i < r.length; i += 1) {
					this.put2d(r[i][0], r[i][1], r[i][2]);
				}
			} else {
				this.put(this.to1d([r, c]), n);
			}
		},
		put : function(pos, n) {
			var pos, node;
			//this.theParent.addChild(this.cells[pos]);
			node = this.cells[pos];
			node.candidates = [n];
			node.value = n;
			
			this.removeFromRow(pos, n);
			this.removeFromCol(pos, n);
			this.removeFromBox(pos, n);
			this.domNodes[pos].innerHTML = n;
		},
		removeFromArea : function(area, values) {
			var i, j;
			var ret = false;
			for(i = 0; i < area.length; i += 1) {
				if(this.cells[area[i]].value == 0) {
					ret = this.cells[area[i]].candidates.remove(values) || ret;
				}
			}
			return ret;
		},
		
		removeFromRow : function(pos, values, includePos) {
			var area = this.rowArea(pos);
			if(!includePos) {
				area.remove(pos);
			}
			return this.removeFromArea(area, values);
		},
		
		removeFromCol : function(pos, values, includePos) {
			var area = this.colArea(pos);
			if(!includePos) {
				area.remove(pos);
			}
			return this.removeFromArea(area, values);
		},
		
		removeFromBox : function(pos, values, includePos) {
			var area = this.boxArea(pos);
			if(!includePos) {
				area.remove(pos);
			}
			return this.removeFromArea(area, values);
		},
	};
	ns.sudoku = sudoku;
})(window);
