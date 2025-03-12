// Initialize owner account if not already created
function initializeOwner() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const ownerExists = users.some(user => user.username === 'Rusith');

  if (!ownerExists) {
    const owner = {
      username: 'Rusith',
      password: '123',
      role: 'owner',
      approved: true
    };
    users.push(owner);
    localStorage.setItem('users', JSON.stringify(users));
  }
}

initializeOwner();

// Handle Registration Form Submission
document.getElementById('register-form')?.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the default form submission

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    alert('Username already exists. Please choose a different username.');
    return;
  }

  // Add the new user with approved: false
  const newUser = {
    username: username,
    password: password,
    role: 'user',
    approved: false
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Show success message
  document.getElementById('message').textContent =
    'Registered successfully! Wait for admin approval.';
  document.getElementById('register-form').reset();
});

// Handle Login Form Submission
document.getElementById('login-form')?.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the default form submission

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    if (!user.approved) {
      alert('Your account is not approved yet.');
      return;
    }

    // Store the logged-in user's details
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    // Redirect based on role
    if (user.role === 'owner' || user.role === 'admin') {
      window.location.href = '../pages/admin.html'; // Redirect to admin panel
    } else {
      window.location.href = '../pages/dashboard.html'; // Redirect to user dashboard
    }
  } else {
    alert('Invalid credentials. Please try again.');
  }
});

// Load users into the admin panel
function loadUsers() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const tableBody = document.querySelector('#user-table tbody');
  tableBody.innerHTML = '';

  users.forEach((user, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>${user.approved ? 'Yes' : 'No'}</td>
      <td>
        <button onclick="approveUser(${index})">Approve</button>
        <button onclick="deleteUser(${index})">Delete</button>
        <button onclick="changePassword(${index})">Change Password</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Approve a user
function approveUser(index) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users[index].approved = true;
  localStorage.setItem('users', JSON.stringify(users));
  loadUsers();
}

// Delete a user
function deleteUser(index) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.splice(index, 1);
  localStorage.setItem('users', JSON.stringify(users));
  loadUsers();
}

// Change a user's password
function changePassword(index) {
  const newPassword = prompt('Enter new password:');
  if (newPassword) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users[index].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
  }
}

// Handle Edit Form Link
document.getElementById('edit-form-link')?.addEventListener('click', function (e) {
  e.preventDefault();
  const formSettings = document.getElementById('form-settings');
  formSettings.style.display = formSettings.style.display === 'none' ? 'block' : 'none';
});

// Load default date for admin panel
function loadDefaultDateForAdmin() {
  const defaultDate = localStorage.getItem('defaultDate') || new Date().toISOString().split('T')[0];
  document.getElementById('default-date').value = defaultDate;
}

// Save default date
document.getElementById('set-date-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const defaultDate = document.getElementById('default-date').value;
  localStorage.setItem('defaultDate', defaultDate);
  alert('Default date updated successfully!');
  loadDefaultDateForDashboard();
});

// Load default date on the dashboard
function loadDefaultDateForDashboard() {
  const defaultDate = localStorage.getItem('defaultDate') || new Date().toISOString().split('T')[0];
  document.getElementById('date')?.setAttribute('value', defaultDate);
}

// Load food preferences for admin panel
function loadFoodPreferencesForAdmin() {
  const foodPreferences = JSON.parse(localStorage.getItem('foodPreferences')) || ['Vegetarian', 'Non-Vegetarian', 'None'];
  const foodPreferencesList = document.getElementById('food-preferences-list');
  foodPreferencesList.innerHTML = '';

  foodPreferences.forEach((preference, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = preference;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => removeFoodPreference(index);
    listItem.appendChild(removeButton);
    foodPreferencesList.appendChild(listItem);
  });

  loadFoodPreferencesForDashboard(foodPreferences);
}

// Load food preferences for the dashboard
function loadFoodPreferencesForDashboard(foodPreferences) {
  const foodPreferenceDropdown = document.getElementById('food-preference');
  foodPreferenceDropdown.innerHTML = '<option value="">Select</option>';

  foodPreferences.forEach(preference => {
    const option = document.createElement('option');
    option.value = preference;
    option.textContent = preference;
    foodPreferenceDropdown.appendChild(option);
  });
}

// Add new food preference
document.getElementById('add-food-preference')?.addEventListener('click', function () {
  const newPreference = document.getElementById('new-food-preference').value.trim();
  if (!newPreference) {
    alert('Please enter a valid food preference.');
    return;
  }

  const foodPreferences = JSON.parse(localStorage.getItem('foodPreferences')) || [];
  foodPreferences.push(newPreference);
  localStorage.setItem('foodPreferences', JSON.stringify(foodPreferences));
  document.getElementById('new-food-preference').value = '';
  loadFoodPreferencesForAdmin();
});

// Remove a food preference
function removeFoodPreference(index) {
  const foodPreferences = JSON.parse(localStorage.getItem('foodPreferences')) || [];
  foodPreferences.splice(index, 1);
  localStorage.setItem('foodPreferences', JSON.stringify(foodPreferences));
  loadFoodPreferencesForAdmin();
}

// Conditional logic for "Do you attend or not?"
document.getElementById('attend')?.addEventListener('change', function () {
  const foodPreferenceDropdown = document.getElementById('food-preference');
  if (this.value === 'No') {
    foodPreferenceDropdown.disabled = true;
    foodPreferenceDropdown.value = '';
  } else {
    foodPreferenceDropdown.disabled = false;
  }
});

// Load all admin panel data on page load
if (window.location.pathname.includes('admin.html')) {
  document.addEventListener('DOMContentLoaded', function () {
    loadUsers();
    loadDefaultDateForAdmin();
    loadFoodPreferencesForAdmin();
  });
}

// Load dashboard-specific data on page load
if (window.location.pathname.includes('dashboard.html')) {
  document.addEventListener('DOMContentLoaded', function () {
    loadDefaultDateForDashboard();
    loadFoodPreferencesForDashboard(JSON.parse(localStorage.getItem('foodPreferences')) || ['Vegetarian', 'Non-Vegetarian', 'None']);
  });
}