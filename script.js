const speedElement = document.getElementById('speed');
    const errorElement = document.getElementById('error');
    const speedometerElement = document.getElementById('speedometer');
    const loadingElement = document.getElementById('loading');
    const installAppButton = document.getElementById('installApp');

    let deferredPrompt;

   // Simulate loading before GPS starts
setTimeout(() => {
  loadingElement.style.display = 'none';
  speedometerElement.style.display = 'flex';

  // Tambahkan kelas animasi fade-in
  speedometerElement.classList.add('fade-in');
  document.querySelector('footer').style.display = 'block';
}, 3000); // Loading for 3 seconds


    // Handle GPS Speedometer functionality
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const speed = position.coords.speed; // Kecepatan dalam m/s

          if (speed !== null) {
            const speedKmh = (speed * 3.6).toFixed(1); // Konversi ke km/h
            speedElement.textContent = speedKmh;
            errorElement.textContent = '';

            // Update speedometer
            const maxSpeed = 200; // Batas maksimum kecepatan
            const angle = Math.min((speedKmh / maxSpeed) * 360, 360);
            speedometerElement.style.setProperty('--angle', `${angle}deg`);
          } else {
            speedElement.textContent = '0';
            errorElement.textContent = 'Kecepatan tidak tersedia.';
          }
        },
        (error) => {
          errorElement.textContent = `Error: ${error.message}`;
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      errorElement.textContent = 'Geolocation tidak didukung oleh browser ini.';
    }

    // Handle PWA Install
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installAppButton.style.display = 'inline';
    });

    installAppButton.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      installAppButton.style.display = 'none';
    });