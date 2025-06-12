// Lista de países y zonas horarias principales
const countries = [
    { name: "España", timezone: "Europe/Madrid" },
    { name: "México", timezone: "America/Mexico_City" },
    { name: "Argentina", timezone: "America/Argentina/Buenos_Aires" },
    { name: "Estados Unidos (Nueva York)", timezone: "America/New_York" },
    { name: "Estados Unidos (Los Ángeles)", timezone: "America/Los_Angeles" },
    { name: "Japón", timezone: "Asia/Tokyo" },
    { name: "Australia", timezone: "Australia/Sydney" },
    { name: "Reino Unido", timezone: "Europe/London" },
    { name: "Brasil", timezone: "America/Sao_Paulo" },
    { name: "India", timezone: "Asia/Kolkata" }
];

const countrySelect = document.getElementById('country');
const clockDiv = document.getElementById('clock');

// Rellenar el select con los países
countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.timezone;
    option.textContent = country.name;
    countrySelect.appendChild(option);
});

// Agregar selectores para la hora base (España) y el país destino
const baseTimeLabel = document.createElement('label');
baseTimeLabel.textContent = 'Elige hora en España:';
baseTimeLabel.setAttribute('for', 'baseTime');
const baseTimeInput = document.createElement('input');
baseTimeInput.type = 'time';
baseTimeInput.id = 'baseTime';
baseTimeInput.value = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

const baseContainer = document.querySelector('.container');
baseContainer.insertBefore(baseTimeLabel, countrySelect);
baseContainer.insertBefore(baseTimeInput, countrySelect);

// Cambiar el label del select
const countryLabel = document.querySelector('label[for="country"]');
countryLabel.textContent = 'Selecciona país destino:';

function getDateInMadridWithTime(hour, minute) {
    // Obtener la fecha actual en Madrid
    const now = new Date();
    // Obtener la diferencia horaria de Madrid respecto a UTC
    const madridDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
    madridDate.setHours(hour, minute, 0, 0);
    return madridDate;
}

function updateClock() {
    const timezone = countrySelect.value;
    const [baseHour, baseMinute] = baseTimeInput.value.split(":").map(Number);
    // Crear fecha base en Madrid con la hora elegida
    const now = new Date();
    // Obtener la fecha actual en Madrid
    const madridNow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
    madridNow.setHours(baseHour, baseMinute, 0, 0);
    // Obtener la hora UTC equivalente a la hora base en Madrid
    const utcYear = madridNow.getUTCFullYear();
    const utcMonth = madridNow.getUTCMonth();
    const utcDay = madridNow.getUTCDate();
    const utcHour = madridNow.getUTCHours();
    const utcMinute = madridNow.getUTCMinutes();
    const utcSecond = madridNow.getUTCSeconds();
    const utcDate = new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHour, utcMinute, utcSecond));
    // Mostrar la hora en el país destino
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timezone
    };
    clockDiv.textContent = utcDate.toLocaleTimeString('es-ES', options);
}

countrySelect.addEventListener('change', updateClock);
baseTimeInput.addEventListener('input', updateClock);

// Inicializar con el primer país
countrySelect.selectedIndex = 0;
updateClock();
setInterval(updateClock, 1000);

// Formulario para añadir países
const addForm = document.createElement('form');
addForm.id = 'addCountryForm';
addForm.innerHTML = `
  <h2>Añadir país</h2>
  <input type="text" id="newCountryName" placeholder="Nombre del país" required style="margin-bottom:0.5em;">
  <input type="text" id="newCountryTimezone" placeholder="Zona horaria (ej: Europe/Paris)" required style="margin-bottom:0.5em;">
  <button type="submit">Añadir</button>
`;
baseContainer.appendChild(addForm);

addForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('newCountryName').value.trim();
    const timezone = document.getElementById('newCountryTimezone').value.trim();
    if (!name || !timezone) return;
    // Añadir al array y al select
    countries.push({ name, timezone });
    const option = document.createElement('option');
    option.value = timezone;
    option.textContent = name;
    countrySelect.appendChild(option);
    // Limpiar campos y seleccionar el nuevo país
    document.getElementById('newCountryName').value = '';
    document.getElementById('newCountryTimezone').value = '';
    countrySelect.value = timezone;
    updateClock();
});

// Enlace a ayuda de zonas horarias
const helpLink = document.createElement('a');
helpLink.href = 'zonas-horarias.html';
helpLink.target = '_blank';
helpLink.textContent = '¿No sabes qué zona horaria poner? Consulta ejemplos y la lista completa aquí.';
helpLink.style.marginTop = '0.5em';
baseContainer.appendChild(helpLink);

if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('service-worker.js');
        });
    }
