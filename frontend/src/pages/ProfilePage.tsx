import { useEffect, useState } from "react";
import api from "../services/api";
import { getCurrentUser, saveAuth, getToken } from "../services/auth";
import { User } from "../types";

const ProfilePage = () => {
  const current = getCurrentUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pointsInfo, setPointsInfo] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!current) return;
    api.get(`/user/profile/${current.id}`).then((res) => {
      setProfile(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
    });
    api.get(`/user/${current.id}/points`).then((res) => setPointsInfo(res.data));
  }, []);

  const update = async () => {
    const { data } = await api.put("/user/update", { username, email });
    setProfile(data.user);
    const token = getToken();
    if (token && data.user) {
      saveAuth(token, {
        id: data.user._id || current!.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role || current!.role,
        tier: data.user.tier
      });
    }
    setMessage("Profile updated successfully");
  };

  if (!profile) return <div className="container py-4">Loading profile...</div>;

  return (
    <div className="container py-4">
      <h2>My Profile</h2>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="card p-3 mb-3">
        <label>Username</label>
        <input className="form-control mb-2" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Email</label>
        <input className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn btn-dark" onClick={update}>
          Save Changes
        </button>
      </div>
      {pointsInfo && (
        <div className="card p-3">
          <h5>Loyalty Summary</h5>
          <p>Points Balance: {pointsInfo.pointsBalance}</p>
          <p>Bonus Points: {pointsInfo.bonusPoints}</p>
          <p>Tier: {pointsInfo.tier}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
