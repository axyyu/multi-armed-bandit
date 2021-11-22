import { v4 as uuidv4 } from "uuid";

const ID_KEY = "multi-armed-bandit-user-id";

export function getId() {
  let userId = localStorage.getItem(ID_KEY);
  if (userId) return userId;

  userId = uuidv4();
  localStorage.setItem(ID_KEY, userId);
  return userId;
}
