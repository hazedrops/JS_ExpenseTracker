const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const close = document.getElementById('close');
const modal = document.getElementById('modal');
const modal_form = document.getElementsByClassName('modal_form');

const update_text = document.getElementById('update_text');
const update_amount = document.getElementById('update_amount');
const error_msg1 = document.getElementById('error_msg1');
const error_msg2 = document.getElementById('error_msg2');

const close_update = document.getElementById('close_update');

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : []; // Check if anything is in the local storage

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value, // + sign turns 'string' amount into the 'number'
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span><button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })"><span="btn-text">X</span></button><button class="update-btn" onclick="updateTransaction(${
    transaction.id
  })"><span="btn-text">U</span></button>

  `;

  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  // console.log(amounts);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  // console.log(transactions);

  updateLocalStorage();

  init(); // Reload all the contents on the page
}

function updateTransaction(id) {
  modal.classList.add('show-modal');
  //   transactions = transactions.filter(transaction => transaction.id !== id);
  //   updateLocalStorage();
  //   init(); // Reload all the contents on the page
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);

  updateValues();
}

init();

// Event Listeners
// Add transaction
form.addEventListener('submit', addTransaction);

close_update.addEventListener('click', (e) => {
  e.preventDefault();

  if (update_text.value.length === 0) {
    // Show error message
    error_msg1.style.display = 'block';
    error_msg1.innerHTML = 'Please enter the transaction text...';
  }

  if (update_amount.value.length === 0) {
    // Show error message
    error_msg2.style.display = 'block';
    error_msg2.innerHTML = 'Please enter the transaction amount...';
  }

  if (update_text.value.length !== 0 && update_amount.value.length !== 0) {
    clearErrMsg();
    console.log(transactions);
    console.log(update_text.value, update_amount.value);
    // pass the values
    forEach();
    // close the modal
  }
});

// Hide modal
close.addEventListener('click', () => {
  clearErrMsg();
  modal.classList.remove('show-modal');
});

// Hide modal on outside click
// window.addEventListener('click', e =>
//   e.target == modal ? modal.classList.remove('show-modal') : false
// );

function clearErrMsg() {
  error_msg1.innerHTML = '';
  error_msg2.innerHTML = '';
}
