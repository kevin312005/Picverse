const artworkCards = document.querySelectorAll('.artwork-card');
        const modal = document.getElementById('artworkModal');
        const closeBtn = document.querySelector('.close-btn');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalArtist = document.getElementById('modalArtist');

        artworkCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const title = card.querySelector('h3').textContent;
                const artist = card.querySelector('p').textContent;

                modalImage.src = img.src;
                modalTitle.textContent = title;
                modalArtist.textContent = artist;
                modal.style.display = 'flex';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });