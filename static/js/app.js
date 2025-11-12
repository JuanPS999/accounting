// Global variables
let gastosChart = null;
let despesasChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set default dates (last 30 days)
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);
    
    document.getElementById('filterDataInicio').valueAsDate = trintaDiasAtras;
    document.getElementById('filterDataFim').valueAsDate = hoje;
    
    // Set default dates in forms
    document.getElementById('gastoData').valueAsDate = hoje;
    document.getElementById('despesaData').valueAsDate = hoje;
    
    // Load initial data
    loadGastos();
    loadDespesas();
    loadResumo();
});

// ==================== TAB FUNCTIONS ====================

function openTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Deactivate all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    // Load data for reports tab
    if (tabName === 'relatorios') {
        loadRelatorios();
    }
}

// ==================== FILTER FUNCTIONS ====================

function aplicarFiltros() {
    loadGastos();
    loadDespesas();
    loadResumo();
}

function limparFiltros() {
    document.getElementById('filterDataInicio').value = '';
    document.getElementById('filterDataFim').value = '';
    document.getElementById('filterCategoria').value = '';
    aplicarFiltros();
}

function getFilterParams() {
    const params = new URLSearchParams();
    const dataInicio = document.getElementById('filterDataInicio').value;
    const dataFim = document.getElementById('filterDataFim').value;
    const categoria = document.getElementById('filterCategoria').value;
    
    if (dataInicio) params.append('data_inicio', dataInicio);
    if (dataFim) params.append('data_fim', dataFim);
    if (categoria) params.append('categoria', categoria);
    
    return params.toString();
}

// ==================== GASTOS FUNCTIONS ====================

async function loadGastos() {
    try {
        const params = getFilterParams();
        const response = await fetch(`/api/gastos?${params}`);
        const gastos = await response.json();
        
        const tbody = document.getElementById('gastosTableBody');
        
        if (gastos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">Nenhum gasto registrado</td></tr>';
        } else {
            tbody.innerHTML = gastos.map(gasto => `
                <tr>
                    <td>${formatDate(gasto.data)}</td>
                    <td>${gasto.categoria}</td>
                    <td>${gasto.descricao}</td>
                    <td>R$ ${formatCurrency(gasto.valor)}</td>
                    <td class="action-buttons">
                        <button onclick="editGasto(${gasto.id})" class="btn btn-warning">Editar</button>
                        <button onclick="deleteGasto(${gasto.id})" class="btn btn-danger">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading gastos:', error);
        alert('Erro ao carregar gastos');
    }
}

function showGastoForm() {
    document.getElementById('gastoFormContainer').style.display = 'block';
    document.getElementById('gastoFormTitle').textContent = 'Adicionar Gasto';
    document.getElementById('gastoForm').reset();
    document.getElementById('gastoId').value = '';
    document.getElementById('gastoData').valueAsDate = new Date();
}

function hideGastoForm() {
    document.getElementById('gastoFormContainer').style.display = 'none';
    document.getElementById('gastoForm').reset();
}

async function submitGasto(event) {
    event.preventDefault();
    
    const id = document.getElementById('gastoId').value;
    const data = {
        data: document.getElementById('gastoData').value,
        categoria: document.getElementById('gastoCategoria').value,
        descricao: document.getElementById('gastoDescricao').value,
        valor: parseFloat(document.getElementById('gastoValor').value)
    };
    
    try {
        const url = id ? `/api/gastos/${id}` : '/api/gastos';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            hideGastoForm();
            loadGastos();
            loadResumo();
            alert(id ? 'Gasto atualizado com sucesso!' : 'Gasto adicionado com sucesso!');
        } else {
            const error = await response.json();
            alert('Erro: ' + error.error);
        }
    } catch (error) {
        console.error('Error submitting gasto:', error);
        alert('Erro ao salvar gasto');
    }
}

async function editGasto(id) {
    try {
        const params = getFilterParams();
        const response = await fetch(`/api/gastos?${params}`);
        const gastos = await response.json();
        const gasto = gastos.find(g => g.id === id);
        
        if (gasto) {
            document.getElementById('gastoId').value = gasto.id;
            document.getElementById('gastoData').value = gasto.data;
            document.getElementById('gastoCategoria').value = gasto.categoria;
            document.getElementById('gastoDescricao').value = gasto.descricao;
            document.getElementById('gastoValor').value = gasto.valor;
            document.getElementById('gastoFormTitle').textContent = 'Editar Gasto';
            document.getElementById('gastoFormContainer').style.display = 'block';
        }
    } catch (error) {
        console.error('Error editing gasto:', error);
        alert('Erro ao carregar gasto para edição');
    }
}

async function deleteGasto(id) {
    if (!confirm('Tem certeza que deseja excluir este gasto?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/gastos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadGastos();
            loadResumo();
            alert('Gasto excluído com sucesso!');
        } else {
            alert('Erro ao excluir gasto');
        }
    } catch (error) {
        console.error('Error deleting gasto:', error);
        alert('Erro ao excluir gasto');
    }
}

// ==================== DESPESAS FUNCTIONS ====================

async function loadDespesas() {
    try {
        const params = getFilterParams();
        const response = await fetch(`/api/despesas?${params}`);
        const despesas = await response.json();
        
        const tbody = document.getElementById('despesasTableBody');
        
        if (despesas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">Nenhuma despesa registrada</td></tr>';
        } else {
            tbody.innerHTML = despesas.map(despesa => `
                <tr>
                    <td>${formatDate(despesa.data)}</td>
                    <td>${despesa.categoria}</td>
                    <td>${despesa.descricao}</td>
                    <td>R$ ${formatCurrency(despesa.valor)}</td>
                    <td class="action-buttons">
                        <button onclick="editDespesa(${despesa.id})" class="btn btn-warning">Editar</button>
                        <button onclick="deleteDespesa(${despesa.id})" class="btn btn-danger">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading despesas:', error);
        alert('Erro ao carregar despesas');
    }
}

function showDespesaForm() {
    document.getElementById('despesaFormContainer').style.display = 'block';
    document.getElementById('despesaFormTitle').textContent = 'Adicionar Despesa';
    document.getElementById('despesaForm').reset();
    document.getElementById('despesaId').value = '';
    document.getElementById('despesaData').valueAsDate = new Date();
}

function hideDespesaForm() {
    document.getElementById('despesaFormContainer').style.display = 'none';
    document.getElementById('despesaForm').reset();
}

async function submitDespesa(event) {
    event.preventDefault();
    
    const id = document.getElementById('despesaId').value;
    const data = {
        data: document.getElementById('despesaData').value,
        categoria: document.getElementById('despesaCategoria').value,
        descricao: document.getElementById('despesaDescricao').value,
        valor: parseFloat(document.getElementById('despesaValor').value)
    };
    
    try {
        const url = id ? `/api/despesas/${id}` : '/api/despesas';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            hideDespesaForm();
            loadDespesas();
            loadResumo();
            alert(id ? 'Despesa atualizada com sucesso!' : 'Despesa adicionada com sucesso!');
        } else {
            const error = await response.json();
            alert('Erro: ' + error.error);
        }
    } catch (error) {
        console.error('Error submitting despesa:', error);
        alert('Erro ao salvar despesa');
    }
}

async function editDespesa(id) {
    try {
        const params = getFilterParams();
        const response = await fetch(`/api/despesas?${params}`);
        const despesas = await response.json();
        const despesa = despesas.find(d => d.id === id);
        
        if (despesa) {
            document.getElementById('despesaId').value = despesa.id;
            document.getElementById('despesaData').value = despesa.data;
            document.getElementById('despesaCategoria').value = despesa.categoria;
            document.getElementById('despesaDescricao').value = despesa.descricao;
            document.getElementById('despesaValor').value = despesa.valor;
            document.getElementById('despesaFormTitle').textContent = 'Editar Despesa';
            document.getElementById('despesaFormContainer').style.display = 'block';
        }
    } catch (error) {
        console.error('Error editing despesa:', error);
        alert('Erro ao carregar despesa para edição');
    }
}

async function deleteDespesa(id) {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/despesas/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadDespesas();
            loadResumo();
            alert('Despesa excluída com sucesso!');
        } else {
            alert('Erro ao excluir despesa');
        }
    } catch (error) {
        console.error('Error deleting despesa:', error);
        alert('Erro ao excluir despesa');
    }
}

