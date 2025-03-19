import { useMutation, useQueryClient } from "react-query";
import { createAnecdote } from "../requests";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const AnecdoteForm = () => {
  const [notification, dispatch] = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries("anecdotes");
    },
    onError: (error) => {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.error || "Something went wrong",
      });
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";

    if (content.length < 5) {
      dispatch({ type: "SHORT" });
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
      return;
    }

    newAnecdoteMutation.mutate({ content, votes: 0 });
    dispatch({ type: "POST", payload: content });
    setTimeout(() => {
      dispatch({ type: "RESET" });
    }, 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
