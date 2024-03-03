const shareButton = document.getElementById('share-modal');
let sharePopup = null;

shareButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!sharePopup) {
        sharePopup = document.createElement('div');
        sharePopup.id = 'sharePopup';
        sharePopup.innerHTML = `
    <div class="share">
        <ul class="share__list">
            <li class="share__item">
                <a href="#" class="share__link">
                    <svg class="share__icon">
                        <use xlink:href="#facebook"></use>
                    </svg>
                </a>
            </li>
            <li class="share__item">
                <a href="#" class="share__link">
                    <svg class="share__icon">
                        <use xlink:href="#twitter"></use>
                    </svg>
                </a>
            </li>
            <li class="share__item">
                <a href="#" class="share__link">
                    <svg class="share__icon">
                        <use xlink:href="#instagram"></use>
                    </svg>
                </a>
            </li>
            <li class="share__item">
                <a href="#" class="share__link">
                    <svg class="share__icon">
                        <use xlink:href="#google"></use>
                    </svg>
                </a>
            </li>
        </ul>
    </div>
`;
        document.body.appendChild(sharePopup);

        window.addEventListener('click', outsideClickHandler);
    } else {
        sharePopup.remove();
        sharePopup = null;
        window.removeEventListener('click', outsideClickHandler);
    }
});

function outsideClickHandler(event) {
    if (sharePopup && event.target !== sharePopup && event.target !== shareButton) {
        sharePopup.remove();
        sharePopup = null;
        window.removeEventListener('click', outsideClickHandler);
    }
}










