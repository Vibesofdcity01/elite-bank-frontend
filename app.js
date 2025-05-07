function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [securityAnswer, setSecurityAnswer] = React.useState('');
  const [securityQuestion, setSecurityQuestion] = React.useState('');
  const [showSecurityQuestion, setShowSecurityQuestion] = React.useState(false);
  const [depositAmount, setDepositAmount] = React.useState('');
  const [receiptFile, setReceiptFile] = React.useState(null);
  const [withdrawAmount, setWithdrawAmount] = React.useState('');
  const [bankDetails, setBankDetails] = React.useState('');
  const backendUrl = 'https://56.228.77.200';
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  const handleCheckEmail = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/auth/check-email`, {
        email
      });
      setSecurityQuestion(response.data.securityQuestion);
      setShowSecurityQuestion(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setShowSecurityQuestion(false);
    }
  };
  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
        securityAnswer
      });
      const {
        token,
        user
      } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };
  const handleDeposit = async e => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('amount', depositAmount);
    formData.append('receipt', receiptFile);
    try {
      const response = await axios.post(`${backendUrl}/api/transactions/deposit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.message);
      setDepositAmount('');
      setReceiptFile(null);
      const userResponse = await axios.get(`${backendUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(userResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during deposit');
    }
  };
  const handleWithdraw = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${backendUrl}/api/transactions/withdraw`, {
        amount: withdrawAmount,
        type: 'withdrawal',
        bankDetails
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert(`${response.data.message} (Fee: $${response.data.fee})`);
      setWithdrawAmount('');
      setBankDetails('');
      const userResponse = await axios.get(`${backendUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(userResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during withdrawal');
    }
  };
  React.useEffect(() => {
    if (token) {
      axios.get(`${backendUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => setUser(response.data)).catch(() => handleLogout());
    }
  }, [token]);
  if (token && user) {
    return React.createElement('div', {
      className: 'min-h-screen bg-gray-100'
    }, React.createElement('nav', {
      className: 'bg-blue-900 text-white p-4'
    }, React.createElement('div', {
      className: 'container mx-auto flex justify-between items-center'
    }, React.createElement('h1', {
      className: 'text-2xl font-bold'
    }, 'Elite Investment Bank'), React.createElement('button', {
      onClick: handleLogout,
      className: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
    }, 'Logout'))), React.createElement('div', {
      className: 'container mx-auto p-6'
    }, React.createElement('h2', {
      className: 'text-3xl font-semibold mb-4'
    }, `Welcome, ${user.username}`), React.createElement('p', {
      className: 'text-lg mb-4'
    }, `Account Balance: $${user.balance}`), error && React.createElement('p', {
      className: 'text-red-500 mb-4'
    }, error), React.createElement('div', {
      className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'
    }, React.createElement('div', {
      className: 'bg-white p-6 rounded-lg shadow-md'
    }, React.createElement('h3', {
      className: 'text-xl font-semibold mb-4'
    }, 'Deposit Funds'), React.createElement('form', {
      onSubmit: handleDeposit,
      className: 'space-y-4'
    }, React.createElement('div', null, React.createElement('label', {
      className: 'block text-sm font-medium text-gray-700'
    }, 'Amount'), React.createElement('input', {
      type: 'number',
      value: depositAmount,
      onChange: e => setDepositAmount(e.target.value),
      className: 'w-full p-2 border rounded-md',
      required: true
    })), React.createElement('div', null, React.createElement('label', {
      className: 'block text-sm font-medium text-gray-700'
    }, 'Receipt'), React.createElement('input', {
      type: 'file',
      onChange: e => setReceiptFile(e.target.files[0]),
      className: 'w-full p-2 border rounded-md',
      required: true
    })), React.createElement('button', {
      type: 'submit',
      className: 'w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
    }, 'Deposit'))), React.createElement('div', {
      className: 'bg-white p-6 rounded-lg shadow-md'
    }, React.createElement('h3', {
      className: 'text-xl font-semibold mb-4'
    }, 'Withdraw Funds'), React.createElement('form', {
      onSubmit: handleWithdraw,
      className: 'space-y-4'
    }, React.createElement('div', null, React.createElement('label', {
      className: 'block text-sm font-medium text-gray-700'
    }, 'Amount'), React.createElement('input', {
      type: 'number',
      value: withdrawAmount,
      onChange: e => setWithdrawAmount(e.target.value),
      className: 'w-full p-2 border rounded-md',
      required: true
    })), React.createElement('div', null, React.createElement('label', {
      className: 'block text-sm font-medium text-gray-700'
    }, 'Bank Details'), React.createElement('input', {
      type: 'text',
      value: bankDetails,
      onChange: e => setBankDetails(e.target.value),
      className: 'w-full p-2 border rounded-md',
      required: true
    })), React.createElement('button', {
      type: 'submit',
      className: 'w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'
    }, 'Withdraw')))), user.isAdmin && React.createElement('div', {
      className: 'bg-white p-6 rounded-lg shadow-md'
    }, React.createElement('h3', {
      className: 'text-xl font-semibold mb-4'
    }, 'Admin Access'), React.createElement('p', null, 'Manage users and transactions at: ', React.createElement('a', {
      href: 'https://melodious-elf-86c8cb.netlify.app',
      className: 'text-blue-500 hover:underline'
    }, 'Admin Dashboard')))));
  }
  return React.createElement('div', {
    className: 'min-h-screen bg-gray-100'
  }, React.createElement('nav', {
    className: 'bg-blue-900 text-white p-4'
  }, React.createElement('div', {
    className: 'container mx-auto flex justify-between items-center'
  }, React.createElement('h1', {
    className: 'text-2xl font-bold'
  }, 'Elite Investment Bank'))), React.createElement('div', {
    className: 'container mx-auto p-6'
  }, React.createElement('div', {
    className: 'max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'
  }, React.createElement('h2', {
    className: 'text-2xl font-semibold mb-4 text-center'
  }, 'Login to Your Account'), error && React.createElement('p', {
    className: 'text-red-500 mb-4 text-center'
  }, error), !showSecurityQuestion ? React.createElement('form', {
    onSubmit: handleCheckEmail,
    className: 'space-y-4'
  }, React.createElement('div', null, React.createElement('label', {
    className: 'block text-sm font-medium text-gray-700'
  }, 'Email'), React.createElement('input', {
    type: 'email',
    value: email,
    onChange: e => setEmail(e.target.value),
    className: 'w-full p-2 border rounded-md',
    required: true
  })), React.createElement('button', {
    type: 'submit',
    className: 'w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
  }, 'Next')) : React.createElement('form', {
    onSubmit: handleLogin,
    className: 'space-y-4'
  }, React.createElement('div', null, React.createElement('label', {
    className: 'block text-sm font-medium text-gray-700'
  }, 'Email'), React.createElement('input', {
    type: 'email',
    value: email,
    readOnly: true,
    className: 'w-full p-2 border rounded-md bg-gray-200'
  })), React.createElement('div', null, React.createElement('label', {
    className: 'block text-sm font-medium text-gray-700'
  }, 'Password'), React.createElement('input', {
    type: 'password',
    value: password,
    onChange: e => setPassword(e.target.value),
    className: 'w-full p-2 border rounded-md',
    required: true
  })), React.createElement('div', null, React.createElement('label', {
    className: 'block text-sm font-medium text-gray-700'
  }, securityQuestion), React.createElement('input', {
    type: 'text',
    value: securityAnswer,
    onChange: e => setSecurityAnswer(e.target.value),
    className: 'w-full p-2 border rounded-md',
    required: true
  })), React.createElement('button', {
    type: 'submit',
    className: 'w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
  }, 'Login')))));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
