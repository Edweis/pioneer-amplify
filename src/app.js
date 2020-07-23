import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify';

import awsconfig from "./aws-exports";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { onCreateTodo } from "./graphql/subscriptions";
Amplify.configure(awsconfig);

async function createNewTodo() {
  const todo = {
    name: "Use AppSync",
    description: `Realtime and Offline (${new Date().toLocaleString()})`,
  };

  return await API.graphql(graphqlOperation(createTodo, { input: todo }));
}


const MutationButton = document.getElementById("MutationEventButton");
const MutationResult = document.getElementById("MutationResult");

MutationButton.addEventListener("click", (evt) => {
  createNewTodo().then((evt) => {
    console.debug(evt)
    MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`;
  });
});

const QueryResult = document.getElementById("QueryResult");
const getData = async ()=> {
  return await API.graphql(graphqlOperation(listTodos)).then(event => event.data.listTodos.items.map(item => {
    QueryResult.innerHTML += `<p>${item.name} - ${item.createdAt}</p>`
  }));
}
getData()

const SubscriptionResult = document.getElementById("SubscriptionResult");
API.graphql(graphqlOperation(onCreateTodo)).subscribe(event => {
  const item = event.value.data.onCreateTodo;
  SubscriptionResult.innerHTML += `<p>${item.name} - ${item.createdAt}</p>`
});

const signUp = async (username, password, email)=> {
    try {
        const user = await Auth.signUp({ username, password, attributes:{email} });
        console.log({ user });
    } catch (error) {
        console.log('error signing up:', error);
    }
}

const confirmSignUp = async (username, code) => {
  try {
    const confirm = await Auth.confirmSignUp(username, code);
    console.debug('OK', confirm);
  }catch(error){console.error(error)}
}

const login =  async (username, password) => {
  try {
    const user = await Auth.signIn(username, password);
    console.debug('OK', user)
  } catch (error) {
      console.log('error signing in', error);
  }
}

const SignInForm = document.getElementById('sign-up-form');
SignInForm.addEventListener("submit", event => {
  event.preventDefault();
  const username =  document.getElementById('sign-up-username').value;
  const password =  document.getElementById('sign-up-password').value;
  const email =  document.getElementById('sign-up-email').value;
  signUp(username, password, email)
});

const ConfirmForm = document.getElementById('confirm-form');
ConfirmForm.addEventListener("submit", event => {
  event.preventDefault();
  const username =  document.getElementById('confirm-username').value;
  const code =  document.getElementById('confirm-code').value;
  confirmSignUp(username, code)
});

const SignIn = document.getElementById('login-form');
SignIn.addEventListener("submit", event => {
  event.preventDefault();
  const username =  document.getElementById('login-username').value;
  const password =  document.getElementById('login-password').value;
  login(username, password)
});
