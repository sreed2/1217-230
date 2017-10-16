class Card {
	constructor(name) {
		this.name = name;
	}
}

function CreateCard(clickCallback) {
	const cardEl = CreateElementWithClass('div', 'Card');

	const cardFaceEl = CreateElementWithClass('div', 'CardFace')

	cardEl.addEventListener('click', clickCallback);

	cardFaceEl.addEventListener('click', clickCallback);

	cardEl.appendChild(cardFaceEl);

	return cardEl;
}