// ==================== REPORTS FUNCTIONS ====================

async function loadResumo() {
    try {
        const params = getFilterParams();
        const response = await fetch(`/api/relatorios/resumo?${params}`);
        const resumo = await response.json();
        
        document.getElementById('totalGastos').textContent = 'R$ ' + formatCurrency(resumo.total_gastos);
        document.getElementById('totalDespesas').textContent = 'R$ ' + formatCurrency(resumo.total_despesas);
        
        const saldoElement = document.getElementById('saldo');
        saldoElement.textContent = 'R$ ' + formatCurrency(resumo.saldo);
        
        // Update saldo color
        if (resumo.saldo > 0) {
            saldoElement.className = 'value positive';
        } else if (resumo.saldo < 0) {
            saldoElement.className = 'value negative';
        } else {
            saldoElement.className = 'value';
        }
    } catch (error) {
        console.error('Error loading resumo:', error);
    }
}

async function loadRelatorios() {
    try {
        const params = getFilterParams();
        
        // Load gastos por categoria
        const gastosResponse = await fetch(`/api/relatorios/gastos-por-categoria?${params}`);
        const gastosData = await gastosResponse.json();
        
        // Load despesas por categoria
        const despesasResponse = await fetch(`/api/relatorios/despesas-por-categoria?${params}`);
        const despesasData = await despesasResponse.json();
        
        // Create charts
        createGastosChart(gastosData);
        createDespesasChart(despesasData);
    } catch (error) {
        console.error('Error loading relatorios:', error);
    }
}

function createGastosChart(data) {
    const ctx = document.getElementById('gastosChart').getContext('2d');
    
    if (gastosChart) {
        gastosChart.destroy();
    }
    
    const colors = [
        '#667eea',
        '#764ba2',
        '#f093fb',
        '#4facfe',
        '#00f2fe',
        '#43e97b',
        '#38f9d7'
    ];
    
    gastosChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(item => item.categoria),
            datasets: [{
                data: data.map(item => item.total),
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': R$ ' + formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function createDespesasChart(data) {
    const ctx = document.getElementById('despesasChart').getContext('2d');
    
    if (despesasChart) {
        despesasChart.destroy();
    }
    
    const colors = [
        '#667eea',
        '#764ba2',
        '#f093fb',
        '#4facfe',
        '#00f2fe',
        '#43e97b',
        '#38f9d7'
    ];
    
    despesasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.categoria),
            datasets: [{
                label: 'Valor (R$)',
                data: data.map(item => item.total),
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y || 0;
                            return 'R$ ' + formatCurrency(value);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// ==================== UTILITY FUNCTIONS ====================

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatCurrency(value) {
    return parseFloat(value).toFixed(2).replace('.', ',');
}
