const ctx = document.querySelector('.chart-area').getContext('2d')
const transactionsContainer = document.querySelector('.transactions-container')
const addTransactionContainer = document.querySelector('.add-transaction-container')
const main = document.querySelector('main')
// const addTransaction = document.querySelector('.add-transaction')
// console.log(addTransaction)
// localStorage.clear()

let myChart = null
let income = 0
let expense = 0

let transactions = getLocalStorage()

function updateCards() {
    const totalInEx = transactions.reduce((a, c) => {
        const key = `total${c.type}`
        a[key] = (a[key] || 0) + Number(c.amount)
        return a
    }, {})

    const currentBalance =
        (totalInEx.totalIncome || 0) -
        (totalInEx.totalExpense || 0)

    const totalTransactions = transactions.length

    main.querySelector('#current-balance').textContent = '$' + currentBalance
    main.querySelector('#total-income').textContent = '$' + (totalInEx.totalIncome || 0)
    main.querySelector('#total-expense').textContent = '$' + (totalInEx.totalExpense || 0)
    main.querySelector('#total-transactions').textContent = totalTransactions

    income = totalInEx.totalIncome || 0
    expense = totalInEx.totalExpense || 0

    updateChart()
}

function renderTransactions() {
    transactionsContainer.innerHTML = transactions.map(t => `
        <div class="transaction" data-type=${t.type} data-id=${t.id}>
            <p>${t.date}</p>
            <p>${t.description}</p>
            <div>
            <p>${t.category}</p>
            </div>
            <p>${t.type == 'Income' ? '+' : '-'}$${t.amount}</p>
            <div>
                <i class="ri-pencil-fill edit"></i>
                <i class="ri-delete-bin-2-fill remove"></i>
            </div>
        </div>
    `).join('');

}

function createTransaction(e) {
    const parent = e.closest('.add-transaction')
    const type = parent.querySelector('[name= "type"]').value
    const description = parent.querySelector('[name= "description"]').value
    const amount = parent.querySelector('[name= "amount"]').value
    const date = parent.querySelector('[name= "date"]').value
    const category = parent.querySelector('[name= "category"]').value

    if (!type || !description || !amount || !date || !category) {
        alert('All fields are required')
        return
    }

    const newTransaction = {
        id: Date.now(),
        type,
        description,
        amount,
        date,
        category
    }

    closeTransaction()
    transactions.unshift(newTransaction)
    setLocalStorage(transactions)
    updateCards()
    renderTransactions()
    parent.closest('.add-transaction-container').classList.add('none')
}

function closeTransaction() {
    const grandParent = main.querySelector(".add-transaction-container")
    const parent = main.querySelector(".add-transaction")

    parent.children[4].value = ''
    parent.children[5].children[0].children[1].value = ''
    parent.children[5].children[1].children[1].value = ''

    grandParent.classList.toggle('none')
    return
}

function removeTransaction(e) {
    const parent = e.closest('.transaction')

    const permission = confirm('Are you sure you want to delet this transaction')

    if (!permission) return

    const updatedData = transactions.filter(t => t.id !== Number(parent.dataset.id))

    transactions = updatedData

    setLocalStorage(updatedData)

    parent.remove()
    updateCards()
}

function reset() {
    if (transactions.length === 0) return

    if (!confirm('Are you sure you want to remove all the existing data')) return

    transactions = []
    clearLocalStorage()

    updateCards()
    renderTransactions()
}

function updateChart() {
    if (myChart) { myChart.destroy() }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Income vs Expense"],
            datasets: [
                { label: 'Income', data: [income], backgroundColor: '#166534', borderRadius: 4 },
                { label: 'Expense', data: [expense], backgroundColor: '#991b1b', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false // Crucial: stops the height from stretching infinitely
        }
    })
}

function setLocalStorage(arr) {
    if (!arr || !Array.isArray(arr)) return
    localStorage.setItem('transactions', JSON.stringify(arr))
}

function getLocalStorage() {
    const data = localStorage.getItem('transactions')
        ? JSON.parse(localStorage.getItem('transactions'))
        : []

    return data
}

function clearLocalStorage() {
    localStorage.clear()
}

document.body.addEventListener('click', (e) => {
    if (e.target.closest('.ri-close-fill')) {
        closeTransaction(e.target)
    }
    if (e.target.closest('.add-btn')) {
        const grandParent = main.querySelector(".add-transaction-container")
        grandParent.classList.toggle('none')
        return
    }
    if (e.target.closest('.save-transaction')) {
        createTransaction(e.target)
        return
    }
    if (e.target.closest('.remove')) {
        removeTransaction(e.target)
        return
    }
    if (e.target.closest('.reset-btn')) {
        reset()
        return
    }
    if (e.target.closest('.toggle')) {
        document.body.classList.toggle('dark-theme')
        return
    }
})

updateChart()
renderTransactions()
updateCards()