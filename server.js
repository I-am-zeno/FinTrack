const ctx = document.querySelector('.chart-area')
const transactionsContainer = document.querySelector('.transactions-container')
const addTransactionContainer = document.querySelector('.add-transaction-container')
const main = document.querySelector('main')
// const addTransaction = document.querySelector('.add-transaction')
// console.log(addTransaction)

let myChart = null
let income = 0
let expense = 0

const transactions = [
    {
        date: "2026-20-20",
        description: 'Coffee',
        category: 'Shopping',
        type: 'Expense',
        amount: '900'
    },
    {
        date: "20-20-20",
        description: 'Coffee',
        category: 'Shopping',
        type: 'Income',
        amount: '600'
    },
    {
        date: "20-20-20",
        description: 'Coffee',
        category: 'Shopping',
        type: 'Income',
        amount: '60'
    },
]

function updateCards(){
    // update cards here
    const totalIncome = transactions.reduce((acc,curr)=>{
        if(curr.type == 'Income'){
            return acc + Number(curr.amount)
        }

        return acc
    },0)   

    const totalExpense = transactions.reduce((acc,curr)=>{
        if(curr.type == 'Expense'){
            return acc + Number(curr.amount)
        }

        return acc
    },0)   

    const currentBalance = totalIncome - totalExpense
    
    const totalTransactions = transactions.length
    
    main.querySelector('#current-balance').textContent = '$'+ currentBalance
    main.querySelector('#total-income').textContent = '$'+ totalIncome
    main.querySelector('#total-expense').textContent = '$'+ totalExpense
    main.querySelector('#total-transactions').textContent = totalTransactions

    income = totalIncome
    expense = totalExpense

    // updateChart()
}

function renderTransactions() {
    transactionsContainer.innerHTML = transactions.map(t => `
        <div class="transaction" data-type=${t.type}>
            <p>${t.date}</p>
            <p>${t.description}</p>
            <div>
            <p>${t.category}</p>
            </div>
            <p>${t.type == 'Income' ? '+' : '-'}$${t.amount}</p>
            <div>
                <i class="ri-pencil-fill"></i>
                <i class="ri-delete-bin-2-fill"></i>
            </div>
        </div>
    `).join('');
}

function toggleTransaction() {
    addTransactionContainer.classList.toggle('none')
}

function createTransaction(e) {
    const parent = e.closest('.add-transaction')
    const type = parent.children[2].value
    const description = parent.children[4].value
    const amount = parent.children[5].children[0].children[1].value
    const date = parent.children[5].children[1].children[1].value
    const category = parent.children[7].value
    console.log(type, description, amount, date, category)

    if (!type || !description || !amount || !date || !category) {
        alert('All fields are required')
        return
    }

    const newTransaction = {
        type,
        description,
        amount,
        date,
        category
    }

    transactions.unshift(newTransaction)
    updateCards()
    renderTransactions()
    console.log(transactions)
    parent.closest('.add-transaction-container').classList.add('none')
}

document.body.addEventListener('click', (e) => {
    if (e.target.closest('.ri-close-fill')) {
        toggleTransaction()
        return
    }
    if (e.target.closest('.add-btn')) {
        toggleTransaction()
        return
    }
    if (e.target.closest('.save-transaction')) {
        createTransaction(e.target)
        return
    }
})

function updateChart() {
    if (myChart) { myChart.destroy() }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Income vs Expense"],
            datasets: [
                { label: 'Income', data: [200], backgroundColor: '#166534', borderRadius: 4 },
                { label: 'Expense', data: [300], backgroundColor: '#991b1b', borderRadius: 4 }
            ]
        }
    })
}

updateChart()
renderTransactions()
updateCards()