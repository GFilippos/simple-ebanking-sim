'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort=false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i){
    const type = mov>0? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
} 

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`
};


const createUsernames = function(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  })
};
createUsernames(accounts);

// Maximum value

const movements = account1.movements;
const maxMovement = movements.reduce((acc, mov) => mov>acc? mov : acc,Number.MIN_VALUE);
console.log(maxMovement);

const calcDisplaySummary = function(acc) {
  const movements = acc.movements
  // income
  const incomes = movements
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0); 
  labelSumIn.textContent = `${incomes}€`;
  // outcome
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur,0);
  labelSumOut.textContent = `${Math.abs(out)}€`
  // interest
  const interest = movements
  .filter(mov => mov > 0)
  .map(mov => (mov * acc.interestRate)/100)
  .filter(mov => mov>1)
  .reduce((acc, mov) => acc + mov, 0)
  labelSumInterest.textContent = `${interest}€`
}

//Event Handlers 
let currentAccount;
btnLogin.addEventListener('click', function(e){
  // prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
    // Clear input field

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    
    // Update UI
    updateUI(currentAccount);
  }
})

const updateUI = function(acc) {
  displayMovements(acc.movements);
    // Display balance
  calcDisplayBalance(acc);
    // Display summary 
  calcDisplaySummary(acc);
}


btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  console.log(amount, receiverAcc);
  if(amount>0 && currentAccount.balance >= amount && receiverAcc && receiverAcc.username !== currentAccount.username) {
    // Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur()
    inputTransferTo.blur()
    // UpdateUI
    updateUI(currentAccount);
  }

})

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount>0 && currentAccount.movements.some(mov => mov >= amount*0.1)) {
    currentAccount.movements.push(amount);

    // UpdateUI
    updateUI(currentAccount);
    inputLoanAmount.value = "";
  };
})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Goodbye, ${currentAccount.owner.split(' ')[0]}`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})

labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', '')));
  console.log(movementsUI);
})






/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

