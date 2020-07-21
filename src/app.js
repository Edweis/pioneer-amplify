import Amplify, { API, graphqlOperation } from "@aws-amplify/api";

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

const SubscriptionResult = document.getElementById("SubscriptionResult");
API.graphql(graphqlOperation(onCreateTodo)).subscribe(event => {
  const item = event.value.data.onCreateTodo;
  SubscriptionResult.innerHTML += `<p>${item.name} - ${item.createdAt}</p>`
});

getData()
