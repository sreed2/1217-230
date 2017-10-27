
// The combat phase with all the math and calculation behind the scene
async function combat() {
	setData(STOREKEY.PHASE, CONSTANT.PHASE.COMBAT);

	info('combat!', 1800)

	npcRevealEquipment();

	await wait(2000);

	npcRevealStats();

	await wait(2000);

	const playerStatus = getStatus(player);
	const npcStatus = getStatus(npc);

	// console.log(JSON.stringify(playerStatus));
	// console.log(JSON.stringify(npcStatus));

	await etherCancellation(playerStatus.score, npcStatus.score);

	await etherNullification(playerStatus, npcStatus);

	await elementNullification(playerStatus, npcStatus);

	// console.log(playerStatus);
	// console.log(npcStatus);

	const playerFinalScore = getTotalPoint(player);
	const npcFinalScore = getTotalPoint(npc);

	// console.log(playerFinalScore);
	// console.log(npcFinalScore);

	let nextTurn;

	if (playerFinalScore === npcFinalScore) {
		nextTurn = CONSTANT.TURN.PLAYER;
		info('DRAW!', 1800)
	}
	else if (playerFinalScore > npcFinalScore) {
		nextTurn = CONSTANT.TURN.PLAYER;
		info('YOU WON!', 1800)
		checkAndIncrement(STOREKEY.PLAYER_ROUND);
	}
	else {
		nextTurn = CONSTANT.TURN.NPC;
		info('I WON!', 1800)
		checkAndIncrement(STOREKEY.NPC_ROUND);
	}

	await wait(9000);
	cleanUpEquip();

	npcHideEquipment();
	npcHideStats();

	newRound(nextTurn);
}

// go through all score card and return the total point
function getTotalPoint(playingSide) {
	const pointEl = playingSide.point;

	return CONSTANT.ELEMENTS.reduce((p, element) => {
		if (element === CONSTANT.ELEMENT.ETHER) {
			return p;
		} else {
			return p + parseInt(pointEl[element].innerHTML);
		}
	}, 0)
}

// Deduct point from an element
async function deductPoint(playingSide, element, point){
	const pointEl = playingSide.point[element];

	let currentPoint = parseInt(pointEl.innerHTML);

	const originalColor = pointEl.style.color;

	pointEl.style.color = 'red';

	const targetPoint = currentPoint - point;

	while (currentPoint > targetPoint) {
		pointEl.innerHTML = --currentPoint;
		await wait(100);
	}

	pointEl.style.color = originalColor;
}

// Cleanup equipment card
function cleanUpEquip() {
	removeAllChild(player.equip);
	removeAllChild(npc.equip);
}

// Return the score of a playing side
function getStatus(playingSide) {
	const score = Object.assign({}, CONSTANT.ELEMENT_SCORE)

	let maxScore = -1;
	let maxElement = null;

	Array.from(playingSide.equip.children).map(child => {
		const {element, point} = child.card;

		score[element] += point;

		if (element !== CONSTANT.ELEMENT.ETHER && score[element] > maxScore) {
			maxElement = element;
			maxScore = score[element];
		}
	})

	return {
		score, maxElement
	}
}

// Cancel ether point
async function etherCancellation(playerScore, npcScore) {
	const minEther = Math.min(playerScore.ETHER, npcScore.ETHER);
	playerScore.ETHER -= minEther;
	npcScore.ETHER -= minEther;
}

// Subtract ether from max of opposing
async function etherNullification(playerStatus, npcStatus) {
	if (playerStatus.maxElement) {
		playerStatus.score[playerStatus.maxElement] -= npcStatus.score.ETHER;
		await deductPoint(player, playerStatus.maxElement, npcStatus.score.ETHER)
	}

	if (npcStatus.maxElement) {
		npcStatus.score[npcStatus.maxElement] -= playerStatus.score.ETHER;
		await deductPoint(npc, npcStatus.maxElement, playerStatus.score.ETHER)
	}
}


// Cancel Elemental point
async function elementNullification(playerStatus, npcStatus) {

	const playerOriginalStatus = Object.assign({}, playerStatus);
	const npcOriginalStatus = Object.assign({}, npcStatus);

	await Promise.all(CONSTANT.ELEMENTS.map(async (element) => {
		if (element === CONSTANT.ELEMENT.ETHER) {
			return;
		}
		const nullifyElement = CONSTANT.ELEMENT_NULLIFICATION[element];

		const playerDeduction = playerStatus.score[nullifyElement] > npcOriginalStatus.score[element]
			? npcOriginalStatus.score[element]
			: playerStatus.score[nullifyElement];

		playerStatus.score[nullifyElement] -= playerDeduction;

		if (playerDeduction) {
			await deductPoint(player, nullifyElement, playerDeduction);
		}

		const npcDeduction = npcStatus.score[nullifyElement] > playerOriginalStatus.score[element]
			? playerOriginalStatus.score[element]
			: npcStatus.score[nullifyElement];

		npcStatus.score[nullifyElement] -= npcDeduction;

		if (npcDeduction) {
			await deductPoint(npc, nullifyElement, npcDeduction);
		}
	}))
}
