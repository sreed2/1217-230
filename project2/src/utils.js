// Helper method to create an element with specified class
function CreateElementWithClass(type, classname) {
	const el = document.createElement(type);
	el.setAttribute("class", classname);
	return el;
}

// Helper method to create an element with specified class
function CreateElementWithId(type, id) {
	const el = document.createElement(type);
	el.setAttribute("id", id);
	return el;
}

// Utility to set the equipment limit label
function SetEquipLimit(playingSide, limit) {
	const equipmentLabelEl = playingSide.side.querySelector('.EquipmentLabel h2');

	equipmentLabelEl.innerHTML += limit;
}

// Utility method to get the playing side elements from the DOM
function GetPlayingSide(sideId) {
	const side = document.querySelector(sideId);

	const hand = side.querySelector('.Hand');

	const equip = side.querySelector('.Equipment');

	const stats = side.querySelector('.Stats');

	stats.innerHTML = DefaultStatsStructure();

	const point = {}

	CONSTANT.ELEMENTS.map((el) => {
		const query = CONSTANT.ELEMENT_POINT_QUERY[el];
		if (query) {
			point[el] = stats.querySelector(query);

			point[el].innerHTML = '0';
		}
	})

	const avatar = stats.querySelector('.Avatar');

	return {
		side,
		hand,
		equip,
		stats,
		point,
		avatar
	};
}

function IsPreparePhase() {
	return GetData(STOREKEY.PHASE) === CONSTANT.PHASE.PREPARE;
}

function IsCombatPhase() {
	return GetData(STOREKEY.PHASE) === CONSTANT.PHASE.COMBAT;
}

// Return true if it is Player's turn
function IsPlayerTurn() {
	const currentTurn = GetData(STOREKEY.TURN);

	return currentTurn === CONSTANT.TURN.PLAYER;
}

// Return true if it is NPC's turn
function IsNPCTurn() {
	return !IsPlayerTurn();
}

// Get an integer between 0 and max-1
function GetRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// Get a random element in an array
function GetRandomInArray(array) {
	return array[GetRandomInt(array.length)]
}

// Remove all child of an element
function RemoveAllChild(el) {
	while(el.firstChild) {
		el.removeChild(el.firstChild);
	}
}

// Return a giphy url to search the query with the limit
function GetGiphyURL(query, limit) {
	const {
		URL,
		API_KEY
	} = CONSTANT.GIPHY;
	return URL +
		"api_key=" + API_KEY +
		"&q=" + query +
		"&limit=" + limit;
}

// Return a promise as to how long one should wait
function Wait(duration) {
	return new Promise(function (resolve) {
		setTimeout(function () {
			resolve();
		}, duration);
	});
}

function DefaultStatsStructure() {
	return `
		<div class="Fire Point">
			<div class="Number"></div>
			<label> <span class="oi" data-glyph="fire"></span> Fire</label>
		</div>
		<div class="Water Point">

			<div class="Number"></div>
			<label> <span class="oi" data-glyph="droplet"></span> Water</label>
		</div>
		<div class="Avatar FlexCenter"></div>
		<div class="Earth Point">

			<div class="Number"></div>
			<label><span class="oi" data-glyph="map-marker"></span> Earth</label>
		</div>
		<div class="Aero Point">

			<div class="Number"></div>
			<label><span class="oi" data-glyph="lightbulb"></span>Aero</label>
		</div>
	`
}
