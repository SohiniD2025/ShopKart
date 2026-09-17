import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../services/api";

const Profile = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetchProfile();

        setCustomer(response.data);
      } catch (error) {
        console.error(error);

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {customer.fullName}!
          </h1>

          <p className="text-gray-500 mb-8">
            Welcome to your ShopKart account.
          </p>

          <div className="space-y-4">
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold">{customer.fullName}</p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{customer.email}</p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{customer.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
