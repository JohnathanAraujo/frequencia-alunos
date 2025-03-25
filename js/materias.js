document.addEventListener('DOMContentLoaded', () => {
    carregarMaterias();
    document.getElementById('formMateria').addEventListener('submit', salvarMateria);
});

function salvarMateria(event) {
    event.preventDefault();

    let nomeMateria = document.getElementById('nomeMateria').value;
    let totalAulas = document.getElementById('totalAulas').value;

    let materias = JSON.parse(localStorage.getItem('materias')) || [];
    materias.push({ nomeMateria, totalAulas });
    localStorage.setItem('materias', JSON.stringify(materias));

    document.getElementById('formMateria').reset();
    carregarMaterias();
}

function carregarMaterias() {
    let lista = document.getElementById('listaMaterias');
    let materias = JSON.parse(localStorage.getItem('materias')) || [];

    lista.innerHTML = '';
    materias.forEach((m) => {
        let item = document.createElement('li');
        item.className = "list-group-item";
        item.textContent = `${m.nomeMateria} - ${m.totalAulas} aulas`;
        lista.appendChild(item);
    });
}
