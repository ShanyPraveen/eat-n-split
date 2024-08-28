import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App () {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleSetFriend (newFriend) {
    setFriends((fs) => [...fs, newFriend]);
    setIsAddFriendOpen(false)
  }

  function handleSetSelectedFriend (friend) {
    setSelectedFriend((f) => f?.id == friend.id ? null : friend);
    setIsAddFriendOpen(false)
  }

  function handleUpdateFriend (value) {
    setFriends((fs) =>  fs.map((f) => selectedFriend.id === f.id ? {...f, balance: f.balance + value} : f));
    setSelectedFriend(null);
  }

  return <div className="app">
    <div className="sidebar">
      <Friends selectedFriend={selectedFriend} setSelectedFriend={handleSetSelectedFriend} friends={friends}/>
      {isAddFriendOpen && <FormAddFriend addFriend={handleSetFriend}/>}
      <Button onClick={() => setIsAddFriendOpen((isOpen) => !isOpen)}>{isAddFriendOpen ? "close" : "Add Friend"}</Button>
    </div>
    {selectedFriend && <FormAddBill selectedFriend={selectedFriend} handleUpdateFriend={handleUpdateFriend}/>}
  </div>
}

function Friends ({friends, selectedFriend, setSelectedFriend}) {
  return <ul>
    {friends.map(friend => <Friend selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} key={friend.id} friend={friend}/>)}
  </ul>
}

function Friend ({friend, selectedFriend, setSelectedFriend}) {
  return <li className={selectedFriend?.id === friend.id ? "selected" : ""}>
    <img src={friend.image}></img>
    <h3>{friend.name}</h3>
    {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p>}
    {friend.balance > 0 && <p className="green">{friend.name} owes you {friend.balance}$</p>}
    {friend.balance === 0 && <p>You and {friend.name} are even</p>}
    <Button onClick={() => setSelectedFriend(friend)}>{selectedFriend?.id === friend.id ? "close" : "Select"}</Button>
  </li>
}

function FormAddFriend ({addFriend}) {
  const [name, setName] = useState("");
  const [image, setImage]= useState("https://i.pravatar.cc/48");

  function handleAddFriend (e) {
    e.preventDefault();

    if(!name || !image) return;

    const id = Date.now()
    const newFriend = {
      name: name,
      image: `${image}?id=${id}`,
      balance: 0,
      id: id
    }

    addFriend(newFriend)
    setImage("https://i.pravatar.cc/48");
    setName("")
  }

  return <form onSubmit={(e) => handleAddFriend(e)} className="form-add-friend">
    <label>🧑‍🤝‍🧑Name</label>
    <input onChange={(e) => setName(e.target.value)} value={name} type="text"/>

    <label>📸 Image URl</label>
    <input onChange={(e) => setImage(e.target.value)} value={image} type="text"/>

    <Button>Add</Button>
  </form>
}

function Button ({children, onClick}) {
  return <button onClick={onClick} className="button">{children}</button>
}

function FormAddBill ({selectedFriend, handleUpdateFriend}) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whosPaying, setWhosPaying] = useState("you");

  const friendsExpense = bill ? bill - paidByUser : "";

  function handleSubmit (e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    handleUpdateFriend(whosPaying === "you" ? friendsExpense : -paidByUser );
  }

  return <form onSubmit={handleSubmit} className="form-split-bill">
    <h2>Split a bill with {selectedFriend.name}</h2>
    <label>💴 Value</label>
    <input value={bill} onChange={(e) => setBill(Number(e.target.value))} type="text"/>

    <label>🙍‍♂️ Your Expense</label>
    <input value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))} type="text"/>

    <label>🧑‍🤝‍🧑 {selectedFriend.name}'s Expense</label>
    <input value={friendsExpense} disabled={true} type="text"/>

    <label>🤑 Who's paying the bill</label>
    <select value={whosPaying} onChange={(e) => setWhosPaying(e.target.value)}>
      <option value="you">you</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>

    <Button>Split Bill</Button>
  </form>
}
