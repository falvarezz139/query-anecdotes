import { useQuery } from "react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import AnecdoteList from "./components/AnecdoteList";
import { getAnecdotes } from "./requests";
import NotificationContext from "./NotificationContext";
import { useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "VOTE":
      return `you voted ${action.payload.content}`;
    case "POST":
      return `you posted ${action.payload}`;
    case "SHORT":
      return "Anecdote needs to be atleast 5 characters";
    case "RESET":
      return "";
    default:
      return state;
  }
};

const App = () => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );

  const { status, data } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
  });

  return status === "success" ? (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <div>
        <h3>Anecdote app</h3>
        <Notification />
        <AnecdoteForm />
        <AnecdoteList anecdotes={data} />
      </div>
    </NotificationContext.Provider>
  ) : (
    <h1>anecdote service not available due to problems in the server</h1>
  );
};

export default App;
