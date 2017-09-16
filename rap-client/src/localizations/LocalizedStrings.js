const LocalizedStrings = {
  localizedStrings: {
    'account_role.1': 'Visitor',
    'account_role.2': 'Regular',
    'account_role.3': 'Manager',
    'account_role.4': 'Admin',
    'account_role.5': 'Super User',

    'create_account.username': 'Username',
    'create_account.password': 'Password',
    'create_account.passwordConf': 'Password Confirmation',
    'create_account.name': 'Name',
    'create_account.email': 'Email',
    'create_account.role': 'Role',
  },

  getString(key) {
    return this.localizedStrings[key];
  },
};

export default LocalizedStrings;
