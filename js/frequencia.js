document.addEventListener('DOMContentLoaded', carregarFrequencia);

function carregarFrequencia() {
    let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    let tabela = document.getElementById('tabelaFrequencia');

    tabela.innerHTML = '';
    alunos.forEach((a, index) => {
        let row = `<tr>
            <td>${a.nome}</td>
            <td>${a.rgm}</td>
            <td>${a.materia}</td>
            <td>${a.presencas}</td>
            <td>${a.faltas}</td>
            <td>
                <button class="btn btn-success" onclick="registrarPresenca(${index})">✓</button>
                <button class="btn btn-danger" onclick="registrarFalta(${index})">✗</button>
            </td>
        </tr>`;
        tabela.innerHTML += row;
    });
}

function registrarPresenca(index) {
    let alunos = JSON.parse(localStorage.getItem('alunos'));
    alunos[index].presencas++;
    localStorage.setItem('alunos', JSON.stringify(alunos));
    carregarFrequencia();
}

function registrarFalta(index) {
    let alunos = JSON.parse(localStorage.getItem('alunos'));
    alunos[index].faltas++;
    localStorage.setItem('alunos', JSON.stringify(alunos));
    carregarFrequencia();
}
